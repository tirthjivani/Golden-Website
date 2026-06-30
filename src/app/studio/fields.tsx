"use client";

import { useEffect, useRef, useState } from "react";
import { projectImage, type ImageRef } from "@/lib/projects";

/* ---------------- primitives ---------------- */

const labelCls = "block text-[11px] uppercase tracking-wide text-white/50";
const inputCls =
  "w-full rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#c19b4d]";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-white/30">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className={inputCls}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  step?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        step={step}
        className={inputCls}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : Number(e.target.value))
        }
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        className={`${inputCls} resize-y leading-[1.5]`}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Field label={label}>
      <select
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm"
      aria-pressed={checked}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-[#c19b4d]" : "bg-[#3a3a3a]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      {label ? <span className="text-white/70">{label}</span> : null}
    </button>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  type = "button",
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "gold" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40";
  const styles =
    variant === "gold"
      ? "bg-[#c19b4d] text-black hover:bg-[#d6b25e]"
      : variant === "danger"
      ? "border border-[#5a2b2b] text-red-300 hover:bg-[#2a1414]"
      : "border border-[#464646] text-white/80 hover:border-[#c19b4d] hover:text-white";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

/* ---------------- image fields ---------------- */

type AssetFile = { name: string; ref: string; kind: string };

export function ImageField({
  label,
  value,
  slug,
  onChange,
  withMeta = true,
}: {
  label: string;
  value: ImageRef | undefined;
  slug: string;
  onChange: (v: ImageRef | undefined) => void;
  withMeta?: boolean;
}) {
  const src = value?.src ?? "";
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3">
      <span className={labelCls}>{label}</span>
      <div className="flex gap-3">
        <Thumb src={src} />
        <div className="flex flex-1 flex-col gap-2">
          <input
            className={inputCls}
            value={src}
            placeholder="path/in-folder.jpg, /abs.png or https://…"
            onChange={(e) =>
              onChange({ ...(value ?? {}), src: e.target.value })
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <UploadButton
              slug={slug}
              onUploaded={(ref) => onChange({ ...(value ?? {}), src: ref })}
            />
            <AssetPicker
              slug={slug}
              onPick={(ref) => onChange({ ...(value ?? {}), src: ref })}
            />
            {src ? (
              <Btn variant="danger" onClick={() => onChange(undefined)}>
                Clear
              </Btn>
            ) : null}
          </div>
        </div>
      </div>
      {withMeta ? (
        <ImageMetaFields
          value={value ?? { src }}
          onChange={(v) => onChange(v)}
        />
      ) : null}
    </div>
  );
}

// Shared editor for the optional ImageRef metadata. Empty inputs are stored as
// `undefined` so saved JSON stays clean. `dimFill` crushes a baked grey plan
// background to black on the live page.
export function ImageMetaFields({
  value,
  onChange,
}: {
  value: ImageRef;
  onChange: (v: ImageRef) => void;
}) {
  const set = (patch: Partial<ImageRef>) => onChange({ ...value, ...patch });
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          className={inputCls}
          value={value.alt ?? ""}
          placeholder="alt text"
          onChange={(e) => set({ alt: e.target.value || undefined })}
        />
        <input
          className={inputCls}
          value={value.caption ?? ""}
          placeholder="caption"
          onChange={(e) => set({ caption: e.target.value || undefined })}
        />
        <input
          className={inputCls}
          value={value.metric ?? ""}
          placeholder="metric (e.g. 3 BHK)"
          onChange={(e) => set({ metric: e.target.value || undefined })}
        />
        <input
          className={inputCls}
          value={value.label ?? ""}
          placeholder="label (e.g. Carpet area)"
          onChange={(e) => set({ label: e.target.value || undefined })}
        />
      </div>
      <Toggle
        checked={!!value.dimFill}
        onChange={(v) => set({ dimFill: v || undefined })}
        label="Dim grey background (plan images)"
      />
    </div>
  );
}

export function ImageListField({
  label,
  items,
  slug,
  onChange,
}: {
  label: string;
  items: ImageRef[];
  slug: string;
  onChange: (items: ImageRef[]) => void;
}) {
  const set = (i: number, v: ImageRef | undefined) => {
    const next = items.slice();
    if (v === undefined) next.splice(i, 1);
    else next[i] = v;
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  // Move a row to an explicit 1-based position (lets the editor reposition an
  // image without clicking the arrow repeatedly).
  const moveTo = (from: number, pos: number) => {
    const to = Math.max(0, Math.min(items.length - 1, pos - 1));
    if (to === from) return;
    const next = items.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };
  const [openRow, setOpenRow] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={labelCls}>
          {label} ({items.length})
        </span>
        <MultiUploadButton
          slug={slug}
          onUploaded={(refs) =>
            onChange([...items, ...refs.map((src) => ({ src }))])
          }
        />
      </div>
      {items.map((img, i) => {
        const open = openRow === i;
        return (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-2"
          >
            <div className="flex items-start gap-2">
              <Thumb src={img.src} />
              <div className="flex flex-1 flex-col gap-1.5">
                <input
                  className={inputCls}
                  value={img.src}
                  onChange={(e) => set(i, { ...img, src: e.target.value })}
                />
                <input
                  className={inputCls}
                  value={img.caption ?? ""}
                  placeholder="caption (optional)"
                  onChange={(e) =>
                    set(i, { ...img, caption: e.target.value || undefined })
                  }
                />
                <div className="flex items-center gap-2">
                  <Btn onClick={() => setOpenRow(open ? null : i)}>
                    {open ? "Hide details" : "Details ▾"}
                  </Btn>
                  <span className="text-[11px] text-white/30">position</span>
                  <input
                    type="number"
                    min={1}
                    max={items.length}
                    value={i + 1}
                    onChange={(e) => moveTo(i, Number(e.target.value))}
                    className="w-14 rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-1 text-xs text-white outline-none focus:border-[#c19b4d]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Btn onClick={() => move(i, -1)} title="Move up">
                  ↑
                </Btn>
                <Btn onClick={() => move(i, 1)} title="Move down">
                  ↓
                </Btn>
                <Btn variant="danger" onClick={() => set(i, undefined)}>
                  ✕
                </Btn>
              </div>
            </div>
            {open ? (
              <div className="border-t border-[#222] pt-2">
                <ImageMetaFields value={img} onChange={(v) => set(i, v)} />
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="flex gap-2">
        <Btn onClick={() => onChange([...items, { src: "" }])}>+ Add row</Btn>
        <AssetPicker
          slug={slug}
          onPick={(ref) => onChange([...items, { src: ref }])}
          buttonLabel="+ From folder"
        />
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

const EXT_FALLBACKS = [".webp", ".png", ".jpg", ".jpeg", ".avif"];

// Seed data stores .jpg paths whose on-disk twin is often .webp (the live site
// remaps via projectMedia). Try the exact URL first, then the same path with
// other common extensions before giving up.
function buildCandidates(resolved: string): string[] {
  const dot = resolved.lastIndexOf(".");
  if (dot <= resolved.lastIndexOf("/")) return [resolved];
  const base = resolved.slice(0, dot);
  const out = [resolved];
  for (const ext of EXT_FALLBACKS) {
    const c = base + ext;
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

function Thumb({ src }: { src: string }) {
  const resolved = src ? projectImage(src) : "";
  // Key by `resolved` so fallback state resets cleanly when the source changes.
  if (!resolved) {
    return (
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[#2a2a2a] bg-[#111] text-[10px] text-white/30">
        none
      </div>
    );
  }
  return <ThumbImg key={resolved} candidates={buildCandidates(resolved)} />;
}

function ThumbImg({ candidates }: { candidates: string[] }) {
  const [idx, setIdx] = useState(0);
  const [dead, setDead] = useState(false);
  const current = candidates[idx];
  return (
    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-[#2a2a2a] bg-[#111]">
      {current && !dead ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current}
          alt=""
          className="h-full w-full object-cover"
          onError={() => {
            if (idx + 1 < candidates.length) setIdx(idx + 1);
            else setDead(true);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
          missing
        </div>
      )}
    </div>
  );
}

function UploadButton({
  slug,
  onUploaded,
}: {
  slug: string;
  onUploaded: (ref: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          const out = await uploadFile(slug, file);
          setBusy(false);
          if (out) onUploaded(out.src);
          if (ref.current) ref.current.value = "";
        }}
      />
      <Btn onClick={() => ref.current?.click()} disabled={busy || !slug}>
        {busy ? "Uploading…" : "Upload"}
      </Btn>
    </>
  );
}

function MultiUploadButton({
  slug,
  onUploaded,
}: {
  slug: string;
  onUploaded: (refs: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          setBusy(true);
          const refs: string[] = [];
          for (const f of files) {
            const out = await uploadFile(slug, f);
            if (out) refs.push(out.src);
          }
          setBusy(false);
          if (refs.length) onUploaded(refs);
          if (ref.current) ref.current.value = "";
        }}
      />
      <Btn variant="gold" onClick={() => ref.current?.click()} disabled={busy || !slug}>
        {busy ? "Uploading…" : "+ Upload images"}
      </Btn>
    </>
  );
}

function AssetPicker({
  slug,
  onPick,
  buttonLabel = "Browse",
}: {
  slug: string;
  onPick: (ref: string) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<AssetFile[] | null>(null);

  useEffect(() => {
    if (!open || files || !slug) return;
    fetch(`/api/studio/assets?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setFiles(d.files ?? []))
      .catch(() => setFiles([]));
  }, [open, files, slug]);

  return (
    <div className="relative">
      <Btn onClick={() => setOpen((o) => !o)} disabled={!slug}>
        {buttonLabel}
      </Btn>
      {open ? (
        <div className="absolute z-30 mt-1 max-h-72 w-72 overflow-auto rounded-sm border border-[#464646] bg-[#0c0c0c] p-2 shadow-xl">
          {files === null ? (
            <p className="p-2 text-xs text-white/40">Loading…</p>
          ) : files.length === 0 ? (
            <p className="p-2 text-xs text-white/40">No files in folder.</p>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {files.map((f) => (
                <button
                  key={f.ref}
                  type="button"
                  title={f.name}
                  onClick={() => {
                    onPick(f.ref);
                    setOpen(false);
                  }}
                  className="group relative aspect-square overflow-hidden rounded-sm border border-[#2a2a2a] hover:border-[#c19b4d]"
                >
                  {f.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={projectImage(f.ref)}
                      alt={f.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] text-white/50">
                      🎞
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

async function uploadFile(
  slug: string,
  file: File,
): Promise<{ src: string } | null> {
  const fd = new FormData();
  fd.append("slug", slug);
  fd.append("file", file);
  try {
    const res = await fetch("/api/studio/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Upload failed: ${err.error ?? res.status}`);
      return null;
    }
    return (await res.json()) as { src: string };
  } catch {
    alert("Upload failed (network).");
    return null;
  }
}

/* ---------------- raw JSON subtree editor ---------------- */

export function JsonField<T>({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  hint?: string;
}) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState<string | null>(null);
  // Re-seed when the underlying value identity changes (e.g. project switch).
  const seedRef = useRef(value);
  useEffect(() => {
    if (seedRef.current !== value) {
      seedRef.current = value;
      setText(JSON.stringify(value, null, 2));
      setErr(null);
    }
  }, [value]);

  return (
    <Field label={label} hint={hint}>
      <textarea
        className={`${inputCls} font-mono text-xs leading-[1.5] ${
          err ? "border-red-500" : ""
        }`}
        rows={12}
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            const parsed = JSON.parse(e.target.value);
            setErr(null);
            seedRef.current = parsed;
            onChange(parsed);
          } catch (ex) {
            setErr((ex as Error).message);
          }
        }}
      />
      {err ? <span className="text-[11px] text-red-400">{err}</span> : null}
    </Field>
  );
}
