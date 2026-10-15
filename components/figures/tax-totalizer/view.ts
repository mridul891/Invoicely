import { fitProjection, iso, type Plan, type Point3, type Projection } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 330;

// Totalizer: two share bars (client / tax) left of a rate dial + crank right.
export const BASE: Plan = { x: -150, y: -80, w: 300, d: 160, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

// Bars stand on a plinth; heights rebuilt per frame from the model.
export const PLINTH: Plan = { x: -132, y: -56, w: 140, d: 56, r: 2 };
export const PLINTH_Z = 0;
export const PLINTH_H = 4;
export const SUB_X = -120;
export const TAX_X = -66;
export const BAR_W = 42;
export const BAR_D = 40;

// Rate dial + crank station.
export const DIAL_X = 84;
export const DIAL_Y = -8;
export const DIAL_R = 20;
export const DIAL_Z = 0;
export const DIAL_H = 9;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [SUB_X, -56, PLINTH_H + 30],
    [DIAL_X, DIAL_Y, DIAL_Z + DIAL_H + 24],
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
