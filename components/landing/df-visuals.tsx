/** Static product-UI mock visuals for split sections (the app itself, not explanations). */

export function ItemizedVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          INV-2026-0042 · Acme Studio
        </span>
      </div>
      <div className="space-y-2.5 px-5 py-5">
        {[
          ["Website redesign — homepage", "1 × $2,400.00", "$2,400.00", "HSN 9983"],
          ["Brand asset pack", "20 × $43.00", "$860.00", "HSN 9983"],
          ["Monthly maintenance", "1 × $300.00", "$300.00", "SAC 9984"],
        ].map(([l, q, a, hsn]) => (
          <div
            key={l}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3"
          >
            <span>
              <span className="block font-dm text-sm font-medium text-foreground">{l}</span>
              <span className="block font-mono text-xs text-muted-foreground">
                {q} · {hsn}
              </span>
            </span>
            <span className="shrink-0 font-mono text-sm text-muted-foreground">{a}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 pt-1 font-dm text-sm text-muted-foreground">
          <span>Currency</span>
          <span className="font-mono">INR · USD · EUR</span>
        </div>
      </div>
    </div>
  );
}
