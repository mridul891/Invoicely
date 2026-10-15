import * as React from "react";
import { Dots, FaceText, Line, Solid } from "@/components/iso/react/draw";
import { STATUSES } from "./model";
import { BASE_ART, CARRIAGE, CASE_ART, KNOB_ART, RAIL_ART, carriageAt, envelopeAt } from "./geometry";

export function SorterArt() {
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

  const kase = (
    <g key="case">
      <Solid paths={CASE_ART.floor} tone="mid" />
      {CASE_ART.dividers.map((d, i) => (
        <Solid key={i} paths={d} tone="mid" />
      ))}
      <Solid paths={CASE_ART.back} tone="lo" />
      <Solid paths={CASE_ART.left} tone="mid" />
      <Solid paths={CASE_ART.right} tone="mid" />
      <Solid paths={CASE_ART.shelf} tone="lo" flat inner={<Line d={CASE_ART.shelfLine} tone="faint" />} />
      <Solid paths={CASE_ART.roof} tone="mid">
        <Dots points={CASE_ART.screws} size={0.45} tone="mid" />
      </Solid>
    </g>
  );

  const rail = (
    <g key="rail">
      <Solid paths={RAIL_ART.rail} tone="mid" inner={<Line d={RAIL_ART.ruleMinor} tone="lo" />} />
      {RAIL_ART.stops.map((s, i) => (
        <Solid key={i} paths={s} tone="mid" />
      ))}
    </g>
  );

  const knob = (
    <g key="knob">
      <Solid paths={KNOB_ART.plate} tone="lo" />
      <Solid paths={KNOB_ART.knob} tone="mid" inner={<Line d={KNOB_ART.knurl} tone="lo" />} />
      <Line d={KNOB_ART.detents} tone="mid" />
    </g>
  );

  return { base, kase, rail, knob };
}

export function EnvelopeArt({ index, label }: { index: number; label: string }) {
  const g = envelopeAt(index);
  return (
    <g key={`env-${index}`}>
      <Solid paths={g.body} tone="hi" inner={<Line d={g.flap} tone="mid" />}>
        <FaceText transform={g.faceText} size={4} tone="mid">
          {label}
        </FaceText>
      </Solid>
    </g>
  );
}

export function CarriageArt() {
  const c = carriageAt();
  void CARRIAGE;
  return (
    <g key="carriage">
      <Solid paths={c.block} tone="mid">
        <Dots points={c.screws} size={0.45} tone="mid" />
      </Solid>
      <Solid paths={c.finger} tone="hi" />
      <Line d={c.fingerTip} tone="hi" />
    </g>
  );
}

export { STATUSES };
