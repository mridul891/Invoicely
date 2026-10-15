"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, spring, useReadout, type Spring } from "@/components/iso/react/live";
import { ENVELOPE_LIFT, pointerAt } from "./geometry";
import { readoutOf, spokenOf } from "./model";
import { HEIGHT, WIDTH, holeX, shift } from "./view";
import { HOLE_W } from "./view";

const LOOP = 10;
const ease = (t: number) => {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
};

function tourAt(t: number): number {
  // 0 → 1 → 2 → 3 → hold → back to 0, each leg eased over ~1.6s
  const legs = [0, 1.6, 3.2, 4.8, 6.4, 8.2];
  const a = t % LOOP;
  if (a < legs[1]!) return ease(a / 1.6) * 1;
  if (a < legs[2]!) return 1 + ease((a - legs[1]!) / 1.6);
  if (a < legs[3]!) return 2 + ease((a - legs[2]!) / 1.6);
  if (a < legs[4]!) return 3;
  return 3 - ease((a - legs[4]!) / (LOOP - legs[4]!)) * 3;
}

interface Props {
  label: string;
  base: React.ReactNode;
  kase: React.ReactNode;
  rail: React.ReactNode;
  knob: React.ReactNode;
  envelopes: React.ReactNode[];
  carriage: React.ReactNode;
}

export function SorterLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const car = React.useRef<SVGGElement | null>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const envs = React.useRef<(SVGGElement | null)[]>([]);
  const pos = React.useRef<Spring>({ at: 0, rate: 0 });
  const target = React.useRef(0);
  const frame = React.useRef(0);
  const last = React.useRef(0);
  const clock = React.useRef(0);
  const [visible, setVisible] = React.useState(false);
  const [idle, setIdle] = React.useState(true);
  const [chosen, setChosen] = React.useState(0);

  const draw = React.useCallback(() => {
    const p = pos.current.at;
    const cx = holeX(0) + 4 + (HOLE_W - 8) / 2 - 13;
    const x = cx + p * (HOLE_W + 4);
    car.current?.setAttribute("transform", shift(x, 0, 0));
    envs.current.forEach((node, i) => {
      if (!node) return;
      const near = Math.max(0, 1 - Math.abs(p - i));
      node.setAttribute("transform", shift(0, 0, near * ENVELOPE_LIFT));
      if (near > 0.5) node.dataset.lit = "";
      else delete node.dataset.lit;
    });
    const ang = -Math.PI / 2 + (Math.max(0, Math.min(3, p)) / 4) * Math.PI * 2;
    needle.current?.setAttribute("d", pointerAt(ang));
    say(readoutOf(p));
    const node = root.current;
    if (node) {
      const spoken = spokenOf(p);
      if (node.getAttribute("aria-valuetext") !== spoken) node.setAttribute("aria-valuetext", spoken);
      node.setAttribute("aria-valuenow", `${Math.round(p)}`);
    }
  }, [say]);

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

  return (
    <div
      ref={(n) => {
        root.current = n;
        anchor.current = n;
      }}
      className="sorter"
      role="slider"
      tabIndex={0}
      aria-label="Status sorter: arrow keys file the invoice, Space advances status"
      aria-valuemin={0}
      aria-valuemax={3}
      aria-valuenow={0}
      aria-valuetext="Draft"
      onPointerDown={() => wake()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          go(chosen + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          go(chosen - 1);
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          go(chosen >= 3 ? 0 : chosen + 1);
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
        {props.kase}
        {props.envelopes.map((env, i) => (
          <g
            key={i}
            ref={(n) => {
              envs.current[i] = n;
            }}
          >
            {env}
          </g>
        ))}
        {props.rail}
        <g ref={car}>{props.carriage}</g>
        {props.knob}
        <path ref={needle} className="iso-line sorter-needle" data-tone="lit" d="" />
      </IsoFigure>
      <div className="sorter-actions">
        {(["Draft", "Sent", "Paid", "Overdue"] as const).map((s, i) => (
          <button key={s} type="button" onClick={() => go(i)} aria-pressed={chosen === i && !idle}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
