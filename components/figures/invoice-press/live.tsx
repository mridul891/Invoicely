"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, spring, useReadout, type Spring } from "@/components/iso/react/live";
import { onTop } from "@/components/iso/iso-kit";
import { DAYS_TO_PAID, readoutOf, spokenOf, stateAt, type PressState } from "./model";
import { DIAL_X, DIAL_Y, DIAL_Z, DIAL_H, HEAD_TRAVEL, HEIGHT, P, WIDTH, at, shiftZ } from "./view";
import { COIN_HOME, COIN_PAID } from "./geometry";

const LOOP = 9;
const ease = (t: number) => {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
};

function tour(t: number): { sent: number; paid: number } {
  const a = t % LOOP;
  if (a < 1.2) return { sent: 0, paid: 0 };
  if (a < 3.4) return { sent: ease((a - 1.2) / 1.2), paid: 0 };
  if (a < 4.6) return { sent: 1, paid: 0 };
  if (a < 6.4) return { sent: 1, paid: ease((a - 4.6) / 1.2) };
  if (a < 7.8) return { sent: 1, paid: 1 };
  return { sent: 1 - ease((a - 7.8) / 1.2), paid: 1 - ease((a - 7.8) / 1.2) };
}

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

interface Props {
  label: string;
  base: React.ReactNode;
  bed: React.ReactNode;
  card: React.ReactNode;
  gantry: React.ReactNode;
  box: React.ReactNode;
  head: React.ReactNode;
  coin: React.ReactNode;
}

export function PressLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const head = React.useRef<SVGGElement | null>(null);
  const coin = React.useRef<SVGGElement | null>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const state = React.useRef<PressState>(stateAt());
  const target = React.useRef({ sent: 0, paid: 0 });
  const frame = React.useRef(0);
  const last = React.useRef(0);
  const clock = React.useRef(0);
  const touring = React.useRef(true);
  const [visible, setVisible] = React.useState(false);
  const [idle, setIdle] = React.useState(true);
  const [sentUi, setSentUi] = React.useState(false);
  const [paidUi, setPaidUi] = React.useState(false);

  const restNeedle = React.useMemo(() => {
    const a0 = -Math.PI / 2 + 0.001;
    const r = 11;
    return onTop(
      [
        [DIAL_X - Math.sin(a0) * 3, DIAL_Y + Math.cos(a0) * 3],
        [DIAL_X + Math.sin(a0) * r, DIAL_Y - Math.cos(a0) * r],
      ],
      DIAL_Z + DIAL_H + 0.2,
      P,
    );
  }, []);

  const draw = React.useCallback(() => {
    const s = state.current;
    head.current?.setAttribute("transform", shiftZ(-HEAD_TRAVEL * s.sent.at));
    const c = lerp3(COIN_HOME, COIN_PAID, ease(s.paid.at));
    const o = at(c);
    const org = at([0, 0, 0]);
    coin.current?.setAttribute("transform", `translate(${o[0] - org[0]} ${o[1] - org[1]})`);
    const frac = Math.min(DAYS_TO_PAID, 14) / 14;
    const ang = -Math.PI / 2 + frac * Math.PI * 2 * Math.max(s.sent.at, 0.001);
    const r = 11;
    needle.current?.setAttribute(
      "d",
      onTop(
        [
          [DIAL_X - Math.sin(ang) * 3, DIAL_Y + Math.cos(ang) * 3],
          [DIAL_X + Math.sin(ang) * r, DIAL_Y - Math.cos(ang) * r],
        ],
        DIAL_Z + DIAL_H + 0.2,
        P,
      ),
    );
    say(readoutOf(s));
    const node = root.current;
    if (node) {
      const spoken = spokenOf(s);
      if (node.getAttribute("aria-valuetext") !== spoken) node.setAttribute("aria-valuetext", spoken);
      node.setAttribute("aria-valuenow", `${Math.round(s.sent.at * 100)}`);
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
      if (touring.current && idle && !calm) {
        clock.current += dt;
        target.current = tour(clock.current);
      }
      const s = state.current;
      const a = spring(s.sent as Spring, target.current.sent, dt, 120, 14, calm);
      const b = spring(s.paid as Spring, target.current.paid, dt, 90, 13, calm);
      draw();
      const done = a && b && !touring.current;
      frame.current = done ? 0 : requestAnimationFrame(tick);
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
    touring.current = idle;
    if (idle && !asksForStillness()) clock.current = 0;
    run();
    return () => {
      if (!idle) stop();
    };
  }, [visible, idle, run, stop]);

  React.useEffect(() => {
    if (!idle) return;
    const t = window.setTimeout(() => {}, 0);
    return () => window.clearTimeout(t);
  }, [idle]);

  const wake = () => {
    touring.current = false;
    setIdle(false);
  };

  const setSent = (v: boolean) => {
    wake();
    setSentUi(v);
    target.current = { sent: v ? 1 : 0, paid: v ? target.current.paid : 0 };
    if (!v) {
      setPaidUi(false);
      target.current.paid = 0;
    }
    run();
  };

  const setPaid = (v: boolean) => {
    wake();
    if (v && !sentUi) {
      setSentUi(true);
      target.current.sent = 1;
    }
    setPaidUi(v);
    target.current = { sent: v ? 1 : target.current.sent, paid: v ? 1 : 0 };
    run();
  };

  return (
    <div
      ref={(n) => {
        root.current = n;
        anchor.current = n;
      }}
      className="press"
      role="slider"
      tabIndex={0}
      aria-label="Invoice press: Space stamps the invoice sent, P drops the payment coin, arrows scrub. Press R to reset."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext="Draft invoice"
      onPointerDown={(e) => {
        wake();
        (e.currentTarget as HTMLElement).focus?.();
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setSent(!sentUi);
        } else if (e.key === "p" || e.key === "P") {
          e.preventDefault();
          setPaid(!paidUi);
        } else if (e.key === "r" || e.key === "R" || e.key === "Escape") {
          e.preventDefault();
          wake();
          setSentUi(false);
          setPaidUi(false);
          target.current = { sent: 0, paid: 0 };
          run();
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!sentUi) setSent(true);
          else setPaid(true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          if (paidUi) setPaid(false);
          else setSent(false);
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        {props.bed}
        {props.card}
        {props.gantry}
        <g ref={head}>{props.head}</g>
        {props.box}
        <g ref={coin}>{props.coin}</g>
        <path ref={needle} className="iso-line press-needle" data-tone="lit" d={restNeedle} />
      </IsoFigure>
      <div className="press-actions">
        <button type="button" onClick={() => setSent(!sentUi)} aria-pressed={sentUi}>
          {sentUi ? "Unsend" : "Stamp sent"}
        </button>
        <button type="button" onClick={() => setPaid(!paidUi)} aria-pressed={paidUi}>
          {paidUi ? "Refund" : "Drop coin · pay"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIdle(true);
            touring.current = true;
            clock.current = 0;
            run();
          }}
        >
          Replay tour
        </button>
      </div>
    </div>
  );
}
