import {
  circleRing,
  extrude,
  insetPlan,
  onTop,
  pathOf,
  planOutline,
  ring,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import {
  BAR_D,
  BAR_W,
  BASE,
  BASE_H,
  DIAL_H,
  DIAL_R,
  DIAL_X,
  DIAL_Y,
  DIAL_Z,
  FOOT_H,
  P,
  PLINTH,
  PLINTH_H,
  PLINTH_Z,
  SUB_X,
  TAX_X,
  at,
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

function sideArc(cx: number, cy: number, r: number, z: number, steps = 24) {
  const pts: [number, number][] = [];
  for (let s = 0; s <= steps; s++) {
    const a = (57 - 90 + (s / steps) * 180) * RAD;
    pts.push(at([cx + r * Math.cos(a), cy + r * Math.sin(a), z]));
  }
  return pathOf(pts);
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
const STRIP: Plan = { x: BASE.x + 90, y: BASE.y + BASE.d - 16, w: 120, d: 7, r: 1 };

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
  strip: slab(STRIP, 0, 0.6, 3),
  stripTicks: (() => {
    const minor: string[] = [];
    const major: string[] = [];
    for (let x = STRIP.x + 6; x <= STRIP.x + STRIP.w - 6; x += 4) {
      const big = Math.round(x) % 20 === 0;
      (big ? major : minor).push(onTop([[x, STRIP.y + 1], [x, STRIP.y + (big ? 4.6 : 3)]], 0.6, P));
    }
    return { minor: join(minor), major: join(major) };
  })(),
};

// ── Plinth + back ruler panel ──
const PANEL: Plan = { x: PLINTH.x, y: PLINTH.y, w: PLINTH.w, d: 4, r: 1 };
export const BARS_ART = {
  plinth: slab(PLINTH, PLINTH_Z, PLINTH_H, 6, 0.6),
  plinthSeam: planOutline(insetPlan(PLINTH, 2), PLINTH_Z + PLINTH_H, P),
  panel: slab(PANEL, PLINTH_Z + PLINTH_H, 30, 4, 0.5),
  panelTicks: (() => {
    const out: string[] = [];
    for (let z = 6; z <= 26; z += 4) {
      out.push(seg([PANEL.x + 4, PANEL.y + PANEL.d, PLINTH_Z + PLINTH_H + z], [PANEL.x + 12, PANEL.y + PANEL.d, PLINTH_Z + PLINTH_H + z]));
    }
    return join(out);
  })(),
  zero: onTop([[PANEL.x + 4, PANEL.y + PANEL.d], [PANEL.x + PANEL.w - 4, PANEL.y + PANEL.d]], PLINTH_Z + PLINTH_H + 2, P),
};

// Bars rebuilt per frame: plan + z + height → SolidPaths.
export const barPlan = (x: number): Plan => ({ x, y: PLINTH.y + 8, w: BAR_W, d: BAR_D, r: 1.5 });
export const barPaths = (x: number, h: number) => slab(barPlan(x), PLINTH_Z + PLINTH_H, Math.max(0.6, h), 5, 0.5);
export { SUB_X, TAX_X };

// ── Rate dial with 4 detents + crank ──
function detents() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let s = 0; s < 16; s++) {
    const a = (s / 16) * Math.PI * 2;
    const big = s % 4 === 0;
    const o = DIAL_R - 2.6;
    const inn = o - (big ? 3 : 1.6);
    (big ? major : minor).push(
      onTop(
        [
          [DIAL_X + Math.sin(a) * inn, DIAL_Y - Math.cos(a) * inn],
          [DIAL_X + Math.sin(a) * o, DIAL_Y - Math.cos(a) * o],
        ],
        DIAL_Z + DIAL_H,
        P,
      ),
    );
  }
  return { minor: join(minor), major: join(major) };
}
const DT = detents();

export const DIAL_ART = {
  stand: slab({ x: DIAL_X - 22, y: DIAL_Y - 20, w: 44, d: 40, r: 3 }, 0, DIAL_Z, 4, 0.5),
  standScrews: [
    at([DIAL_X - 18, DIAL_Y - 16, DIAL_Z]),
    at([DIAL_X + 18, DIAL_Y - 16, DIAL_Z]),
    at([DIAL_X - 18, DIAL_Y + 16, DIAL_Z]),
    at([DIAL_X + 18, DIAL_Y + 16, DIAL_Z]),
  ],
  puck: cyl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z, DIAL_H, 56, 0.8),
  bezel: ring(DIAL_X, DIAL_Y, DIAL_R - 1, DIAL_Z + DIAL_H, P, 56),
  knurl: knurl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, DIAL_Z + DIAL_H, 48),
  band: sideArc(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, 40),
  minor: DT.minor,
  major: DT.major,
  crank: slab({ x: DIAL_X + DIAL_R - 0.6, y: DIAL_Y - 3, w: 10, d: 6, r: 1.5 }, DIAL_Z + 2, 4, 3),
  crankKnob: cyl(DIAL_X + DIAL_R + 9, DIAL_Y, 3.4, DIAL_Z + 1, 6, 20),
  crankKnurl: knurl(DIAL_X + DIAL_R + 9, DIAL_Y, 3.4, DIAL_Z + 1, DIAL_Z + 7, 14),
};

export const needleAt = (angle: number) =>
  onTop(
    [
      [DIAL_X - Math.sin(angle) * 4, DIAL_Y + Math.cos(angle) * 4],
      [DIAL_X + Math.sin(angle) * (DIAL_R - 4), DIAL_Y - Math.cos(angle) * (DIAL_R - 4)],
    ],
    DIAL_Z + DIAL_H + 0.2,
    P,
  );
