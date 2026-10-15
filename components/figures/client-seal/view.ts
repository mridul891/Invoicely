import { fitProjection, iso, type Plan, type Point3, type Projection } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 340;

// Seal press: client card rack at back-left, invoice bed front-center,
// seal post + arm right, selector knob front-left.
export const BASE: Plan = { x: -150, y: -84, w: 300, d: 168, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

// Card rack (open front): back panel, sides, dividers, shelf.
export const RACK_X = -130;
export const RACK_W = 100;
export const RACK_BACK_Y = -64;
export const RACK_FRONT_Y = -20;
export const RACK_H = 44;
export const SHELF_Z = 0;
export const SHELF_H = 3;
export const CARD_W = 26;
export const CARD_D = 4;
export const CARD_H = 30;
export const CARD_Z = SHELF_Z + SHELF_H;
export const CARD_HOME_Y = -58;
export const CARD_OUT_Y = -6;
export const slotCenterX = (i: number) => RACK_X + 6 + 15 + i * 30;

// Invoice bed + sheet.
export const BED: Plan = { x: -60, y: -22, w: 124, d: 60, r: 2 };
export const BED_Z = 0;
export const BED_H = 5;
export const SHEET: Plan = { x: -54, y: -18, w: 112, d: 52, r: 1.5 };
export const SHEET_Z = BED_Z + BED_H;
export const SHEET_H = 2;

// Reading rail the pulled card slides into.
export const READER: Plan = { x: -126, y: -10, w: 92, d: 7, r: 1.5 };

// Seal press (right of sheet).
export const POST: Plan = { x: 86, y: 2, w: 12, d: 12, r: 2 };
export const POST_H = 56;
export const ARM: Plan = { x: 30, y: 2, w: 68, d: 10, r: 2 };
export const ARM_Z = 34;
export const ARM_H = 8;
export const HEAD: Plan = { x: 24, y: -3, w: 20, d: 20, r: 2 };
export const HEAD_Z = 18;
export const HEAD_H = 8;
export const HEAD_TRAVEL = 8;

// Selector knob (front-left).
export const KNOB_X = -110;
export const KNOB_Y = 48;
export const KNOB_R = 9;
export const KNOB_Z = 0;
export const KNOB_H = 7;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [RACK_X, RACK_BACK_Y, RACK_H + 8],
    [POST.x, POST.y, POST_H + 8],
    [KNOB_X, KNOB_Y, KNOB_H + 20],
  ],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 57 },
);

function boxCorners(plan: Plan, z0: number, z1: number): Point3[] {
  const out: Point3[] = [];
  for (const px of [plan.x, plan.x + plan.w])
    for (const py of [plan.y, plan.y + plan.d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}

export const at = (p: Point3) => iso(p, P);
const ORIGIN = at([0, 0, 0]);
const sub = (a: [number, number], b: [number, number]): [number, number] => [a[0] - b[0], a[1] - b[1]];

const fine = (v: number) => Math.round(v * 100) / 100;
export const shift = (x = 0, y = 0, z = 0) => {
  const o = at([x, y, z]);
  const d = sub(o, ORIGIN);
  return `translate(${fine(d[0])} ${fine(d[1])})`;
};
