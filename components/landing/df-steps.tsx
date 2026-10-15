import { HugeiconsIcon } from "@hugeicons/react";
import Building02Icon from "@hugeicons/core-free-icons/Building02Icon";
import UsersIcon from "@hugeicons/core-free-icons/UsersIcon";
import BitcoinSendIcon from "@hugeicons/core-free-icons/BitcoinSendIcon";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

const CARDS = [
  {
    icon: Building02Icon,
    eyebrow: "Step 01",
    title: "Add your business once",
    desc: "Name, address, GSTIN and payment details live on every invoice you send.",
  },
  {
    icon: UsersIcon,
    eyebrow: "Step 02",
    title: "Save clients, reuse forever",
    desc: "The people and companies you bill — email, phone, tax ID — one tap away.",
  },
  {
    icon: BitcoinSendIcon,
    eyebrow: "Step 03",
    title: "Send it, track it, get paid",
    desc: "Create the invoice, review the totals, and watch its status to paid.",
  },
];

export function DfSteps() {
  return (
    <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <Reveal className="mb-10 sm:mb-12">
          <p className="mb-[14px] font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            How it works
          </p>
          <h2 className="mb-[14px] font-dm text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-foreground">
            Setup once, bill forever
          </h2>
          <p className="m-0 max-w-[480px] font-dm text-base leading-[1.65] text-muted-foreground">
            Three steps stand between you and your first paid invoice.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col bg-card px-5 pt-6 pb-5 sm:px-7 sm:pt-8 sm:pb-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-border bg-muted">
                    <HugeiconsIcon icon={card.icon} size={15} color="var(--muted-foreground)" />
                  </div>
                  <span className="font-dm text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
                    {card.eyebrow}
                  </span>
                </div>
                <h3 className="mb-2.5 font-dm text-[16px] font-semibold tracking-tight text-foreground sm:text-[17px]">
                  {card.title}
                </h3>
                <p className="m-0 font-dm text-[13px] leading-[1.65] text-muted-foreground sm:text-[14px]">
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
