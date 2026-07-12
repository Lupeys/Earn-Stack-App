import { Link } from "react-router-dom";

const LAST_UPDATED = "July 12, 2026";
const CONTACT_EMAIL = "support@earnstack.ca";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="14" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.35"/>
              <rect x="3" y="10" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.65"/>
              <rect x="3" y="6" width="18" height="3" rx="1.5" fill="var(--primary)"/>
              <circle cx="19" cy="19" r="3" fill="var(--success)"/>
              <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Earn<span className="text-[var(--primary)] font-bold">Stack</span>
          </Link>
          <Link to="/" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10">

          <Section title="1. Acceptance">
            <p>
              By creating an account and using EarnStack, you agree to these Terms of Service and our{" "}
              <Link to="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link>.
              If you do not agree, do not use the platform.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be a Canadian resident and at least 18 years of age.</li>
              <li>You may hold only one EarnStack account. Duplicate accounts will be terminated.</li>
              <li>You must provide accurate information during registration.</li>
              <li>EarnStack is not available to residents outside of Canada at this time.</li>
            </ul>
          </Section>

          <Section title="3. Credits">
            <p>
              EarnStack uses a virtual in-app currency called <strong className="text-[var(--foreground)]">credits</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Credits are earned by completing partner offers through EarnStack's offerwall.</li>
              <li>Credits have no monetary value outside of EarnStack and cannot be transferred, gifted, or sold.</li>
              <li>Credits can be redeemed for Canadian dollars (CAD) through the approved payout process, subject to the minimum balance and review requirements described below.</li>
              <li>EarnStack reserves the right to adjust credit conversion rates. Changes will be communicated with reasonable notice.</li>
              <li>Credits expire if your account is inactive for 12 consecutive months or if your account is terminated for any reason.</li>
            </ul>
          </Section>

          <Section title="4. Partner Offers and Offerwall">
            <p>
              Partner offers are provided by third-party offerwall providers (currently CPAGrip). EarnStack does
              not control the availability, content, or terms of individual offers. Offer availability may change
              at any time without notice.
            </p>
            <p className="mt-3">
              Credit amounts shown for each offer are estimates and are subject to confirmation by the offerwall
              provider via postback. EarnStack is not responsible for credits that fail to post due to offerwall
              provider errors, technical issues, or offer terms not being met.
            </p>
            <p className="mt-3">
              If you believe credits were not posted correctly, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--primary)] hover:underline">{CONTACT_EMAIL}</a>{" "}
              within 14 days of the offer completion.
            </p>
          </Section>

          <Section title="5. Payouts">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Payouts require a minimum balance of $5.00 CAD in available credits.</li>
              <li>All payout requests are subject to manual review before release.</li>
              <li>You must provide a valid PayPal email address to receive payment.</li>
              <li>EarnStack reserves the right to delay or deny payouts pending fraud review.</li>
              <li>Approved payouts are typically processed within 1–2 business days.</li>
              <li>EarnStack is not responsible for delays or errors caused by PayPal.</li>
            </ul>
          </Section>

          <Section title="6. Taxes and Regulatory Compliance">
            <p>
              You are solely responsible for determining whether your earnings through EarnStack are taxable
              under applicable Canadian law (including CRA guidelines) and for reporting and remitting any taxes
              owed. EarnStack does not provide tax advice and is not responsible for any tax obligations arising
              from your use of the platform.
            </p>
          </Section>

          <Section title="7. Prohibited Conduct">
            <p>The following actions will result in immediate account termination and forfeiture of credits:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Creating multiple accounts or sharing accounts with others</li>
              <li>Using bots, scripts, VPNs, proxies, or automated tools to complete offers</li>
              <li>Attempting to manipulate, reverse-engineer, or exploit the credit or payout system</li>
              <li>Submitting false or fraudulent information</li>
              <li>Any activity that violates the terms of our offerwall partners</li>
            </ul>
          </Section>

          <Section title="8. Account Termination">
            <p>
              EarnStack reserves the right to suspend or terminate any account at any time for violations of
              these Terms or for any activity deemed harmful to the platform or its users. Upon termination,
              any pending or available credits are forfeited and are not eligible for payout.
            </p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>
              EarnStack is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
              access, specific credit earnings, or payout amounts. Offer availability and credit values may
              change at any time.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, EarnStack shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the platform, including loss of
              credits, missed offers, or payout delays.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may update these Terms of Service at any time. Material changes will be communicated via email
              to registered users. Continued use of EarnStack after changes constitutes your acceptance of the
              updated terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>Questions about these Terms? Contact us at:</p>
            <address className="not-italic mt-3 space-y-1">
              <p>EarnStack</p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--primary)] hover:underline">{CONTACT_EMAIL}</a></p>
              <p>Website: <a href="https://earnstack.ca" className="text-[var(--primary)] hover:underline" target="_blank" rel="noopener noreferrer">earnstack.ca</a></p>
            </address>
          </Section>

        </div>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--foreground-faint)]">
          <span>EarnStack &copy; {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-[var(--primary)] font-medium">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[var(--foreground-muted)] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-3 text-[var(--foreground)]">{title}</h2>
      <div className="text-sm text-[var(--foreground-muted)] leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
