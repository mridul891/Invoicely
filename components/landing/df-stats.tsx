import { HugeiconsIcon } from "@hugeicons/react";
import TradeUpIcon from "@hugeicons/core-free-icons/TradeUpIcon";
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

const STATS = [
  {
    n: "94%",
    label: "Paid on time — status tracking keeps every invoice visible",
    icon: TradeUpIcon,
  },
  {
    n: "6 days",
    label: "Average time to pay, with due dates that warn you early",
    icon: UserGroupIcon,
  },
  {
    n: "3 steps",
    label: "From setup to paid — business, clients, send",
    icon: Clock01Icon,
  },
];

export function DfStats() {
  return (
    <section className="border-t border-border bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 flex flex-col items-start gap-8 md:mb-[72px] md:flex-row md:gap-16">
          <Reveal className="max-w-[340px]">
            <p className="mb-3 font-dm text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
              Why it matters
            </p>
            <h2 className="m-0 font-dm text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.035em] text-foreground">
              Invoicing without the chase
            </h2>
          </Reveal>

          <div className="grid w-full flex-1 grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 sm:gap-y-7 lg:grid-cols-3">
            {STATS.map((stat, i) => (
              <Reveal key={stat.n} delay={i * 80} className="border-t border-border pt-5">
                <p className="mb-2 font-display text-[clamp(36px,4.5vw,48px)] font-semibold tracking-[-0.045em] text-foreground">
                  {stat.n}
                </p>
                <p className="m-0 flex items-start gap-2 font-dm text-[13px] leading-[1.55] text-muted-foreground">
                  <HugeiconsIcon icon={stat.icon} size={14} color="var(--muted-foreground)" className="mt-0.5 shrink-0" />
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
