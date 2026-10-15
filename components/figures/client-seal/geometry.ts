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
  ARM,
  ARM_H,
  ARM_Z,
  BASE,
  BASE_H,
  BED,
  BED_H,
  BED_Z,
  CARD_D,
  CARD_H,
  CARD_W,
  CARD_Z,
  FOOT_H,
  HEAD,
  HEAD_H,
  HEAD_Z,
  KNOB_H,
  KNOB_R,
  KNOB_X,
  KNOB_Y,
  KNOB_Z,
  P,
  POST,
  POST_H,
  RACK_BACK_Y,
  RACK_FRONT_Y,
  RACK_H,
  RACK_W,
  RACK_X,
  READER,
  SHEET,
  SHEET_H,
  SHEET_Z,
  at,
  slotCenterX,
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

// ── Base plate on feet, groove, screws, ruler, label ──
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
const STRIP: Plan = { x: 20, y: BASE.y + BASE.d - 16, w: 120, d: 7, r: 1 };

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - FOOT_H, BASE_H).fill,
  feet: FEET.map(([x, y]) => [cyl(x, y, 7, -BASE_H - FOOT_H, 1.6, 28), cyl(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28)]),
  slab: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P),
  screwRings: join(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: SCREWS.map(([x, y]) => at([x, y, 0])),
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
  label: slab(LABEL, 0, 0.8, 4),
  labelLine: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
  labelRules: join([0, 1, 2].map((r) => onTop([[LABEL.x + 8, LABEL.y + 3.4 + r * 2.6], [LABEL.x + (r === 1 ? 40 : 52), LABEL.y + 3.4 + r * 2.6]], 0.8, P))),
  labelScrews: [at([LABEL.x + 3.4, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 3.4, LABEL.y + LABEL.d / 2, 0.8])],
};

// ── Open-front card rack: back, sides, dividers, shelf ──
const DIV_X = [RACK_X + 35, RACK_X + 65];

export const RACK_ART = {
  back: slab({ x: RACK_X, y: RACK_BACK_Y, w: RACK_W, d: 3, r: 1 }, 0, RACK_H, 4, 0.5),
  left: slab({ x: RACK_X, y: RACK_BACK_Y, w: 4, d: RACK_FRONT_Y - RACK_BACK_Y, r: 1 }, 0, RACK_H, 3, 0.5),
  right: slab({ x: RACK_X + RACK_W - 4, y: RACK_BACK_Y, w: 4, d: RACK_FRONT_Y - RACK_BACK_Y, r: 1 }, 0, RACK_H, 3, 0.5),
  dividers: DIV_X.map((x) => slab({ x: x - 1, y: RACK_BACK_Y + 3, w: 2, d: RACK_FRONT_Y - RACK_BACK_Y - 3, r: 0.5 }, 0, RACK_H - 8, 2)),
  shelf: slab({ x: RACK_X + 4, y: RACK_BACK_Y + 3, w: RACK_W - 8, d: RACK_FRONT_Y - RACK_BACK_Y - 3, r: 1 }, 0, 3, 4, 0.4),
  shelfLine: planOutline(
    insetPlan({ x: RACK_X + 4, y: RACK_BACK_Y + 3, w: RACK_W - 8, d: RACK_FRONT_Y - RACK_BACK_Y - 3, r: 1 }, 1.2),
    3,
    P,
  ),
  screws: [at([RACK_X + 8, RACK_BACK_Y + 1.5, RACK_H]), at([RACK_X + RACK_W - 8, RACK_BACK_Y + 1.5, RACK_H])],
  reader: slab(READER, 0, 4, 4, 0.5),
  readerGroove: onTop([[READER.x + 4, READER.y + READER.d / 2], [READER.x + READER.w - 4, READER.y + READER.d / 2]], 4, P),
};

// ── Client cards (built per slot, moved in y per frame) ──
export const cardPlan = (i: number): Plan => ({ x: slotCenterX(i) - CARD_W / 2, y: 0, w: CARD_W, d: CARD_D, r: 1.5 });

export const cardAt = (i: number) => {
  const plan = cardPlan(i);
  return {
    body: slab({ ...plan, y: 0 }, CARD_Z, CARD_H, 4, 0.5),
    tab: slab({ x: plan.x + 4, y: -1, w: 10, d: CARD_D + 1, r: 1 }, CARD_Z + CARD_H - 4, 4, 2),
    faceText: topMatrix([plan.x + 9, 0.5], CARD_Z + CARD_H, P, "x"),
  };
};

// ── Invoice bed, sheet, engraved lines, payment chips ──
export const BED_ART = {
  bed: slab(BED, BED_Z, BED_H, 6, 0.6),
  bedSeam: planOutline(insetPlan(BED, 2), BED_Z + BED_H, P),
  sheet: slab(SHEET, SHEET_Z, SHEET_H, 5, 0.4),
  headerRules: join(
    [0, 1].map((r) =>
      onTop([[SHEET.x + 8, SHEET.y + 8 + r * 6], [SHEET.x + 62, SHEET.y + 8 + r * 6]], SHEET_Z + SHEET_H, P),
    ),
  ),
  clientRule: onTop([[SHEET.x + 8, SHEET.y + 24], [SHEET.x + 52, SHEET.y + 24]], SHEET_Z + SHEET_H, P),
  itemRules: join(
    [0, 1].map((r) =>
      onTop([[SHEET.x + 8, SHEET.y + 32 + r * 6], [SHEET.x + SHEET.w - 26, SHEET.y + 32 + r * 6]], SHEET_Z + SHEET_H, P),
    ),
  ),
  upi: slab({ x: SHEET.x + 6, y: SHEET.y + SHEET.d - 14, w: 36, d: 9, r: 2 }, SHEET_Z + SHEET_H, 1.2, 3),
  upiText: topMatrix([SHEET.x + 10, SHEET.y + SHEET.d - 11], SHEET_Z + SHEET_H + 1.2, P, "x"),
  bank: slab({ x: SHEET.x + 46, y: SHEET.y + SHEET.d - 14, w: 40, d: 9, r: 2 }, SHEET_Z + SHEET_H, 1.2, 3),
  bankText: topMatrix([SHEET.x + 50, SHEET.y + SHEET.d - 11], SHEET_Z + SHEET_H + 1.2, P, "x"),
};

// Latched seal imprint on the sheet header (opacity driven per frame).
export const IMPRINT = {
  box: planOutline({ x: SHEET.x + 64, y: SHEET.y + 4, w: 42, d: 14, r: 2 }, SHEET_Z + SHEET_H + 0.1, P, 6),
  text: topMatrix([SHEET.x + 68, SHEET.y + 9], SHEET_Z + SHEET_H + 0.1, P, "x"),
};

// ── Seal press: post, collar, arm, rod, head, face ──
export const SEAL_ART = {
  post: slab(POST, 0, POST_H, 4, 0.5),
  collar: cyl(POST.x + 6, POST.y + 6, 8.5, ARM_Z, 4, 28),
  arm: slab(ARM, ARM_Z, ARM_H, 4, 0.6),
  armScrews: [at([ARM.x + 6, ARM.y + 5, ARM_Z + ARM_H]), at([POST.x + 6, POST.y + 6, ARM_Z + ARM_H])],
  rod: slab({ x: HEAD.x + 7, y: HEAD.y + 7, w: 6, d: 6, r: 1 }, HEAD_Z + HEAD_H, ARM_Z + ARM_H - HEAD_Z - HEAD_H, 3),
  head: slab(HEAD, HEAD_Z, HEAD_H, 4, 0.6),
  face: slab({ x: HEAD.x + 2, y: HEAD.y + 2, w: HEAD.w - 4, d: HEAD.d - 4, r: 1.5 }, HEAD_Z - 3, 3, 3),
  faceText: topMatrix([HEAD.x + 5, HEAD.y + 5], HEAD_Z - 0.2, P, "x"),
};

// ── Selector knob with 3 detents ──
function detents() {
  const out: string[] = [];
  for (let s = 0; s < 3; s++) {
    const a = -Math.PI / 2 + ((s - 1) / 3) * Math.PI * 1.2;
    const o = KNOB_R + 5;
    const inn = o - 2.6;
    out.push(
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
  return join(out);
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
