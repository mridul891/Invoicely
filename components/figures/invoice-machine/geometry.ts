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
  BLOCK_D,
  BLOCK_W,
  BLOCK_X,
  CARD_D,
  CARD_H,
  CARD_W,
  CHAMBER_D,
  CHAMBER_W,
  CHAMBER_X,
  CHAMBER_Y,
  DIAL_H,
  DIAL_R,
  DIAL_X,
  DIAL_Y,
  DIAL_Z,
  FLOOR_H,
  FOOT_H,
  GEAR_A,
  GEAR_B,
  LANE,
  LANE_H,
  LANE_Z,
  P,
  POST_H,
  PRINT_X,
  PSHEET_D,
  PSHEET_W,
  PSHEET_Y,
  SHEET_D,
  SHEET_W,
  SHEET_X,
  SHEET_Y,
  SLAT_COUNT,
  TRAY,
  TRAY_WALL,
  TRAY_Z,
  WALL_H,
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
const STRIP: Plan = { x: -60, y: BASE.y + BASE.d - 16, w: 170, d: 7, r: 1 };

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

// ── Lane conveyor west of chamber + motor ──
const LANE_W = CHAMBER_X - LANE.x; // -168 → -24
const slatW = LANE_W / SLAT_COUNT;
const MOTOR: Plan = { x: LANE.x - 24, y: LANE.y + 2, w: 22, d: 26, r: 2 };

export const LANE_ART = {
  bed: slab({ x: LANE.x, y: LANE.y, w: LANE_W, d: LANE.d, r: 2 }, LANE_Z, LANE_H, 6, 0.5),
  rails: [
    slab({ x: LANE.x, y: LANE.y - 4, w: 268, d: 4, r: 1 }, LANE_Z, LANE_H + 3, 4, 0.5),
    slab({ x: LANE.x, y: LANE.y + LANE.d, w: 268, d: 4, r: 1 }, LANE_Z, LANE_H + 3, 4, 0.5),
  ],
  slats: Array.from({ length: SLAT_COUNT }, (_, i) =>
    slab({ x: LANE.x + 4 + i * slatW, y: LANE.y + 2, w: slatW - 2.5, d: LANE.d - 4, r: 1 }, LANE_Z + LANE_H, 2, 3, 0.4),
  ),
  stop: slab({ x: LANE.x - 4, y: LANE.y - 1, w: 4, d: LANE.d + 2, r: 1 }, LANE_Z, LANE_H + 3, 2),
  motor: slab(MOTOR, 0, 22, 5, 0.8),
  motorLid: planOutline(insetPlan(MOTOR, 2), 22, P),
  motorScrews: [at([MOTOR.x + 4, MOTOR.y + 4, 22]), at([MOTOR.x + MOTOR.w - 4, MOTOR.y + MOTOR.d - 4, 22])],
  belt: slab({ x: MOTOR.x + MOTOR.w - 2, y: LANE.y + 9, w: 6, d: 12, r: 1 }, 2, 9, 2),
  crank: cyl(MOTOR.x + 11, MOTOR.y + 13, 4, 22, 5, 24),
  crankKnurl: knurl(MOTOR.x + 11, MOTOR.y + 13, 4, 22, 27, 18),
  flowA: onTop([[LANE.x + 10, LANE.y + 8], [CHAMBER_X - 8, LANE.y + 8]], LANE_Z + LANE_H + 2.5, P),
  flowB: onTop([[LANE.x + 10, LANE.y + LANE.d - 8], [CHAMBER_X - 8, LANE.y + LANE.d - 8]], LANE_Z + LANE_H + 2.5, P),
};

// ── Client hopper (active card built at slot, parked cards static) ──
export const HOPPER = { x0: -169, x1: -131, y0: -70, y1: -32 };

export const HOPPER_ART = {
  cheeks: [
    slab({ x: HOPPER.x0, y: HOPPER.y0, w: 6, d: 8, r: 1 }, 0, 40, 3),
    slab({ x: HOPPER.x1, y: HOPPER.y0, w: 6, d: 8, r: 1 }, 0, 40, 3),
  ],
  back: slab({ x: HOPPER.x0, y: HOPPER.y0, w: HOPPER.x1 - HOPPER.x0 + 6, d: 3, r: 1 }, 0, 40, 4, 0.5),
  shelf: slab({ x: HOPPER.x0, y: HOPPER.y0, w: HOPPER.x1 - HOPPER.x0 + 6, d: 38, r: 1 }, 0, 3, 4, 0.4),
  parked: [slab({ x: -163, y: -68, w: 26, d: 20, r: 1.5 }, 3, 2, 4, 0.4)],
};

export const CARD_HOME_X = -150;
export const CARD_Y = -61;
export const CARD_Z = LANE_Z + LANE_H;

export const cardPaths = () => {
  const plan: Plan = { x: 0, y: 0, w: CARD_W, d: CARD_D, r: 1.5 };
  return {
    body: slab(plan, 0, CARD_H, 4, 0.5),
    tab: slab({ x: 4, y: -1, w: 10, d: CARD_D + 1, r: 1 }, CARD_H - 4, 4, 2),
    faceText: topMatrix([9, 0.5], CARD_H, P, "x"),
  };
};

// ── Item blocks (built at origin, placed per frame) ──
export const blockPaths = () => ({
  body: slab({ x: 0, y: 0, w: BLOCK_W, d: BLOCK_D, r: 1.5 }, 0, 14, 4, 0.6),
  band: slab({ x: -0.5, y: -0.5, w: BLOCK_W + 1, d: BLOCK_D + 1, r: 1.5 }, 5, 2, 4),
  faceText: topMatrix([BLOCK_W / 2, BLOCK_D / 2], 14, P, "x"),
});
export const BLOCK_Y = -52;
export const BLOCK_Z = LANE_Z + LANE_H;
export const BLOCK_TARGETS = [-16, 2, 18];

// ── Assembly chamber ──
const LINTEL_Z = 36;
const postX = [CHAMBER_X - 8, CHAMBER_X + CHAMBER_W];
const postY = [CHAMBER_Y - 8, CHAMBER_Y + CHAMBER_D - 2];

export const CHAMBER_ART = {
  floor: slab({ x: CHAMBER_X - 6, y: CHAMBER_Y, w: CHAMBER_W + 12, d: CHAMBER_D, r: 2 }, 0, 6, 6, 0.5),
  frontWall: slab({ x: CHAMBER_X, y: CHAMBER_Y + CHAMBER_D - 4, w: CHAMBER_W, d: 4, r: 1 }, 6, WALL_H, 5, 0.5),
  backWall: slab({ x: CHAMBER_X, y: CHAMBER_Y, w: CHAMBER_W, d: 4, r: 1 }, 6, WALL_H, 5, 0.5),
  lintels: [CHAMBER_X - 6, CHAMBER_X + CHAMBER_W - 2].map((x) =>
    slab({ x, y: CHAMBER_Y, w: 8, d: CHAMBER_D, r: 1 }, LINTEL_Z, 6, 3),
  ),
  posts: postX.flatMap((x) => postY.map((y) => slab({ x, y, w: 8, d: 8, r: 1.5 }, 0, POST_H, 3, 0.5))),
  topBars: [postY[0], postY[1]].map((y) => slab({ x: postX[0], y, w: postX[1] - postX[0] + 8, d: 8, r: 1.5 }, POST_H, 6, 4, 0.5)),
  brush: join(
    [0, 1, 2].map((r) =>
      onTop(
        [[CHAMBER_X + 10, CHAMBER_Y + CHAMBER_D - 3.4 + r * 0.01], [CHAMBER_X + CHAMBER_W - 10, CHAMBER_Y + CHAMBER_D - 3.4 + r * 0.01]],
        6 + WALL_H,
        P,
      ),
    ),
  ),
  wallScrews: [at([CHAMBER_X + 8, CHAMBER_Y + CHAMBER_D - 2, 6 + WALL_H]), at([CHAMBER_X + CHAMBER_W - 8, CHAMBER_Y + CHAMBER_D - 2, 6 + WALL_H])],
};

// Press plate + corner rods (plate moves, rods static).
export const PRESS = { x: 32, w: 32, y: -56, d: 40, z: 38, h: 8 };
export const pressPaths = () => ({
  plate: slab({ x: PRESS.x, y: PRESS.y, w: PRESS.w, d: PRESS.d, r: 2 }, 0, PRESS.h, 5, 0.6),
  brush: join(
    [0, 1].map((r) => onTop([[PRESS.x + 6, PRESS.y + 12 + r * 16], [PRESS.x + PRESS.w - 6, PRESS.y + 12 + r * 16]], PRESS.h, P)),
  ),
  faceText: topMatrix([PRESS.x + PRESS.w / 2, PRESS.y + PRESS.d / 2], PRESS.h, P, "x"),
});
export const PRESS_RODS = [PRESS.x + 4, PRESS.x + PRESS.w - 4].flatMap((x) => [PRESS.y + 4, PRESS.y + PRESS.d - 4].map((y) => cyl(x, y, 2, 10, 54, 16)));
export const PRESS_COLLARS = [PRESS.x + 4, PRESS.x + PRESS.w - 4].flatMap((x) =>
  [PRESS.y + 4, PRESS.y + PRESS.d - 4].map((y) => cyl(x, y, 3.2, PRESS.h, 3, 16)),
);

// Chamber invoice sheet + per-stage rule groups.
export const CSHEET = { x: SHEET_X, y: SHEET_Y, w: SHEET_W, d: SHEET_D, z: 6, h: 2 };
export const CSHEET_ART = {
  sheet: slab({ x: CSHEET.x, y: CSHEET.y, w: CSHEET.w, d: CSHEET.d, r: 1.5 }, CSHEET.z, CSHEET.h, 5, 0.4),
  gClient: join(
    [0, 1].map((r) => onTop([[CSHEET.x + 8, CSHEET.y + 8 + r * 6], [CSHEET.x + 40, CSHEET.y + 8 + r * 6]], CSHEET.z + CSHEET.h, P)),
  ),
  gItems: join(
    [0, 1, 2].map((r) =>
      onTop([[CSHEET.x + 8, CSHEET.y + 22 + r * 5], [CSHEET.x + CSHEET.w - 14, CSHEET.y + 22 + r * 5]], CSHEET.z + CSHEET.h, P),
    ),
  ),
  gTotal: join([
    onTop([[CSHEET.x + 8, CSHEET.y + CSHEET.d - 8], [CSHEET.x + CSHEET.w - 8, CSHEET.y + CSHEET.d - 8]], CSHEET.z + CSHEET.h, P),
  ]),
  faceText: topMatrix([CSHEET.x + CSHEET.w / 2, CSHEET.y + CSHEET.d - 4], CSHEET.z + CSHEET.h, P, "x"),
};

// ── Tax dial ──
function dialTicks() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let s = 0; s < 12; s++) {
    const a = (s / 12) * Math.PI * 2;
    const big = s % 3 === 0;
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

export const DIAL_ART = {
  stand: slab({ x: DIAL_X - 24, y: DIAL_Y - 20, w: 48, d: 40, r: 3 }, 0, DIAL_Z, 4, 0.5),
  standScrews: [
    at([DIAL_X - 20, DIAL_Y - 16, DIAL_Z]),
    at([DIAL_X + 20, DIAL_Y - 16, DIAL_Z]),
    at([DIAL_X - 20, DIAL_Y + 16, DIAL_Z]),
    at([DIAL_X + 20, DIAL_Y + 16, DIAL_Z]),
  ],
  puck: cyl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z, DIAL_H, 56, 0.8),
  bezel: ring(DIAL_X, DIAL_Y, DIAL_R - 1, DIAL_Z + DIAL_H, P, 56),
  knurl: knurl(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, DIAL_Z + DIAL_H, 48),
  band: sideArc(DIAL_X, DIAL_Y, DIAL_R, DIAL_Z + DIAL_H - 3, 40),
  minor: DT.minor,
  major: DT.major,
  crown: slab({ x: DIAL_X + DIAL_R - 0.6, y: DIAL_Y - 2.4, w: 4.4, d: 4.8, r: 1.2 }, DIAL_Z + 2, 4, 3),
  lockBase: cyl(DIAL_X - DIAL_R - 8, DIAL_Y + 6, 3, DIAL_Z, 3, 16),
  lockPin: cyl(0, 0, 1.6, 0, 7, 12),
  faceText: topMatrix([DIAL_X - 10, DIAL_Y + DIAL_R - 6], DIAL_Z + DIAL_H, P, "x"),
};

export const dialNeedleAt = (angle: number) =>
  onTop(
    [
      [DIAL_X - Math.sin(angle) * 4, DIAL_Y + Math.cos(angle) * 4],
      [DIAL_X + Math.sin(angle) * (DIAL_R - 4), DIAL_Y - Math.cos(angle) * (DIAL_R - 4)],
    ],
    DIAL_Z + DIAL_H + 0.2,
    P,
  );
// Needle angle for a 0..18% rate across a 240° sweep.
export const needleAngleFor = (rate: number) => ((-120 + (rate / 18) * 240) * Math.PI) / 180;

// ── Gears (flat, rotate in screen space about projected center) ──
function toothRect(cx: number, cy: number, r: number, angle: number): Array<[number, number]> {
  const along: Array<[number, number]> = [
    [-1.7, r - 0.5],
    [1.7, r - 0.5],
    [1.7, r + 3.5],
    [-1.7, r + 3.5],
  ];
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return along.map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
}

export const gearPaths = (cx: number, cy: number, r: number, teeth: number, z: number, h: number) => ({
  disc: cyl(cx, cy, r, z, h, Math.max(28, teeth * 3)),
  teeth: Array.from({ length: teeth }, (_, i) => {
    const a = (i / teeth) * Math.PI * 2;
    return extrude(toothRect(cx, cy, r, a).map(([x, y]) => [x, y] as [number, number]), z, h, P, { convex: true });
  }),
  hub: cyl(cx, cy, Math.max(3, r * 0.28), z - 1, h + 2, 20),
  bolts: Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return at([cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, z + h]);
  }),
  seam: sideArc(cx, cy, r, z + 1, 36),
});
export const GEAR_Z = 2;
export const GEAR_H = 5;

// ── Printer: side frames, stacked rollers, hood ──
export const PRINTER_ART = {
  cheeks: [
    slab({ x: PRINT_X - 12, y: -70, w: 6, d: 40, r: 1 }, 0, 34, 3),
    slab({ x: PRINT_X + 6, y: -70, w: 6, d: 40, r: 1 }, 0, 34, 3),
  ],
  cheekScrews: [at([PRINT_X - 9, -32, 34]), at([PRINT_X + 9, -32, 34])],
  rollerLow: slab({ x: PRINT_X - 5, y: -64, w: 10, d: 28, r: 5 }, 2, 10, 12, 1),
  rollerHigh: slab({ x: PRINT_X - 5, y: -64, w: 10, d: 28, r: 5 }, 15, 10, 12, 1),
  rollerSeams: join([7, 20].map((z) => sideArc(PRINT_X, -50, 5, z, 20))),
  hood: slab({ x: PRINT_X - 12, y: -70, w: 24, d: 40, r: 2 }, 27, 4, 4, 0.5),
  hoodLine: planOutline(insetPlan({ x: PRINT_X - 12, y: -70, w: 24, d: 40, r: 2 }, 1.5), 31, P),
};

// ── Output tray on legs (deck flush with roller top) ──
export const TRAY_ART = {
  legs: [
    [TRAY.x + 4, TRAY.y + 4],
    [TRAY.x + TRAY.w - 4, TRAY.y + 4],
    [TRAY.x + 4, TRAY.y + TRAY.d - 4],
    [TRAY.x + TRAY.w - 4, TRAY.y + TRAY.d - 4],
  ].map(([x, y]) => slab({ x: x - 3, y: y - 3, w: 6, d: 6, r: 1 }, 0, 10, 2)),
  deck: slab({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: TRAY.d, r: 2 }, 10, 2, 5, 0.4),
  walls: [
    slab({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 3, r: 1 }, 12, TRAY_WALL, 4, 0.4),
    slab({ x: TRAY.x, y: TRAY.y + TRAY.d - 3, w: TRAY.w, d: 3, r: 1 }, 12, TRAY_WALL, 4, 0.4),
    slab({ x: TRAY.x, y: TRAY.y, w: 3, d: TRAY.d, r: 1 }, 12, TRAY_WALL, 3, 0.4),
    slab({ x: TRAY.x + TRAY.w - 3, y: TRAY.y, w: 3, d: TRAY.d, r: 1 }, 12, TRAY_WALL, 3, 0.4),
  ],
};

// Printed sheet rebuilt per frame as it grows out of the rollers.
export const SHEET_Z = 12;
export const psheetPaths = (leadX: number) => {
  const w = Math.max(2, leadX - (PRINT_X + 6));
  const plan: Plan = { x: PRINT_X + 6, y: PSHEET_Y, w, d: PSHEET_D, r: 1.5 };
  const top = SHEET_Z + 2;
  const maxX = PRINT_X + 6 + w;
  const rule = (y: number, from = PRINT_X + 12, to?: number) =>
    onTop([[from, y], [Math.min(to ?? maxX - 6, maxX - 4), y]], top, P);
  return {
    body: slab(plan, SHEET_Z, 2, 5, 0.4),
    rules:
      w < 16
        ? ""
        : join([rule(PSHEET_Y + 10), rule(PSHEET_Y + 18), rule(PSHEET_Y + 26), rule(PSHEET_Y + PSHEET_D - 8)]),
    headX: PRINT_X + 12,
    headY: PSHEET_Y + PSHEET_D - 4,
  };
};
export const psheetHeadTransform = () => topMatrix([PRINT_X + 12, PSHEET_Y + PSHEET_D - 4], SHEET_Z + 2, P, "x");
