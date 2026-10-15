const TICKER = [
  "INV-2026-0042 · PAID $3,916.00",
  "INV-2026-0043 · SENT $1,180.00",
  "INV-2026-0044 · PAID $860.00",
  "INV-2026-0045 · DRAFT $2,400.00",
  "INV-2026-0046 · PAID $540.50",
  "INV-2026-0047 · OVERDUE $975.00",
];

export function FooterTicker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="group overflow-hidden border-y bg-muted/40 py-3" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-xs whitespace-nowrap text-muted-foreground">
            {t}
            <span className="h-1 w-1 rounded-full bg-primary/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
