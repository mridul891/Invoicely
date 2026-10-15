import { fitProjection, iso, type Plan, type Point3, type Projection } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 360;

// World layout: x/y on the floor, z up. 1 unit ≈ 1px of the real thing.
export const BASE: Plan = { x: -150, y: -84, w: 300, d: 168, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

// Invoice bed (left): the carriage the paper sits on.
export const BED: Plan = { x: -128, y: -58, w: 150, d: 96, r: 4 };
export const BED_Z = 0;
export const BED_H = 6;

// Invoice card (the one lit subject).
export const CARD: Plan = { x: -118, y: -48, w: 130, d: 76, r: 3 };
export const CARD_Z = BED_Z + BED_H;
export const CARD_H = 4;

// Stamp gantry (middle): two posts + top bar + press head.
export const POST_L: Plan = { x: 34, y: -52, w: 12, d: 12, r: 2 };
export const POST_R: Plan = { x: 34, y: 28, w: 12, d: 12, r: 2 };
export const POST_H = 56;
export const BAR: Plan = { x: 28, y: -58, w: 24, d: 116, r: 3 };
export const BAR_Z = POST_H;
export const BAR_H = 10;
export const HEAD: Plan = { x: 30, y: -34, w: 20, d: 48, r: 2 };
export const HEAD_TRAVEL = 22; // how far the stamp drops

// Cash box (right): coin slot, drawer, dial on top.
export const BOX: Plan = { x: 66, y: -48, w: 64, d: 84, r: 4 };
export const BOX_Z = 0;
export const BOX_H = 30;
export const DRAWER: Plan = { x: 66, y: -40, w: 8, d: 68, r: 2 };
export const DIAL_X = 98;
export const DIAL_Y = -6;
export const DIAL_R = 16;
export const DIAL_Z = BOX_H;
export const DIAL_H = 9;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [POST_L.x, POST_L.y, POST_H + BAR_H + 18],
    [DIAL_X, DIAL_Y, DIAL_Z + DIAL_H + 22],
    [66, -48, 64], // coin apex
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
export const EX = sub(at([1, 0, 0]), ORIGIN);
export const EZ = sub(at([0, 0, 1]), ORIGIN);

const fine = (v: number) => Math.round(v * 100) / 100;
export const shift = (x = 0, y = 0, z = 0) => {
  const o = at([x, y, z]);
  const d = sub(o, ORIGIN);
  return `translate(${fine(d[0])} ${fine(d[1])})`;
};
// Move along world x only (carriage nudge / stamp is z).
export const shiftZ = (z: number) => {
  const dx = EZ[0] * z;
  const dy = EZ[1] * z;
  return `translate(${fine(dx)} ${fine(dy)})`;
};
