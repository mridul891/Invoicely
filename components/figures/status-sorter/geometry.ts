import {
  circleRing,
  extrude,
  insetPlan,
  onTop,
  pathOf,
  planOutline,
  ring,
  slabOf,
  topMatrix,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import {
  BASE,
  BASE_H,
  CASE,
  CASE_H,
  CASE_Z,
  FOOT_H,
  HOLE_GAP,
  HOLE_W,
  KNOB_H,
  KNOB_R,
  KNOB_X,
  KNOB_Y,
  KNOB_Z,
  P,
  RAIL,
  RAIL_H,
  RAIL_Z,
  at,
  holeX,
} from "./view";

const slab = (plan: Plan, z: number, h: number, steps = 6, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
const cyl = (cx: number, cy: number, r: number, z: number, h: number, steps = 32, bevel = 0) =>
  extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true, bevel });
const seg = (a: Point3, b: Point3) => pathOf([at(a), at(b)]);
const join = (p: string[]) => p.join("");
const RAD = Math.PI / 180;

function knurl(cx: number, cy: number, r: number, z0: number, z1: number, count: number) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    if (nx * Math.cos(57 * RAD) + ny * Math.sin(57 * RAD) < 0.15) continue;
    out.push(seg([cx + r * nx, cy + r * ny, z0 + 0.4], [cx + r * nx, cy + r * ny, z1 - 0.4]));
  }
  return join(out);
}

// ── Base ──
const FEET: [number, number][] = [
  [BASE.x + 18, BASE.y + 16],
  [BASE.x + BASE.w - 18, BASE.y + 16],
  [BASE.x + 18, BASE.y + BASE.d - 16],
  [BASE.x + BASE.w - 18, BASE.y + BASE.d - 16],
];
const SCREWS: [number, number][] = [
  [BASE.x + 9, BASE.y + 9],
  [BASE.x + BASE.w - 9, BASE.y + 9],
  [BASE.x + 9, BASE.y + BASE.d - 9],
  [BASE.x + BASE.w - 9, BASE.y + BASE.d - 9],
];
const LABEL: Plan = { x: BASE.x + 14, y: BASE.y + 10, w: 64, d: 12, r: 2 };

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - FOOT_H, BASE_H).fill,
  feet: FEET.map(([x, y]) => [cyl(x, y, 7, -BASE_H - FOOT_H, 1.6, 28), cyl(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28)]),
  slab: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P),
  screwRings: join(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: SCREWS.map(([x, y]) => at([x, y, 0])),
  label: slab(LABEL, 0, 0.8, 4),
  labelLine: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
  labelRules: join([0, 1, 2].map((r) => onTop([[LABEL.x + 8, LABEL.y + 3.4 + r * 2.6], [LABEL.x + (r === 1 ? 40 : 52), LABEL.y + 3.4 + r * 2.6]], 0.8, P))),
  labelScrews: [at([LABEL.x + 3.4, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 3.4, LABEL.y + LABEL.d / 2, 0.8])],
};

// ── Pigeonhole case: floor, roof, sides, back, 3 dividers, shelf ──
const DIVIDERS = [1, 2, 3].map((i) => ({
  x: CASE.x + 6 + i * HOLE_W + (i - 1) * HOLE_GAP + HOLE_GAP / 2 - 1,
  y: CASE.y + 2,
  w: 2,
  d: CASE.d - 4,
  r: 0.5,
}));

export const CASE_ART = {
  floor: slab({ ...CASE, r: 2 }, CASE_Z, 3, 6, 0.6),
  roof: slab({ ...CASE, r: 2 }, CASE_Z + CASE_H - 3, 3, 6, 0.6),
  left: slab({ x: CASE.x, y: CASE.y, w: 4, d: CASE.d, r: 1 }, CASE_Z + 3, CASE_H - 6, 3),
  right: slab({ x: CASE.x + CASE.w - 4, y: CASE.y, w: 4, d: CASE.d, r: 1 }, CASE_Z + 3, CASE_H - 6, 3),
  back: slab({ x: CASE.x + 4, y: CASE.y, w: CASE.w - 8, d: 2.5, r: 0.5 }, CASE_Z + 3, CASE_H - 6, 4),
  dividers: DIVIDERS.map((d) => slab(d, CASE_Z + 3, CASE_H - 6, 2)),
  shelf: slab({ x: CASE.x + 4, y: CASE.y + 2, w: CASE.w - 8, d: CASE.d - 4, r: 1 }, CASE_Z + 12, 1.6, 4),
  shelfLine: planOutline(insetPlan({ x: CASE.x + 4, y: CASE.y + 2, w: CASE.w - 8, d: CASE.d - 4, r: 1 }, 1.2), CASE_Z + 13.6, P),
  screws: [at([CASE.x + 8, CASE.y + CASE.d - 6, CASE_Z + CASE_H]), at([CASE.x + CASE.w - 8, CASE.y + CASE.d - 6, CASE_Z + CASE_H])],
};

// ── Envelopes: one per hole, standing on the shelf (built at hole 0, moved per frame) ──
export const ENVELOPE: Plan = { x: 0, y: CASE.y + 8, w: HOLE_W - 8, d: 20, r: 1.5 };
export const ENVELOPE_Z = CASE_Z + 13.6;
export const ENVELOPE_H = 24;
export const ENVELOPE_LIFT = 6;

export const envelopeAt = (i: number) => {
  const plan: Plan = { ...ENVELOPE, x: holeX(i) + 4 };
  return {
    body: slab(plan, ENVELOPE_Z, ENVELOPE_H, 4, 0.5),
    flap: onTop(
      [
        [plan.x + 4, plan.y + plan.d],
        [plan.x + plan.w / 2, plan.y + plan.d - 8],
        [plan.x + plan.w - 4, plan.y + plan.d],
      ],
      ENVELOPE_Z + ENVELOPE_H,
      P,
    ),
    faceText: topMatrix([plan.x + 6, plan.y + 5], ENVELOPE_Z + ENVELOPE_H, P, "x"),
  };
};

// ── Rail + carriage with filing finger ──
export const RAIL_ART = {
  rail: slab(RAIL, RAIL_Z, RAIL_H, 4, 0.6),
  stops: [RAIL.x - 3, RAIL.x + RAIL.w].map((x) => slab({ x: x - 1.5, y: RAIL.y - 1, w: 3, d: RAIL.d + 2, r: 0.8 }, RAIL_Z, RAIL_H + 2, 3)),
  ruleMinor: (() => {
    const out: string[] = [];
    for (let x = RAIL.x + 8; x <= RAIL.x + RAIL.w - 8; x += 6) {
      out.push(onTop([[x, RAIL.y + RAIL.d], [x, RAIL.y + RAIL.d - 2.4]], RAIL_Z + RAIL_H, P));
    }
    return join(out);
  })(),
};

export const CARRIAGE: Plan = { x: 0, y: RAIL.y - 4, w: 26, d: 16, r: 2 };
export const carriageAt = () => ({
  block: slab(CARRIAGE, RAIL_Z + RAIL_H, 6, 4, 0.6),
  finger: slab({ x: 11, y: -14, w: 4, d: 12, r: 1 }, RAIL_Z + RAIL_H + 6, 4, 2),
  fingerTip: seg([13, RAIL.y - 2, RAIL_Z + RAIL_H + 10], [13, RAIL.y - 2, RAIL_Z + RAIL_H + 4]),
  screws: [at([4, RAIL.y + 4, RAIL_Z + RAIL_H + 6]), at([22, RAIL.y + 4, RAIL_Z + RAIL_H + 6])],
});

// ── Detent knob with 4 stops ──
function detents() {
  const ticks: string[] = [];
  for (let s = 0; s < 4; s++) {
    const a = -Math.PI / 2 + (s / 4) * Math.PI * 2;
    const o = KNOB_R + 5;
    const inn = o - 2.6;
    ticks.push(
      onTop(
        [
          [KNOB_X + Math.sin(a) * inn, KNOB_Y - Math.cos(a) * inn],
          [KNOB_X + Math.sin(a) * o, KNOB_Y - Math.cos(a) * o],
        ],
        KNOB_Z + KNOB_H,
        P,
      ),
    );
  }
  return join(ticks);
}

export const KNOB_ART = {
  plate: slab({ x: KNOB_X - 16, y: KNOB_Y - 16, w: 32, d: 32, r: 3 }, 0, 2, 4, 0.5),
  knob: cyl(KNOB_X, KNOB_Y, KNOB_R, KNOB_Z + 2, KNOB_H, 36),
  knurl: knurl(KNOB_X, KNOB_Y, KNOB_R, KNOB_Z + 2, KNOB_Z + 2 + KNOB_H, 28),
  detents: detents(),
};

export const pointerAt = (angle: number) =>
  onTop(
    [
      [KNOB_X, KNOB_Y],
      [KNOB_X + Math.sin(angle) * (KNOB_R - 1.5), KNOB_Y - Math.cos(angle) * (KNOB_R - 1.5)],
    ],
    KNOB_Z + 2 + KNOB_H + 0.2,
    P,
  );
