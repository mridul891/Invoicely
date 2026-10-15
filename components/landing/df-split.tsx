import { HugeiconsIcon } from "@hugeicons/react";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

export function DfSplit({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const contentOrder = reverse ? "order-1 md:order-2" : "order-1";
  const imageOrder = reverse ? "order-2 md:order-1" : "order-2";

  return (
    <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={`${WRAP_CLASS} grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-[72px]`}>
        <Reveal className={contentOrder}>
          <p className="mb-4 font-dm text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
            {eyebrow}
          </p>
          <h2 className="mb-4 font-dm text-[clamp(26px,3.5vw,36px)] leading-[1.15] font-semibold tracking-[-0.035em] text-foreground">
            {title}
          </h2>
          <p className="mb-6 font-dm text-[14px] leading-[1.7] text-muted-foreground sm:mb-8 sm:text-[15px]">
            {body}
          </p>
          <div className="flex flex-col gap-[11px]">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={13}
                  color="var(--muted-foreground)"
                  className="mt-[3px] shrink-0"
                />
                <span className="font-dm text-[14px] leading-[1.55] text-muted-foreground">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100} className={imageOrder}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}
