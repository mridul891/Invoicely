import * as React from "react";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { BAR_FULL } from "./model";
import { BARS_ART, BASE_ART, DIAL_ART, SUB_X, TAX_X, barPaths } from "./geometry";
import { PLINTH_H, PLINTH_Z } from "./view";

export function TotalizerArt() {
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

  const bars = (
    <g key="bars">
      <Solid paths={BARS_ART.plinth} tone="mid" inner={<Line d={BARS_ART.plinthSeam} tone="faint" />} />
      <Solid paths={BARS_ART.panel} tone="mid" inner={<><Line d={BARS_ART.panelTicks} tone="lo" /><Line d={BARS_ART.zero} tone="hi" /></>} />
    </g>
  );

  const dial = (
    <g key="dial">
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
      />
      <Line d={DIAL_ART.bezel} tone="lo" />
      <Solid paths={DIAL_ART.crank} tone="mid" />
      <Solid paths={DIAL_ART.crankKnob} tone="mid" inner={<Line d={DIAL_ART.crankKnurl} tone="lo" />} />
    </g>
  );

  return { base, bars, dial };
}

// Rest pose for the two share bars (10% → sub 20, tax 2 of 22).
export function BarsRest() {
  const sub = barPaths(SUB_X, (BAR_FULL * 100) / 110);
  const tax = barPaths(TAX_X, (BAR_FULL * 10) / 110);
  void PLINTH_H;
  void PLINTH_Z;
  return (
    <g key="bars-rest">
      <Solid paths={sub} tone="hi" lit />
      <Solid paths={tax} tone="hi" />
    </g>
  );
}
