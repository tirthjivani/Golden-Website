import {
  ContactBlock,
  H2,
  LegalPage,
  P,
} from "@/components/LegalPage";

export const metadata = {
  title: "Disclaimer | Golden Group",
  description:
    "Disclaimer for the Golden Group website. Project visuals, plans and specifications are representational and subject to variation during execution.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="May 2026">
      <P>
        The information about the project(s) on this website is only
        representational and informative. The details, visuals, plans, and
        specifications are subject to variation during execution.
      </P>
      <P>
        The Promoter, Golden Lifespace Developers LLP (operating under the
        Golden Group brand), reserves the right to make additions, deletions,
        alterations, or amendments as and when deemed fit and proper, without
        any prior notice.
      </P>
      <P>
        The furniture, fixtures, fittings, landscaping, and accessories shown
        in visuals, renders, and floor plans are only for the purpose of
        illustrating a possible layout and do not form a part of the offering
        or specification.
      </P>
      <P>
        All project information, including specifications, amenities, visuals,
        pricing, offers, availability, and timelines, is subject to applicable
        approvals, RERA regulations (including GujRERA and K-RERA, as
        applicable to the respective project location), company policies, and
        other regulatory requirements.
      </P>
      <P>
        Users are advised to verify all project details and legal documentation
        through official representatives of Golden Lifespace Developers LLP
        before making any purchase or investment decision.
      </P>

      <H2>Contact</H2>
      <P>For any clarification, please contact:</P>
      <ContactBlock />
    </LegalPage>
  );
}
