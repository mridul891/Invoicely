import { fitProjection, iso, type Plan, type Point3, type Projection } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 330;

// Sorting desk: pigeonhole case at the back, rail + carriage in front,
// detent knob on the right. x/y on the floor, z up.
export const BASE: Plan = { x: -150, y: -80, w: 300, d: 160, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

// Case: outer shell holding 4 pigeonholes across x.
export const CASE: Plan = { x: -128, y: -62, w: 216, d: 44, r: 2 };
export const CASE_Z = 0;
export const CASE_H = 44;
export const HOLE_W = 50;
export const HOLE_GAP = 4;

// Rail the filing carriage rides on, in front of the case.
export const RAIL: Plan = { x: -128, y: 6, w: 216, d: 8, r: 2 };
export const RAIL_Z = 0;
export const RAIL_H = 5;

// Detent knob station (right).
export const KNOB_X = 116;
export const KNOB_Y = 34;
export const KNOB_R = 9;
export const KNOB_Z = 0;
export const KNOB_H = 8;

export const holeX = (i: number) => CASE.x + 6 + i * (HOLE_W + HOLE_GAP);

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [CASE.x, CASE.y, CASE_H + 26],
    [KNOB_X, KNOB_Y, KNOB_H + 26],
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
