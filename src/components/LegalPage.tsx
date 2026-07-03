import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ALT_SITE_URL,
  COMPANY_LEGAL_NAME,
  CONTACT_EMAIL,
  OFFICE_ADDRESS,
  PHONE_DISPLAY,
  SITE_URL,
} from "@/lib/site";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <article className="mx-auto max-w-3xl px-[30px] pb-24 pt-[120px] md:pt-[160px]">
        <header className="border-b border-[#464646] pb-8">
          <h1 className="text-[36px] font-normal leading-[1.1] tracking-tight md:text-[56px]">
            {title}
          </h1>
          <p className="mt-4 text-sm text-white/60">
            Golden Lifespace Developers LLP &middot; Last Updated: {updated}
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-6 text-[15px] leading-[1.7] text-white/80 md:text-base">
          {children}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-6 text-[22px] font-normal leading-[1.3] tracking-tight text-white md:text-[26px]">
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="ml-5 flex list-disc flex-col gap-2">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function ContactBlock() {
  return (
    <div className="mt-4 border-t border-[#464646] pt-8">
      <p className="font-medium text-white">{COMPANY_LEGAL_NAME}</p>
      <ul className="mt-3 flex flex-col gap-1 text-white/80">
        <li>
          Official Website: {SITE_URL.replace("https://", "")} /{" "}
          {ALT_SITE_URL.replace("https://", "")}
        </li>
        <li>Phone: {PHONE_DISPLAY}</li>
        <li>Email: {CONTACT_EMAIL}</li>
        <li>Registered Office: {OFFICE_ADDRESS}</li>
      </ul>
    </div>
  );
}
