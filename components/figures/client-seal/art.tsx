import * as React from "react";
import { Dots, FaceText, Line, Solid } from "@/components/iso/react/draw";
import { CLIENTS } from "./model";
import {
  BASE_ART,
  BED_ART,
  IMPRINT,
  KNOB_ART,
  RACK_ART,
  SEAL_ART,
  cardAt,
} from "./geometry";

export function SealArt() {
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

  const rack = (
    <g key="rack">
      <Solid paths={RACK_ART.shelf} tone="lo" flat inner={<Line d={RACK_ART.shelfLine} tone="faint" />} />
      <Solid paths={RACK_ART.back} tone="lo" />
      <Solid paths={RACK_ART.left} tone="mid" />
      <Solid paths={RACK_ART.right} tone="mid" />
      {RACK_ART.dividers.map((d, i) => (
        <Solid key={i} paths={d} tone="mid" />
      ))}
      <Dots points={RACK_ART.screws} size={0.45} tone="mid" />
      <Solid paths={RACK_ART.reader} tone="mid" inner={<Line d={RACK_ART.readerGroove} tone="faint" />} />
    </g>
  );

  const bed = (
    <g key="bed">
      <Solid paths={BED_ART.bed} tone="mid" inner={<Line d={BED_ART.bedSeam} tone="faint" />} />
      <Solid
        paths={BED_ART.sheet}
        tone="hi"
        inner={
          <>
            <Line d={BED_ART.headerRules} tone="mid" free />
            <Line d={BED_ART.clientRule} tone="lo" free />
            <Line d={BED_ART.itemRules} tone="lo" free />
          </>
        }
      />
      <Solid paths={BED_ART.upi} tone="hi" lit>
        <FaceText transform={BED_ART.upiText} size={3.2} tone="hi" anchor="middle">
          acme@upi
        </FaceText>
      </Solid>
      <Solid paths={BED_ART.bank} tone="mid">
        <FaceText transform={BED_ART.bankText} size={3.2} tone="mid" anchor="middle">
          HDFC ····4821
        </FaceText>
      </Solid>
    </g>
  );

  const sealStatic = (
    <g key="seal-static">
      <Solid paths={SEAL_ART.post} tone="mid" />
      <Solid paths={SEAL_ART.collar} tone="mid" />
      <Solid paths={SEAL_ART.arm} tone="mid">
        <Dots points={SEAL_ART.armScrews} size={0.45} tone="mid" />
      </Solid>
    </g>
  );

  const knob = (
    <g key="knob">
      <Solid paths={KNOB_ART.plate} tone="lo" />
      <Solid paths={KNOB_ART.knob} tone="mid" inner={<Line d={KNOB_ART.knurl} tone="lo" />} />
      <Line d={KNOB_ART.detents} tone="mid" />
    </g>
  );

  return { base, rack, bed, sealStatic, knob };
}

export function CardArt({ index }: { index: number }) {
  const g = cardAt(index);
  const c = CLIENTS[index]!;
  return (
    <g key={`card-${index}`}>
      <Solid paths={g.body} tone="hi" inner={<Line d={""} tone="lo" />}>
        <FaceText transform={g.faceText} size={3} tone="mid" anchor="middle">
          {c.init}
        </FaceText>
      </Solid>
      <Solid paths={g.tab} tone="mid" />
    </g>
  );
}

export function SealHeadArt() {
  return (
    <g key="seal-head">
      <Solid paths={SEAL_ART.rod} tone="mid" />
      <Solid paths={SEAL_ART.head} tone="mid" />
      <Solid paths={SEAL_ART.face} tone="hi" lit>
        <FaceText transform={SEAL_ART.faceText} size={3.4} tone="hi" anchor="middle">
          SEAL
        </FaceText>
      </Solid>
    </g>
  );
}

export function ImprintArt() {
  return (
    <g key="imprint" className="seal-imprint">
      <Line d={IMPRINT.box} tone="hi" />
      <FaceText transform={IMPRINT.text} size={3.4} tone="hi" anchor="middle">
        GSTIN SEALED
      </FaceText>
    </g>
  );
}
