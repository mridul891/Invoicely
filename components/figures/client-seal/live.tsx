"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, spring, useReadout, type Spring } from "@/components/iso/react/live";
import { pointerAt } from "./geometry";
import { CLIENTS, readoutOf, spokenOf } from "./model";
import { CARD_HOME_Y, CARD_OUT_Y, HEAD_TRAVEL, HEIGHT, WIDTH, shift } from "./view";

const LOOP = 12;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
};

function tourAt(t: number): number {
  const a = t % LOOP;
  if (a < 2.4) return 0;
  if (a < 4.4) return ease((a - 2.4) / 2);
  if (a < 6.4) return 1;
  if (a < 8.4) return 1 + ease((a - 6.4) / 2);
  if (a < 10.4) return 2;
  return 2 - ease((a - 10.4) / (LOOP - 10.4)) * 2;
}

const detentAngle = (sel: number) => -Math.PI / 2 + ((Math.max(0, Math.min(2, sel)) - 1) / 3) * Math.PI * 1.2;

interface Props {
  label: string;
  base: React.ReactNode;
  rack: React.ReactNode;
  bed: React.ReactNode;
  sealStatic: React.ReactNode;
  knob: React.ReactNode;
  cards: React.ReactNode[];
  sealHead: React.ReactNode;
  imprint: React.ReactNode;
}

export function SealLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<(SVGGElement | null)[]>([]);
  const seal = React.useRef<SVGGElement | null>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const imprint = React.useRef<SVGGElement | null>(null);
  const sel = React.useRef<Spring>({ at: 0, rate: 0 });
  const stamp = React.useRef({ age: 99 });
  const imprinted = React.useRef<Spring>({ at: 0, rate: 0 });
  const latched = React.useRef(false);
  const target = React.useRef(0);
  const frame = React.useRef(0);
  const last = React.useRef(0);
  const clock = React.useRef(0);
  const [visible, setVisible] = React.useState(false);
  const [idle, setIdle] = React.useState(true);
  const [chosen, setChosen] = React.useState(0);

  const draw = React.useCallback(() => {
    const s = sel.current.at;
    cardRefs.current.forEach((node, i) => {
      if (!node) return;
      const near = Math.max(0, 1 - Math.abs(s - i));
      node.setAttribute("transform", shift(0, CARD_HOME_Y + (CARD_OUT_Y - CARD_HOME_Y) * near, 0));
      if (near > 0.5) node.dataset.lit = "";
      else delete node.dataset.lit;
    });
    // One-shot press envelope: down-up with zero slope at both ends.
    const age = stamp.current.age;
    const press = age < 0.55 ? Math.sin((Math.PI * age) / 0.55) : 0;
    seal.current?.setAttribute("transform", shift(0, 0, -HEAD_TRAVEL * press));
    if (press > 0.85) latched.current = true;
    spring(imprinted.current, latched.current ? 1 : 0, 1 / 60, 200, 22, false);
    imprint.current?.setAttribute("opacity", `${Math.max(press * 0.9, imprinted.current.at).toFixed(3)}`);
    needle.current?.setAttribute("d", pointerAt(detentAngle(s)));
    const pressing = press > 0.3;
    say(readoutOf(s, pressing));
    const node = root.current;
    if (node) {
      const spoken = spokenOf(s);
      if (node.getAttribute("aria-valuetext") !== spoken) node.setAttribute("aria-valuetext", spoken);
      node.setAttribute("aria-valuenow", `${Math.round(s)}`);
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
        const next = Math.round(tourAt(clock.current));
        if (next !== target.current) {
          target.current = next;
          setChosen(next);
          latched.current = false;
          stamp.current.age = 0;
        }
      }
      stamp.current.age += dt;
      const done = spring(sel.current, target.current, dt, 90, 13, calm);
      draw();
      const settled = done && !idle && stamp.current.age > 0.6;
      frame.current = settled ? 0 : requestAnimationFrame(tick);
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
    const next = Math.max(0, Math.min(2, i));
    setChosen(next);
    target.current = next;
    latched.current = false;
    stamp.current.age = 0;
    run();
  };
  const restamp = () => {
    wake();
    stamp.current.age = 0;
    run();
  };

  const restNeedle = pointerAt(detentAngle(0));

  return (
    <div
      ref={(n) => {
        root.current = n;
        anchor.current = n;
      }}
      className="seal"
      role="slider"
      tabIndex={0}
      aria-label="Client seal press: arrows choose the client card, Space stamps the seal"
      aria-valuemin={0}
      aria-valuemax={2}
      aria-valuenow={0}
      aria-valuetext="Acme Studio"
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
          restamp();
        } else if (e.key === "Home") {
          e.preventDefault();
          go(0);
        } else if (e.key === "End") {
          e.preventDefault();
          go(2);
        } else if (e.key === "Escape") {
          setIdle(true);
          clock.current = 0;
          run();
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        {props.rack}
        {props.cards.map((card, i) => (
          <g
            key={i}
            ref={(n) => {
              cardRefs.current[i] = n;
            }}
            transform={shift(0, i === 0 ? CARD_OUT_Y : CARD_HOME_Y, 0)}
          >
            {card}
          </g>
        ))}
        {props.bed}
        <g ref={imprint} opacity="0">
          {props.imprint}
        </g>
        {props.sealStatic}
        <g ref={seal}>{props.sealHead}</g>
        {props.knob}
        <path ref={needle} className="iso-line seal-needle" data-tone="lit" d={restNeedle} />
      </IsoFigure>
      <div className="seal-actions">
        {CLIENTS.map((c, i) => (
          <button key={c.init} type="button" onClick={() => go(i)} aria-pressed={chosen === i && !idle}>
            {c.init}
          </button>
        ))}
        <button type="button" onClick={restamp}>
          Stamp
        </button>
      </div>
    </div>
  );
}
