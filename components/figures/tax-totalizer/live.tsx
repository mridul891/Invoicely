"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, spring, useReadout, type Spring } from "@/components/iso/react/live";
import { barPaths, needleAt } from "./geometry";
import { BAR_FULL, RATES, readoutOf, spokenOf, subBarH, taxBarH } from "./model";
import { HEIGHT, SUB_X, TAX_X, WIDTH } from "./view";

const LOOP = 9.6;

function tourAt(t: number): number {
  // Rest at 10% (index 2), visit 18 → 5 → 0 → back, eased.
  const seq = [2, 3, 1, 0, 2];
  const a = t % LOOP;
  const leg = LOOP / (seq.length - 1);
  const i = Math.min(seq.length - 2, Math.floor(a / leg));
  const f = (a - i * leg) / leg;
  const e = f * f * (3 - 2 * f);
  return seq[i]! + (seq[i + 1]! - seq[i]!) * e;
}

interface Props {
  label: string;
  base: React.ReactNode;
  bars: React.ReactNode;
  dial: React.ReactNode;
}

interface BarNodes {
  fill: SVGPathElement | null;
  shades: (SVGPathElement | null)[];
  top: SVGPathElement | null;
  edge: SVGPathElement | null;
}

const emptyBar = (): BarNodes => ({ fill: null, shades: [null, null, null, null], top: null, edge: null });

export function TotalizerLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const sub = React.useRef<BarNodes>(emptyBar());
  const tax = React.useRef<BarNodes>(emptyBar());
  const pos = React.useRef<Spring>({ at: 2, rate: 0 });
  const target = React.useRef(2);
  const frame = React.useRef(0);
  const last = React.useRef(0);
  const clock = React.useRef(0);
  const [visible, setVisible] = React.useState(false);
  const [idle, setIdle] = React.useState(true);
  const [chosen, setChosen] = React.useState(2);

  const paintBar = React.useCallback((nodes: BarNodes, x: number, h: number) => {
    const p = barPaths(x, h);
    nodes.fill?.setAttribute("d", p.fill);
    p.shades.forEach((d, i) => nodes.shades[i]?.setAttribute("d", d ?? ""));
    nodes.top?.setAttribute("d", p.top);
    nodes.edge?.setAttribute("d", p.outline);
  }, []);

  const draw = React.useCallback(() => {
    const idx = Math.max(0, Math.min(3, pos.current.at));
    const lo = Math.floor(idx);
    const hi = Math.min(3, lo + 1);
    const f = idx - lo;
    const rate = RATES[lo]! + (RATES[hi]! - RATES[lo]!) * f;
    paintBar(sub.current, SUB_X, subBarH(rate));
    paintBar(tax.current, TAX_X, taxBarH(rate));
    const ang = -Math.PI / 2 + (idx / 4) * Math.PI * 2;
    needle.current?.setAttribute("d", needleAt(ang));
    say(readoutOf(Math.round(rate)));
    const node = root.current;
    if (node) {
      const spoken = spokenOf(Math.round(rate));
      if (node.getAttribute("aria-valuetext") !== spoken) node.setAttribute("aria-valuetext", spoken);
      node.setAttribute("aria-valuenow", `${Math.round(rate)}`);
    }
  }, [paintBar, say]);

  const stop = React.useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  const run = React.useCallback(() => {
    if (frame.current) return;
    last.current = 0;
    const tick = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 1 / 30) : 1 / 60;
      last.current = now;
      const calm = asksForStillness();
      if (idle && !calm) {
        clock.current += dt;
        target.current = Math.round(tourAt(clock.current));
      }
      const done = spring(pos.current, target.current, dt, 90, 13, calm);
      draw();
      frame.current = done && !idle ? 0 : requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [draw, idle]);

  React.useEffect(() => {
    const node = root.current;
    if (!node) return;
    const ob = new IntersectionObserver((es) => setVisible(Boolean(es.at(-1)?.isIntersecting)), {
      rootMargin: "120px 0px",
    });
    ob.observe(node);
    return () => {
      ob.disconnect();
      stop();
    };
  }, [stop]);

  React.useEffect(() => {
    if (!visible) {
      stop();
      return;
    }
    if (idle && !asksForStillness()) clock.current = 0;
    run();
  }, [visible, idle, run, stop]);

  const wake = () => setIdle(false);
  const go = (i: number) => {
    wake();
    const next = Math.max(0, Math.min(3, i));
    setChosen(next);
    target.current = next;
    run();
  };

  const bindBar = (ref: React.MutableRefObject<BarNodes>) => ({
    fill: (n: SVGPathElement | null) => {
      ref.current.fill = n;
    },
    shade: (i: number) => (n: SVGPathElement | null) => {
      ref.current.shades[i] = n;
    },
    top: (n: SVGPathElement | null) => {
      ref.current.top = n;
    },
    edge: (n: SVGPathElement | null) => {
      ref.current.edge = n;
    },
  });
  const subBind = bindBar(sub);
  const taxBind = bindBar(tax);

  const restSub = barPaths(SUB_X, (BAR_FULL * 100) / 110);
  const restTax = barPaths(TAX_X, (BAR_FULL * 10) / 110);
  const restNeedle = needleAt((-Math.PI / 2 + (2 / 4) * Math.PI * 2));

  const barGroup = (key: string, rest: ReturnType<typeof barPaths>, b: ReturnType<typeof bindBar>, lit: boolean) => (
    <g key={key} className="iso-solid" data-lit={lit ? "" : undefined}>
      <path ref={b.fill} className="iso-fill" d={rest.fill} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} ref={b.shade(i)} className="iso-shade" data-shade={i} d={rest.shades[i] ?? ""} />
      ))}
      <path ref={b.top} className="iso-top" d={rest.top} />
      <path ref={b.edge} className="iso-line iso-edge" data-tone={lit ? "lit" : "hi"} d={rest.outline} />
    </g>
  );

  return (
    <div
      ref={(n) => {
        root.current = n;
        anchor.current = n;
      }}
      className="totalizer"
      role="slider"
      tabIndex={0}
      aria-label="Tax totalizer: arrow keys change the tax rate between 0, 5, 10 and 18 percent"
      aria-valuemin={0}
      aria-valuemax={18}
      aria-valuenow={10}
      aria-valuetext="Tax rate 10 percent"
      onPointerDown={() => wake()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          go(chosen + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          go(chosen - 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          go(0);
        } else if (e.key === "End") {
          e.preventDefault();
          go(3);
        } else if (e.key === "Escape") {
          setIdle(true);
          clock.current = 0;
          run();
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        {props.bars}
        {barGroup("sub", restSub, subBind, true)}
        {barGroup("tax", restTax, taxBind, false)}
        {props.dial}
        <path ref={needle} className="iso-line totalizer-needle" data-tone="lit" d={restNeedle} />
      </IsoFigure>
      <div className="totalizer-actions">
        {RATES.map((r, i) => (
          <button key={r} type="button" onClick={() => go(i)} aria-pressed={chosen === i && !idle}>
            {r}%
          </button>
        ))}
      </div>
    </div>
  );
}
