import * as React from "react";
import { Dots, FaceText, Line, Solid } from "@/components/iso/react/draw";
import { CLIENT, ITEMS } from "./model";
import {
  BASE_ART,
  CHAMBER_ART,
  CSHEET_ART,
  DIAL_ART,
  HOPPER_ART,
  LANE_ART,
  PRESS_COLLARS,
  PRESS_RODS,
  PRINTER_ART,
  TRAY_ART,
  blockPaths,
  cardPaths,
  dialNeedleAt,
  gearPaths,
  needleAngleFor,
  pressPaths,
  psheetHeadTransform,
  psheetPaths,
} from "./geometry";
import { GEAR_A, GEAR_B } from "./view";
import { GEAR_H, GEAR_Z } from "./geometry";

export function MachineArt() {
  const base = (
    <g key="base">
      <path className="iso-halo" d={BASE_ART.halo} />
      {BASE_ART.feet.map((pair, i) => (
        <React.Fragment key={i}>
          <Solid paths={pair[0]!} tone="lo" />
          <Solid paths={pair[1]!} tone="mid" />
        </React.Fragment>
      ))}
      <Solid paths={BASE_ART.slab} tone="mid" inner={<Line d={BASE_ART.groove} tone="faint" />} />
      <Line d={BASE_ART.screwRings} tone="lo" />
      <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
      <Solid paths={BASE_ART.strip} tone="lo" flat inner={<><Line d={BASE_ART.stripTicks.minor} tone="lo" /><Line d={BASE_ART.stripTicks.major} tone="mid" /></>} />
      <Solid
        paths={BASE_ART.label}
        tone="mid"
        inner={
          <>
            <Line d={BASE_ART.labelLine} tone="faint" />
            <Line d={BASE_ART.labelRules} tone="lo" free />
          </>
        }
      >
        <Dots points={BASE_ART.labelScrews} size={0.45} tone="mid" />
      </Solid>
    </g>
  );

  const hopper = (
    <g key="hopper">
      <Solid paths={HOPPER_ART.shelf} tone="lo" />
      <Solid paths={HOPPER_ART.back} tone="lo" />
      {HOPPER_ART.cheeks.map((c, i) => (
        <Solid key={i} paths={c} tone="mid" />
      ))}
      {HOPPER_ART.parked.map((p, i) => (
        <Solid key={i} paths={p} tone="mid" />
      ))}
    </g>
  );

  const lane = (
    <g key="lane">
      <Solid paths={LANE_ART.bed} tone="mid" />
      {LANE_ART.slats.map((s, i) => (
        <Solid key={i} paths={s} tone={i % 2 ? "mid" : "lo"} />
      ))}
      {LANE_ART.rails.map((r, i) => (
        <Solid key={`r${i}`} paths={r} tone="mid" />
      ))}
      <Solid paths={LANE_ART.stop} tone="mid" />
      <Solid paths={LANE_ART.motor} tone="mid" inner={<Line d={LANE_ART.motorLid} tone="faint" />}>
        <Dots points={LANE_ART.motorScrews} size={0.45} tone="mid" />
      </Solid>
      <Solid paths={LANE_ART.belt} tone="lo" />
      <Solid paths={LANE_ART.crank} tone="mid" inner={<Line d={LANE_ART.crankKnurl} tone="lo" />} />
    </g>
  );

  const chamber = (
    <g key="chamber">
      <Solid paths={CHAMBER_ART.floor} tone="mid" />
      <Solid paths={CHAMBER_ART.backWall} tone="lo" />
      <Solid paths={CHAMBER_ART.frontWall} tone="mid" inner={<><Line d={CHAMBER_ART.brush} tone="faint" /><Dots points={CHAMBER_ART.wallScrews} size={0.45} tone="mid" /></>} />
      {CHAMBER_ART.lintels.map((l, i) => (
        <Solid key={i} paths={l} tone="mid" />
      ))}
      {CHAMBER_ART.posts.map((p, i) => (
        <Solid key={i} paths={p} tone="mid" />
      ))}
      {CHAMBER_ART.topBars.map((b, i) => (
        <Solid key={i} paths={b} tone="mid" />
      ))}
    </g>
  );

  const dialStatic = (
    <g key="dial-static">
      <Solid paths={DIAL_ART.stand} tone="mid">
        <Dots points={DIAL_ART.standScrews} size={0.45} tone="mid" />
      </Solid>
      <Solid
        paths={DIAL_ART.puck}
        tone="hi"
        inner={
          <>
            <Line d={DIAL_ART.band} tone="faint" />
            <Line d={DIAL_ART.knurl} tone="lo" />
            <Line d={DIAL_ART.minor} tone="lo" />
            <Line d={DIAL_ART.major} tone="mid" />
          </>
        }
      >
        <FaceText transform={DIAL_ART.faceText} size={3.4} tone="mid" anchor="middle">
          TAX %
        </FaceText>
      </Solid>
      <Line d={DIAL_ART.bezel} tone="lo" />
      <Solid paths={DIAL_ART.crown} tone="mid" />
      <Solid paths={DIAL_ART.lockBase} tone="mid" />
    </g>
  );

  const printer = (
    <g key="printer">
      {PRINTER_ART.cheeks.map((c, i) => (
        <Solid key={i} paths={c} tone="mid" />
      ))}
      <Dots points={PRINTER_ART.cheekScrews} size={0.45} tone="mid" />
      <Solid paths={PRINTER_ART.rollerLow} tone="mid" inner={<Line d={PRINTER_ART.rollerSeams} tone="faint" />} />
      <Solid paths={PRINTER_ART.rollerHigh} tone="mid" />
      <Solid paths={PRINTER_ART.hood} tone="mid" inner={<Line d={PRINTER_ART.hoodLine} tone="faint" />} />
    </g>
  );

  const tray = (
    <g key="tray">
      {TRAY_ART.legs.map((l, i) => (
        <Solid key={i} paths={l} tone="lo" />
      ))}
      <Solid paths={TRAY_ART.deck} tone="mid" />
      {TRAY_ART.walls.map((w, i) => (
        <Solid key={i} paths={w} tone="mid" />
      ))}
    </g>
  );

  return { base, hopper, lane, chamber, dialStatic, printer, tray };
}

export function GearArt({ which }: { which: "a" | "b" }) {
  const G = which === "a" ? GEAR_A : GEAR_B;
  const g = gearPaths(G.x, G.y, G.r, G.teeth, GEAR_Z, GEAR_H);
  return (
    <g key={`gear-${which}`}>
      {g.teeth.map((t, i) => (
        <Solid key={i} paths={t} tone="mid" />
      ))}
      <Solid paths={g.disc} tone="hi" inner={<Line d={g.seam} tone="faint" />}>
        <Dots points={g.bolts} size={0.45} tone="mid" />
      </Solid>
      <Solid paths={g.hub} tone="mid" />
    </g>
  );
}

export function CardArt() {
  const g = cardPaths();
  return (
    <g key="job-card">
      <Solid paths={g.body} tone="hi" lit>
        <FaceText transform={g.faceText} size={3.4} tone="hi" anchor="middle">
          {CLIENT.init}
        </FaceText>
      </Solid>
      <Solid paths={g.tab} tone="mid" />
    </g>
  );
}

export function BlockArt({ index }: { index: number }) {
  const g = blockPaths();
  return (
    <g key={`block-${index}`}>
      <Solid paths={g.body} tone="hi" />
      <Solid paths={g.band} tone="mid" />
      <FaceText transform={g.faceText} size={3.4} tone="mid" anchor="middle">
        {`$${ITEMS[index]!.amount.toLocaleString()}`}
      </FaceText>
    </g>
  );
}

export function ChamberSheetArt() {
  return (
    <g key="chamber-sheet">
      <Solid paths={CSHEET_ART.sheet} tone="hi" lit>
        <FaceText transform={CSHEET_ART.faceText} size={3.4} tone="hi" anchor="middle">
          {`${CLIENT.init} · $3,916`}
        </FaceText>
      </Solid>
    </g>
  );
}

export function ChamberRulesArt() {
  return {
    gClient: (
      <g key="rules-client">
        <Line d={CSHEET_ART.gClient} tone="mid" />
      </g>
    ),
    gItems: (
      <g key="rules-items">
        <Line d={CSHEET_ART.gItems} tone="mid" />
      </g>
    ),
    gTotal: (
      <g key="rules-total">
        <Line d={CSHEET_ART.gTotal} tone="hi" />
      </g>
    ),
  };
}

export function PinArt() {
  return (
    <g key="lock-pin">
      <Solid paths={DIAL_ART.lockPin} tone="hi" />
    </g>
  );
}

export function PressArt() {
  const g = pressPaths();
  return (
    <g key="press">
      {PRESS_COLLARS.map((c, i) => (
        <Solid key={i} paths={c} tone="mid" />
      ))}
      <Solid paths={g.plate} tone="mid" inner={<Line d={g.brush} tone="faint" />}>
        <FaceText transform={g.faceText} size={4} tone="mid" anchor="middle">
          FORM
        </FaceText>
      </Solid>
    </g>
  );
}

export function PressRodsArt() {
  return (
    <g key="press-rods">
      {PRESS_RODS.map((r, i) => (
        <Solid key={i} paths={r} tone="mid" />
      ))}
    </g>
  );
}

export function PrintedSheetRest() {
  const g = psheetPaths(110);
  return (
    <g key="psheet-rest">
      <Solid paths={g.body} tone="hi" lit />
    </g>
  );
}

export function PrintedHeadText() {
  return (
    <FaceText transform={psheetHeadTransform()} size={3.6} tone="hi" anchor="start">
      INV-2026-0042
    </FaceText>
  );
}

export { dialNeedleAt, needleAngleFor };
