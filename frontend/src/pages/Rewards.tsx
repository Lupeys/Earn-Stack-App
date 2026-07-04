import { Link } from "react-router-dom";

type RewardProgram = {
  name: string;
  type: string;
  taskCompatible: boolean;
  note: string;
  url: string;
};

const programs: RewardProgram[] = [
  {
    name: "PC Optimum",
    type: "Grocery / Pharmacy",
    taskCompatible: true,
    note: "Some EarnStack tasks involve PC-affiliated brands. Check task details for eligibility.",
    url: "https://www.pcoptimum.ca",
  },
  {
    name: "Scene+",
    type: "Entertainment / Banking",
    taskCompatible: true,
    note: "Scene+ partner tasks may allow stacking. Confirm in the task detail before submitting.",
    url: "https://www.sceneplus.ca",
  },
  {
    name: "AIR MILES",
    type: "Retail / Travel",
    taskCompatible: false,
    note: "AIR MILES tasks are not currently eligible for stacking on EarnStack.",
    url: "https://www.airmiles.ca",
  },
  {
    name: "Rakuten Canada",
    type: "Cashback / Shopping",
    taskCompatible: true,
    note: "Rakuten cashback may apply on top of EarnStack payouts for eligible shopping tasks.",
    url: "https://www.rakuten.ca",
  },
  {
    name: "Neo Financial",
    type: "Credit / Cashback",
    taskCompatible: false,
    note: "No current EarnStack tasks are co-eligible with Neo Financial rewards.",
    url: "https://www.neofinancial.com",
  },
];

export default function Rewards() {
  const compatible = programs.filter((p) => p.taskCompatible);
  const notCompatible = programs.filter((p) => !p.taskCompatible);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-24">
      {/* Page header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <h1 className="font-semibold tracking-tight text-base">Rewards Stacking</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        {/* Explainer */}
        <section>
          <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
            Some EarnStack tasks can be completed alongside an existing Canadian rewards
            program — letting you earn your EarnStack cash payout <em>and</em> collect points
            or cashback from a separate program at the same time. Stacking eligibility is
            set by each sponsor and listed on the task detail page.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-[var(--warning-bg)] border border-[var(--border)] text-xs text-[var(--warning)] leading-relaxed">
            <strong>Important:</strong> EarnStack cash payouts and external rewards program benefits
            are separate. Rewards points are not guaranteed and depend on your membership status
            with the third-party program. Earnings may be taxable under CRA guidelines.
          </div>
        </section>

        {/* Compatible programs */}
        <section>
          <h2 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
            Stacking-friendly programs
          </h2>
          <div className="space-y-3">
            {compatible.map((p) => (
              <ProgramCard key={p.name} program={p} />
            ))}
          </div>
        </section>

        {/* Not compatible */}
        <section>
          <h2 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
            Not currently eligible
          </h2>
          <div className="space-y-3">
            {notCompatible.map((p) => (
              <ProgramCard key={p.name} program={p} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pt-2">
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold mb-1.5">Ready to earn?</h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">
              Browse available tasks and check each task detail page for stacking eligibility.
            </p>
            <Link
              to="/tasks"
              className="inline-block px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Browse Tasks
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgramCard({ program }: { program: RewardProgram }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-sm">{program.name}</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--foreground-muted)] uppercase tracking-wide">
            {program.type}
          </span>
          {program.taskCompatible ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] uppercase tracking-wide">
              Stackable
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-raised)] text-[var(--foreground-faint)] uppercase tracking-wide">
              Not eligible
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{program.note}</p>
      </div>
      <a
        href={program.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs text-[var(--primary)] hover:underline mt-0.5"
        aria-label={`Visit ${program.name}`}
      >
        Visit ↗
      </a>
    </div>
  );
}
