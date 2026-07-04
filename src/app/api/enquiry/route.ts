import { Resend } from "resend";

// Where enquiries land. From-address must be on a Resend-verified domain —
// until goldengroupblr.com DNS is verified, Resend only delivers to the
// account owner's own email, so both are overridable per environment.
const TO_EMAIL = process.env.ENQUIRY_TO_EMAIL ?? "Sales@goldengroupblr.com";
const CAREERS_TO_EMAIL =
  process.env.CAREERS_TO_EMAIL ?? "Careers@goldengroupblr.com";
const FROM_EMAIL =
  process.env.ENQUIRY_FROM_EMAIL ??
  "Golden Group Website <enquiry@goldengroupblr.com>";

// Keep resumes under Vercel's ~4.5MB request body limit.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

type EnquiryPayload = {
  source?: "contact" | "project";
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  project?: {
    name?: string;
    slug?: string;
    location?: string;
    rera?: string;
    url?: string;
  };
};

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory sliding-window rate limit. Instances are reused under Fluid
// Compute so this holds across requests; a cold start resets it, which is
// acceptable for basic abuse protection.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  if (hits.size > 10_000) hits.clear();
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return Response.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  // Careers applications arrive as multipart (resume attachment); contact and
  // project enquiries as JSON.
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    return handleCareers(request);
  }

  let body: EnquiryPayload & { website?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real users never see this field; bots fill it. Pretend success.
  if (clean(body.website)) {
    return Response.json({ ok: true, delivered: false });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 4000);
  if (!name || !EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "A name and a valid email are required" },
      { status: 400 },
    );
  }

  const isProject = body.source === "project";
  const project = isProject ? body.project : undefined;

  // Stable prefixes so the sales inbox can filter the two streams apart.
  const subject = isProject
    ? `Project Enquiry - ${clean(project?.name, 120) || "Unknown Project"}`
    : "Website Contact - New Enquiry";

  const lines = [
    isProject
      ? "New enquiry from a project detail page."
      : "New enquiry from the Contact page.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    "",
    `Message:`,
    message || "-",
  ];
  if (project) {
    lines.push(
      "",
      "Project details:",
      `  Project: ${clean(project.name, 120) || "-"}`,
      `  Location: ${clean(project.location, 200) || "-"}`,
      `  RERA: ${clean(project.rera, 60) || "-"}`,
      `  Page: ${clean(project.url, 300) || "-"}`,
    );
  }

  return sendEmail({
    to: TO_EMAIL,
    replyTo: email,
    subject,
    text: lines.join("\n"),
  });
}

async function handleCareers(request: Request) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 },
    );
  }

  // Honeypot (see JSON path above).
  if (clean(fd.get("website"))) {
    return Response.json({ ok: true, delivered: false });
  }

  const name = clean(fd.get("name"), 120);
  const email = clean(fd.get("email"), 200);
  const phone = clean(fd.get("phone"), 30);
  const role = clean(fd.get("role"), 120);
  const experience = clean(fd.get("experience"), 120);
  const message = clean(fd.get("message"), 4000);
  if (!name || !EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "A name and a valid email are required" },
      { status: 400 },
    );
  }

  const resume = fd.get("resume");
  let attachments:
    | { filename: string; content: Buffer }[]
    | undefined;
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > MAX_RESUME_BYTES) {
      return Response.json(
        { ok: false, error: "Resume too large (max 4MB)" },
        { status: 413 },
      );
    }
    attachments = [
      {
        filename: resume.name || "resume.pdf",
        content: Buffer.from(await resume.arrayBuffer()),
      },
    ];
  }

  const lines = [
    "New job application from the Careers form.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Function / Role: ${role || "-"}`,
    `Experience: ${experience || "-"}`,
    "",
    "Cover note:",
    message || "-",
    "",
    `Resume: ${attachments ? attachments[0].filename : "not attached"}`,
  ];

  return sendEmail({
    to: CAREERS_TO_EMAIL,
    replyTo: email,
    subject: `Careers - Application from ${name}`,
    text: lines.join("\n"),
    attachments,
  });
}

async function sendEmail({
  to,
  replyTo,
  subject,
  text,
  attachments,
}: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet (pre-handover) — accept the submission so the site
    // UX keeps working, but make the gap loud in the server logs.
    console.warn(
      `[enquiry] RESEND_API_KEY not set - NOT emailed. Subject: "${subject}", reply-to ${replyTo}`,
    );
    return Response.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    replyTo,
    subject,
    text,
    attachments,
  });
  if (error) {
    console.error("[enquiry] Resend send failed:", error);
    return Response.json(
      { ok: false, error: "Failed to send" },
      { status: 502 },
    );
  }
  return Response.json({ ok: true, delivered: true });
}
