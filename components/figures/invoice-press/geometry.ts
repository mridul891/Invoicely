import {
  circleRing,
  extrude,
  insetPlan,
  onTop,
  pathOf,
  planOutline,
  ring,
  sideSeam,
  slabOf,
  topMatrix,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import {
  BAR,
  BAR_H,
  BAR_Z,
  BASE,
  BASE_H,
  BED,
  BED_H,
  BED_Z,
  BOX,
  BOX_H,
  BOX_Z,
  CARD,
  CARD_H,
  CARD_Z,
  DIAL_H,
  DIAL_R,
  DIAL_X,
  DIAL_Y,
  DIAL_Z,
  DRAWER,
  FOOT_H,
  HEAD,
  P,
  POST_H,
  POST_L,
  POST_R,
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
    // cull the hidden back half against the 57° view
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

// ── Base: halo, 4 feet, slab, groove, screws, ruler, label ──
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
const STRIP: Plan = { x: BASE.x + 14, y: BASE.y + BASE.d - 16, w: 150, d: 7, r: 1 };
const LABEL: Plan = { x: BASE.x + 14, y: BASE.y + 10, w: 64, d: 12, r: 2 };

function rulerTicks() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let x = STRIP.x + 6; x <= STRIP.x + STRIP.w - 6; x += 4) {
    const big = Math.round(x) % 20 === 0;
    (big ? major : minor).push(
      onTop(
        [
          [x, STRIP.y + 1],
          [x, STRIP.y + (big ? 4.6 : 3)],
        ],
        0.6,
        P,
      ),
    );
  }
  return { minor: join(minor), major: join(major) };
}
const TICKS = rulerTicks();

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - FOOT_H, BASE_H).fill,
  feet: FEET.map(([x, y]) => [cyl(x, y, 7, -BASE_H - FOOT_H, 1.6, 28), cyl(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28)]),
  slab: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P),
  screwRings: join(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: SCREWS.map(([x, y]) => at([x, y, 0])),
  strip: slab(STRIP, 0, 0.6, 3),
  ticksMinor: TICKS.minor,
  ticksMajor: TICKS.major,
  label: slab(LABEL, 0, 0.8, 4),
  labelLine: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
  labelRules: join([0, 1, 2].map((r) => onTop([[LABEL.x + 8, LABEL.y + 3.4 + r * 2.6], [LABEL.x + (r === 1 ? 40 : 52), LABEL.y + 3.4 + r * 2.6]], 0.8, P))),
  labelScrews: [at([LABEL.x + 3.4, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 3.4, LABEL.y + LABEL.d / 2, 0.8])],
};

// ── Bed + invoice card (lit subject) ──
export const BED_ART = {
  bed: slab(BED, BED_Z, BED_H, 6, 0.8),
  bedSeam: planOutline(insetPlan(BED, 2.2), BED_Z + BED_H, P),
  stops: [
    slab({ x: BED.x - 2, y: BED.y - 3, w: 5, d: BED.d + 6, r: 1 }, BED_Z, BED_H + 3, 3, 0.5),
    slab({ x: BED.x + BED.w - 3, y: BED.y - 3, w: 5, d: BED.d + 6, r: 1 }, BED_Z, BED_H + 3, 3, 0.5),
  ],
  card: slab(CARD, CARD_Z, CARD_H, 5, 0.6),
  // three engraved line-item rules + total rule on the card face
  rules: join(
    [0, 1, 2, 3].map((r) =>
      onTop(
        [
          [CARD.x + 10, CARD.y + 14 + r * 13],
          [CARD.x + CARD.w - (r === 3 ? 34 : 10), CARD.y + 14 + r * 13],
        ],
        CARD_Z + CARD_H,
        P,
      ),
    ),
  ),
  amounts: join(
    [0, 1, 2].map((r) =>
      onTop(
        [
          [CARD.x + CARD.w - 28, CARD.y + 14 + r * 13],
          [CARD.x + CARD.w - 10, CARD.y + 14 + r * 13],
        ],
        CARD_Z + CARD_H,
        P,
      ),
    ),
  ),
  faceText: topMatrix([CARD.x + 10, CARD.y + CARD.d - 10], CARD_Z + CARD_H, P, "x"),
};

// ── Stamp gantry ──
const RAIL_Y = -6;
export const GANTRY_ART = {
  feet: [POST_L, POST_R].map((p) => slab(insetPlan(p, -3), 0, 2, 4)),
  posts: [POST_L, POST_R].map((p) => slab(p, 2, POST_H - 2, 4)),
  postSeams: join([POST_L, POST_R].map((p) => sideArc(p.x + 6, p.y + 6, 6.4, 18, 20))),
  bar: slab(BAR, BAR_Z, BAR_H, 4, 0.8),
  barScrews: [at([BAR.x + BAR.w / 2, BAR.y + 4, BAR_Z + BAR_H]), at([BAR.x + BAR.w / 2, BAR.y + BAR.d - 4, BAR_Z + BAR_H])],
  collars: [POST_L, POST_R].map((p) => cyl(p.x + 6, p.y + 6, 7.4, POST_H - 4, 4, 28)),
  // spring around the stamp rod: caller splits back/front
  springBack: "",
  springFront: "",
  rod: slab({ x: HEAD.x + 8, y: RAIL_Y - 1.6, w: 4, d: 3.2, r: 1 }, BAR_Z - HEAD.x * 0 - 18, 18, 3),
  knob: cyl(40, RAIL_Y, 6, BAR_Z + BAR_H, 4.4, 32),
  knurl: knurl(40, RAIL_Y, 6, BAR_Z + BAR_H, BAR_Z + BAR_H + 4.4, 28),
  pointer: onTop([[36, RAIL_Y], [45, RAIL_Y]], BAR_Z + BAR_H + 4.4, P),
  railLine: seg([HEAD.x + 10, RAIL_Y, 4], [HEAD.x + 10, RAIL_Y, BAR_Z]),
};
export const HEAD_Z = BAR_Z - 6;
export const HEAD_H = 8;
export const HEAD_ART = {
  head: slab(HEAD, HEAD_Z, HEAD_H, 4, 0.6),
  face: slab({ x: HEAD.x + 2, y: HEAD.y + 6, w: HEAD.w - 4, d: HEAD.d - 12, r: 1.5 }, HEAD_Z - 3, 3, 3),
  stampText: topMatrix([HEAD.x + 5, HEAD.y + HEAD.d - 14], HEAD_Z - 0.2, P, "x"),
};

// ── Cash box, drawer, coin, dial ──
export const COIN_R = 7;
export const COIN_TOP = 62;
export const COIN_HOME: Point3 = [98, -6, COIN_TOP];
export const COIN_PAID: Point3 = [98, -6, BOX_H + 4];

function dialTicks() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let s = 0; s < 14; s++) {
    const a = (s / 14) * Math.PI * 2;
    const big = s % 2 === 0;
    const o = DIAL_R - 2.6;
    const inn = o - (big ? 2.8 : 1.5);
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
const DT = dialTicks();

export const BOX_ART = {
  box: slab(BOX, BOX_Z, BOX_H, 6, 1),
  seam: sideSeam(BOX, 20, P, 6),
  slot: slab({ x: 88, y: -12, w: 20, d: 4, r: 2 }, BOX_H, 1.2, 4),
  drawerFront: slab({ x: BOX.x - 1, y: BOX.y + 8, w: 3, d: 68, r: 1 }, 6, 16, 3, 0.5),
  pull: slab({ x: BOX.x - 4, y: BOX.y + 34, w: 4, d: 16, r: 2 }, 12, 4, 3),
  drawerScrews: [at([BOX.x - 1, BOX.y + 14, 22]), at([BOX.x - 1, BOX.y + 70, 22])],
  coins: [0, 1, 2].map((i) => cyl(96 + i * 3, 22 - i * 8, 5.5, BOX_H + 0.5, 1.4, 28)),
  dialStand: slab({ x: DIAL_X - 15, y: DIAL_Y - 14, w: 30, d: 28, r: 3 }, BOX_H, 2, 4, 0.5),
  puck: cyl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z, DIAL_H, 56, 0.8),
  bezel: ring(DIAL_X, DIAL_Y, DIAL_R - 1, DIAL_Z + DIAL_H, P, 56),
  dialMinor: DT.minor,
  dialMajor: DT.major,
  dialKnurl: knurl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, DIAL_Z + DIAL_H, 48),
  dialBand: sideArc(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, 40),
  crown: slab({ x: DIAL_X + DIAL_R - 0.6, y: DIAL_Y - 2.4, w: 4.4, d: 4.8, r: 1.2 }, DIAL_Z + 2, 4, 3),
  lug: slab({ x: DIAL_X - 3, y: DIAL_Y - DIAL_R - 3.4, w: 6, d: 4, r: 1.2 }, DIAL_Z + 1, 4, 3),
  coin: cyl(0, 0, COIN_R, 0, 1.6, 36),
  coinFace: ring(0, 0, COIN_R - 1.8, 1.6, P, 36),
};

export const DRAWER_ART = {
  box: slab(DRAWER, 4, 18, 3, 0.5),
};
