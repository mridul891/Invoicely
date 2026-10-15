"use client";

import * as React from "react";
import { FaceText, IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, spring, useReadout, type Spring } from "@/components/iso/react/live";
import {
  BLOCK_TARGETS,
  BLOCK_Y,
  BLOCK_Z,
  CARD_HOME_X,
  CARD_Y,
  CARD_Z,
  GEAR_H,
  GEAR_Z,
  dialNeedleAt,
  needleAngleFor,
  psheetHeadTransform,
  psheetPaths,
} from "./geometry";
import { STAGE, clamp01, ease, readoutOf, seg, spokenOf } from "./model";
import { BLOCK_X, DIAL_R, DIAL_X, DIAL_Y, GEAR_A, GEAR_B, HEIGHT, WIDTH, at, placeAt, shift } from "./view";

const LOOP = 16;
const PRESS_Z = 38;
const PRESS_TRAVEL = 30;
const PIN_X = DIAL_X - DIAL_R - 8;
const PIN_Y = DIAL_Y + 6;

// Explode assemblies: painter slot + world move vector.
const ASSEMBLIES = [
  { v: [-54, 0, 10] as const },
  { v: [0, 40, 0] as const },
  { v: [0, 0, 42] as const },
  { v: [0, 0, 84] as const },
  { v: [36, -34, 14] as const },
  { v: [58, 10, 12] as const },
  { v: [88, 0, 0] as const },
  { v: [0, 0, 42] as const },
];

const REST = {
  card: shift(CARD_HOME_X - 15, CARD_Y, CARD_Z),
  blocks: BLOCK_X.map((x) => shift(x, BLOCK_Y, BLOCK_Z)),
  press: shift(0, 0, PRESS_Z),
  needle: dialNeedleAt(needleAngleFor(0)),
  pin: placeAt([PIN_X, PIN_Y, 7]),
  psheet: psheetPaths(110),
};

interface Props {
  label: string;
  base: React.ReactNode;
  hopper: React.ReactNode;
  lane: React.ReactNode;
  chamber: React.ReactNode;
  pressRods: React.ReactNode;
  press: React.ReactNode;
  dialStatic: React.ReactNode;
  pin: React.ReactNode;
  gearA: React.ReactNode;
  gearB: React.ReactNode;
  printer: React.ReactNode;
  tray: React.ReactNode;
  card: React.ReactNode;
  blocks: React.ReactNode[];
  csheet: React.ReactNode;
  rules: { gClient: React.ReactNode; gItems: React.ReactNode; gTotal: React.ReactNode };
}

export function InvoiceMachineLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const cardG = React.useRef<SVGGElement | null>(null);
  const blockG = React.useRef<(SVGGElement | null)[]>([]);
  const pressG = React.useRef<SVGGElement | null>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const pinG = React.useRef<SVGGElement | null>(null);
  const gearGA = React.useRef<SVGGElement | null>(null);
  const gearGB = React.useRef<SVGGElement | null>(null);
  const ruleG = React.useRef<(SVGGElement | null)[]>([]);
  const flowG = React.useRef<SVGGElement | null>(null);
  const psheetG = React.useRef<SVGGElement | null>(null);
  const psheetText = React.useRef<SVGGElement | null>(null);
  const psheet = React.useRef({
    fill: null as SVGPathElement | null,
    shades: [null, null, null, null] as (SVGPathElement | null)[],
    top: null as SVGPathElement | null,
    edge: null as SVGPathElement | null,
    rules: null as SVGPathElement | null,
  });
  const explodeG = React.useRef<(SVGGElement | null)[]>([]);
  const progress = React.useRef<HTMLDivElement | null>(null);

  const clockT = React.useRef(0);
  const playing = React.useRef(false);
  const hasPlayed = React.useRef(false);
  const exploded = React.useRef(false);
  const springs = React.useRef(ASSEMBLIES.map(() => ({ at: 0, rate: 0 })));
  const pending = React.useRef<{ at: number; i: number; v: number }[]>([]);
  const runClock = React.useRef(0);
  const frame = React.useRef(0);
  const last = React.useRef(0);
  const [visible, setVisible] = React.useState(false);
  const [isExploded, setIsExploded] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const draw = React.useCallback(
    (t: number) => {
      // — job parts —
      const eClient = seg(t, 0.02, STAGE.client);
      cardG.current?.setAttribute("transform", shift(CARD_HOME_X - 15 + 148 * eClient, CARD_Y, CARD_Z));
      let travel = 148 * eClient;
      const xs = BLOCK_X.map((x0, i) => {
        const e = seg(t, 0.22 + 0.04 * i, 0.36 + 0.04 * i);
        const x = x0 + (BLOCK_TARGETS[i]! - x0) * e;
        travel += Math.abs(BLOCK_TARGETS[i]! - x0) * e;
        blockG.current[i]?.setAttribute("transform", shift(x, BLOCK_Y, BLOCK_Z));
        return x;
      });
      void xs;
      // — tax dial: sweep then lock with a decaying settle wobble —
      const target = needleAngleFor(10);
      const start = needleAngleFor(0);
      let ang: number;
      if (t < 0.58) {
        ang = start + (target - start) * ease((t - 0.45) / 0.13);
      } else {
        const age = (t - 0.58) * LOOP;
        ang = target + 0.4 * Math.exp(-3.5 * age) * Math.sin(9 * age);
      }
      needle.current?.setAttribute("d", dialNeedleAt(ang));
      const pinT = seg(t, 0.585, STAGE.tax);
      pinG.current?.setAttribute("transform", placeAt([PIN_X, PIN_Y, 7 - 4 * pinT]));
      // — press bump during assembly —
      const eA = seg(t, STAGE.tax, STAGE.assemble);
      const press = eA < 0.4 ? ease(eA / 0.4) : eA > 0.7 ? 1 - ease((eA - 0.7) / 0.3) : 1;
      pressG.current?.setAttribute("transform", shift(0, 0, PRESS_Z - PRESS_TRAVEL * press));
      // — chamber sheet gains its lines per stage —
      const ops = [seg(t, 0.06, 0.18), seg(t, 0.3, 0.44), seg(t, 0.64, 0.74)];
      ruleG.current.forEach((node, i) => node?.setAttribute("opacity", ops[i]!.toFixed(3)));
      // — printed sheet grows out of the rollers —
      const eP = seg(t, STAGE.assemble, 0.985);
      const lead = 110 + 50 * ease(eP);
      travel += (lead - 110) * 1.4;
      const sp = psheetPaths(lead);
      const P = psheet.current;
      P.fill?.setAttribute("d", sp.body.fill);
      sp.body.shades.forEach((d, i) => P.shades[i]?.setAttribute("d", d ?? ""));
      P.top?.setAttribute("d", sp.body.top);
      P.edge?.setAttribute("d", sp.body.outline);
      P.rules?.setAttribute("d", sp.rules);
      const w = lead - 108;
      psheetText.current?.setAttribute("opacity", w > 30 ? "1" : "0");
      if (w > 30) psheetG.current?.setAttribute("data-lit", "");
      else psheetG.current?.removeAttribute("data-lit");
      // — gears slaved to material motion (pure function, scrubs cleanly) —
      const angA = 0.09 * travel;
      const cA = at([GEAR_A.x, GEAR_A.y, GEAR_Z + GEAR_H / 2]);
      const cB = at([GEAR_B.x, GEAR_B.y, GEAR_Z + GEAR_H / 2]);
      gearGA.current?.setAttribute("transform", `rotate(${(angA * 57.3).toFixed(2)} ${cA[0].toFixed(1)} ${cA[1].toFixed(1)})`);
      gearGB.current?.setAttribute(
        "transform",
        `rotate(${((-angA * (GEAR_A.teeth / GEAR_B.teeth) + Math.PI / GEAR_B.teeth) * 57.3).toFixed(2)} ${cB[0].toFixed(1)} ${cB[1].toFixed(1)})`,
      );
      // — belt flow lines only while material moves —
      const moving = (t > 0.005 && t < 0.45) || (t > STAGE.assemble && t < 1);
      flowG.current?.setAttribute("opacity", moving ? "1" : "0.12");
      // — readout + progress —
      say(readoutOf(t));
      progress.current?.setAttribute("style", `width:${Math.round(t * 1000) / 10}%`);
      const node = root.current;
      if (node) {
        const spoken = spokenOf(t);
        if (node.getAttribute("aria-valuetext") !== spoken) node.setAttribute("aria-valuetext", spoken);
        node.setAttribute("aria-valuenow", `${Math.round(t * 100)}`);
      }
    },
    [say],
  );

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
      runClock.current += dt;
      const calm = asksForStillness();
      // staggered explode targets
      pending.current = pending.current.filter((p) => {
        if (runClock.current < p.at) return true;
        springs.current[p.i]!.at = p.v;
        springs.current[p.i]!.rate = 0;
        return false;
      });
      let moving = false;
      springs.current.forEach((s: Spring, i: number) => {
        const tgt = pending.current.some((p) => p.i === i) ? s.at : exploded.current ? 1 : 0;
        if (!spring(s, tgt, dt, 70, 13, calm)) moving = true;
      });
      if (playing.current && !calm) {
        clockT.current += dt / LOOP;
        if (clockT.current >= 1) {
          clockT.current = 1;
          playing.current = false;
          setIsPlaying(false);
        }
      }
      draw(clockT.current);
      // explode wrapper transforms
      explodeG.current.forEach((node, i) => {
        if (!node) return;
        const e = springs.current[i]!.at;
        const v = ASSEMBLIES[i]!.v;
        if (e < 0.001) node.removeAttribute("transform");
        else node.setAttribute("transform", shift(v[0] * e, v[1] * e, v[2] * e));
      });
      frame.current = moving || playing.current || pending.current.length ? requestAnimationFrame(tick) : 0;
      if (!frame.current && (playing.current || moving)) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [draw, stop]);

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

  // Autoplay once when first visible (the tour is the machine running).
  React.useEffect(() => {
    if (!visible || hasPlayed.current) return;
    hasPlayed.current = true;
    if (asksForStillness()) {
      clockT.current = 1;
      draw(1);
      return;
    }
    clockT.current = 0;
    playing.current = true;
    setIsPlaying(true);
    run();
  }, [visible, draw, run]);

  React.useEffect(() => {
    if (!visible) stop();
    else run();
  }, [visible, run, stop]);

  const generate = React.useCallback(() => {
    exploded.current = false;
    setIsExploded(false);
    pending.current = [];
    springs.current.forEach((s) => {
      s.at = 0;
      s.rate = 0;
    });
    clockT.current = 0;
    playing.current = true;
    setIsPlaying(true);
    run();
  }, [run]);

  const toggleExplode = React.useCallback(() => {
    const next = !exploded.current;
    exploded.current = next;
    setIsExploded(next);
    playing.current = false;
    setIsPlaying(false);
    const order = ASSEMBLIES.map((_, i) => i);
    if (!next) order.reverse();
    pending.current = order.map((i, k) => ({ at: runClock.current + k * 0.07, i, v: next ? 1 : 0 }));
    run();
  }, [run]);

  const scrubTo = React.useCallback(
    (clientX: number) => {
      const svg = root.current?.querySelector("svg");
      const box = svg?.getBoundingClientRect();
      if (!box || !box.width) return;
      clockT.current = clamp01((clientX - box.left) / box.width);
      playing.current = false;
      setIsPlaying(false);
      draw(clockT.current);
    },
    [draw],
  );

  const setRef = (i: number) => (n: SVGGElement | null) => {
    explodeG.current[i] = n;
  };

  return (
    <div
      ref={(n) => {
        root.current = n;
        anchor.current = n;
      }}
      className="imachine-live"
      role="slider"
      tabIndex={0}
      aria-label="The Invoice Machine: drag to scrub the build, Space generates, E explodes"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext="Ready"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        scrubTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) scrubTo(e.clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          generate();
        } else if (e.key === "e" || e.key === "E") {
          e.preventDefault();
          toggleExplode();
        } else if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          generate();
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          clockT.current = clamp01(clockT.current + 0.03);
          playing.current = false;
          setIsPlaying(false);
          draw(clockT.current);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          clockT.current = clamp01(clockT.current - 0.03);
          playing.current = false;
          setIsPlaying(false);
          draw(clockT.current);
        } else if (e.key === "Home") {
          e.preventDefault();
          clockT.current = 0;
          draw(0);
        } else if (e.key === "End") {
          e.preventDefault();
          clockT.current = 1;
          playing.current = false;
          setIsPlaying(false);
          draw(1);
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        <g ref={setRef(0)}>{props.hopper}</g>
        <g ref={setRef(1)}>{props.lane}</g>
        <g ref={setRef(6)}>{props.tray}</g>
        <g ref={setRef(5)}>
          {props.printer}
          <g ref={(n) => { gearGA.current = n; }}>{props.gearA}</g>
          <g ref={(n) => { gearGB.current = n; }}>{props.gearB}</g>
          <g ref={(n) => { psheetG.current = n; }} className="iso-solid">
            <path
              ref={(n) => { psheet.current.fill = n; }}
              className="iso-fill"
              d={REST.psheet.body.fill}
            />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                ref={(n) => { psheet.current.shades[i] = n; }}
                className="iso-shade"
                data-shade={i}
                d={REST.psheet.body.shades[i] ?? ""}
              />
            ))}
            <path ref={(n) => { psheet.current.top = n; }} className="iso-top" d={REST.psheet.body.top} />
            <path ref={(n) => { psheet.current.edge = n; }} className="iso-line iso-edge" data-tone="hi" d={REST.psheet.body.outline} />
            <path ref={(n) => { psheet.current.rules = n; }} className="iso-line" data-tone="mid" d={REST.psheet.body ? "" : ""} />
            <g ref={(n) => { psheetText.current = n; }} opacity="0">
              <FaceText transform={psheetHeadTransform()} size={3.6} tone="hi" anchor="start">
                INV-2026-0042
              </FaceText>
            </g>
          </g>
        </g>
        <g ref={setRef(2)}>
          {props.chamber}
          {props.csheet}
          {[props.rules.gClient, props.rules.gItems, props.rules.gTotal].map((r, i) => (
            <g
              key={i}
              ref={(n) => { ruleG.current[i] = n; }}
              opacity="0"
            >
              {r}
            </g>
          ))}
        </g>
        <g ref={setRef(4)}>
          {props.dialStatic}
          <g ref={(n) => { pinG.current = n; }} transform={REST.pin}>
            {props.pin}
          </g>
          <path ref={(n) => { needle.current = n; }} className="iso-line imachine-needle" data-tone="lit" d={REST.needle} />
        </g>
        <g ref={setRef(3)}>
          {props.pressRods}
          <g ref={(n) => { pressG.current = n; }} transform={REST.press}>
            {props.press}
          </g>
        </g>
        <g ref={setRef(7)}>
          <g ref={(n) => { cardG.current = n; }} transform={REST.card}>
            {props.card}
          </g>
          {props.blocks.map((b, i) => (
            <g key={i} ref={(n) => { blockG.current[i] = n; }} transform={REST.blocks[i]}>
              {b}
            </g>
          ))}
        </g>
        <g ref={(n) => { flowG.current = n; }} opacity="0.12">
          <path className="iso-line" data-tone="mid" data-flow d={""} />
        </g>
      </IsoFigure>
      <div className="imachine-progress" aria-hidden>
        <div ref={(n) => { progress.current = n; }} className="imachine-progress-fill" style={{ width: "0%" }} />
      </div>
      <div className="imachine-actions">
        <button type="button" className="imachine-generate" onClick={generate}>
          {isPlaying ? "Building…" : "Generate Invoice"}
        </button>
        <button type="button" onClick={generate}>
          Replay
        </button>
        <button type="button" onClick={toggleExplode} aria-pressed={isExploded}>
          {isExploded ? "Assemble" : "Explode"}
        </button>
      </div>
    </div>
  );
}
