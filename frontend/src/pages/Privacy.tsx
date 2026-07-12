import { Link } from "react-router-dom";

const LAST_UPDATED = "July 12, 2026";
const CONTACT_EMAIL = "support@earnstack.ca";

export default function Privacy() {
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
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10">

          <Section title="1. Who We Are">
            <p>
              EarnStack is operated by EarnStack ("we", "us", "our"), based in Canada. We operate the web
              application at{" "}
              <a href="https://app.earnstack.ca" className="text-[var(--primary)] hover:underline" target="_blank" rel="noopener noreferrer">
                app.earnstack.ca
              </a>.
              This Privacy Policy explains what personal information we collect, how we use it, and your rights
              under Canadian privacy law (PIPEDA) and applicable international regulations.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of information when you use EarnStack:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li><strong className="text-[var(--foreground)]">Account information</strong> — display name, email address, and hashed password when you register.</li>
              <li><strong className="text-[var(--foreground)]">Verification data</strong> — email OTP used to confirm your account.</li>
              <li><strong className="text-[var(--foreground)]">Device and session data</strong> — IP address, browser user-agent, and device fingerprint collected for fraud prevention.</li>
              <li><strong className="text-[var(--foreground)]">Activity data</strong> — offer completions, credit balance, payout requests, and ledger history.</li>
              <li><strong className="text-[var(--foreground)]">PayPal email</strong> — collected only when you initiate a payout request and used solely for that purpose.</li>
            </ul>
          </Section>

          <Section title="3. Credits and In-App Currency">
            <p>
              EarnStack uses a virtual credit system as its in-app currency. Credits are earned by completing
              partner offers available through our offerwall partners. Credits have no monetary value outside of
              EarnStack and cannot be transferred, sold, or exchanged except through EarnStack's approved payout
              process.
            </p>
            <p className="mt-3">
              Credits are converted to Canadian dollars (CAD) at a fixed rate displayed in the app at the time
              of redemption. Payout requests are subject to manual review before release. EarnStack reserves the
              right to adjust conversion rates with reasonable notice to users.
            </p>
          </Section>

          <Section title="4. Third-Party Offerwall Partners">
            <p>
              EarnStack uses third-party offerwall providers to deliver partner offers. These providers operate
              independently and have their own privacy policies. When you interact with offers, these providers
              may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Your EarnStack user ID (as a <code className="bg-[var(--surface)] px-1 rounded text-xs font-mono">subId</code>) to attribute completed offers to your account</li>
              <li>IP address, device identifiers, and browsing behaviour within the offerwall</li>
              <li>Offer completion signals sent back to EarnStack via secure postback</li>
            </ul>
            <p className="mt-3">
              Our current offerwall partner is <strong className="text-[var(--foreground)]">CPAGrip</strong>.
              You can review their privacy policy at{" "}
              <a href="https://www.cpagrip.com/privacy.php" className="text-[var(--primary)] hover:underline" target="_blank" rel="noopener noreferrer">
                cpagrip.com/privacy.php
              </a>.
            </p>
            <p className="mt-3">
              We do not sell your personal information to these partners. We share only the minimum data
              required to attribute completed offers to your EarnStack account.
            </p>
          </Section>

          <Section title="5. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To create and maintain your account</li>
              <li>To verify your identity and confirm Canadian residency</li>
              <li>To attribute completed offers to your credit balance</li>
              <li>To process payout requests via PayPal</li>
              <li>To detect and prevent fraud, abuse, and duplicate accounts</li>
              <li>To send account-related communications (e.g. OTP codes, payout status updates)</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">We do not use your data for targeted advertising or sell it to third parties.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account data for as long as your account is active. If you request account
              deletion, we will remove your personal information within 30 days, except where we are required
              to retain it by law (e.g. payout records for tax compliance purposes).
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>
              Under PIPEDA (Canada), you have the right to access, correct, and request deletion of your
              personal information. If you are located in the EU/EEA, you may also have rights under GDPR
              including data portability and the right to object to processing.
            </p>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--primary)] hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We use industry-standard security practices including password hashing, HTTPS encryption,
              JWT-based authentication, and rate limiting. No method of transmission over the internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Children">
            <p>
              EarnStack is not intended for users under 18. We do not knowingly collect personal information
              from anyone under 18. If you believe a minor has registered, contact us immediately at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--primary)] hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users by email
              for material changes. Continued use of EarnStack after changes constitutes acceptance of the
              updated policy.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>Questions about this Privacy Policy? Reach us at:</p>
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
            <Link to="/terms" className="hover:text-[var(--foreground-muted)] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-[var(--primary)] font-medium">Privacy Policy</Link>
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
