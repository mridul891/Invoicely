import { fitProjection, iso, type Plan, type Point3, type Projection } from "@/components/iso/iso-kit";

export const WIDTH = 680;
export const HEIGHT = 400;

// The Invoice Machine: client hopper (left) → item conveyor (back lane)
// → assembly chamber (center) → tax dial (front) → printer + tray (right).
export const BASE: Plan = { x: -196, y: -102, w: 392, d: 204, r: 10 };
export const BASE_H = 9;
export const FOOT_H = 5;

// Back lane conveyor (cards + item blocks ride +x through the chamber).
export const LANE: Plan = { x: -168, y: -66, w: 268, d: 30, r: 2 };
export const LANE_Z = 0;
export const LANE_H = 6;
export const SLAT_COUNT = 16;

// Client hopper above lane start.
export const HOPPER_X = -150;
export const HOPPER_Y = -51;
export const CARD_W = 30;
export const CARD_D = 5;
export const CARD_H = 26;

// Item blocks staged on the lane.
export const BLOCK_X = [-104, -76, -48];
export const BLOCK_W = 20;
export const BLOCK_D = 16;

// Assembly chamber (lane passes through it).
export const CHAMBER_X = -24;
export const CHAMBER_W = 100;
export const CHAMBER_Y = -70;
export const CHAMBER_D = 64;
export const FLOOR_H = 4;
export const WALL_H = 14;
export const POST_H = 58;
export const PRESS_TRAVEL = 20;

// Chamber invoice sheet (gains lines per stage).
export const SHEET_X = -8;
export const SHEET_Y = -58;
export const SHEET_W = 68;
export const SHEET_D = 44;

// Tax dial (front-center).
export const DIAL_X = 26;
export const DIAL_Y = 42;
export const DIAL_R = 20;
export const DIAL_Z = 2;
export const DIAL_H = 9;

// Gears driving the printer (front-right).
export const GEAR_A = { x: 108, y: 44, r: 14, teeth: 14 };
export const GEAR_B = { x: 136, y: 50, r: 10, teeth: 10 };

// Printer rollers + output tray (right).
export const PRINT_X = 96;
export const TRAY: Plan = { x: 122, y: -72, w: 62, d: 66, r: 3 };
export const TRAY_Z = 0;
export const TRAY_WALL = 6;

// Printed sheet path: rest (hidden under cover) → tray.
export const SHEET_REST_X = 78;
export const SHEET_DONE_X = 128;
export const PSHEET_Y = -62;
export const PSHEET_W = 52;
export const PSHEET_D = 46;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [HOPPER_X, HOPPER_Y, 66],
    [CHAMBER_X, CHAMBER_Y, POST_H + 16],
    [DIAL_X, DIAL_Y, DIAL_H + 30],
    [TRAY.x, TRAY.y, 40],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 57 },
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
export const placeAt = (p: Point3) => {
  const o = at(p);
  const d = sub(o, ORIGIN);
  return `translate(${fine(d[0])} ${fine(d[1])})`;
};
