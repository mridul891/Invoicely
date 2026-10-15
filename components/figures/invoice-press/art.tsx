import * as React from "react";
import { Dots, FaceText, Line, Solid } from "@/components/iso/react/draw";
import { BASE_ART, BED_ART, BOX_ART, DRAWER_ART, GANTRY_ART, HEAD_ART } from "./geometry";

export function PressArt() {
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
      <Solid paths={BASE_ART.strip} tone="lo" flat />
      <Line d={BASE_ART.ticksMinor} tone="lo" />
      <Line d={BASE_ART.ticksMajor} tone="mid" />
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

  const bed = (
    <g key="bed">
      <Solid paths={BED_ART.bed} tone="mid" inner={<Line d={BED_ART.bedSeam} tone="faint" />} />
      {BED_ART.stops.map((s, i) => (
        <Solid key={i} paths={s} tone="mid" />
      ))}
    </g>
  );

  const card = (
    <g key="card">
      <Solid
        paths={BED_ART.card}
        tone="hi"
        lit
        inner={
          <>
            <Line d={BED_ART.rules} tone="mid" free />
            <Line d={BED_ART.amounts} tone="lo" free />
          </>
        }
      >
        <FaceText transform={BED_ART.faceText} size={4} tone="mid">
          INV-0042 · $3,916
        </FaceText>
      </Solid>
    </g>
  );

  const gantry = (
    <g key="gantry">
      {GANTRY_ART.feet.map((f, i) => (
        <Solid key={i} paths={f} tone="lo" />
      ))}
      {GANTRY_ART.posts.map((p, i) => (
        <Solid key={i} paths={p} tone="mid" />
      ))}
      <Line d={GANTRY_ART.postSeams} tone="faint" />
      {GANTRY_ART.collars.map((c, i) => (
        <Solid key={i} paths={c} tone="mid" />
      ))}
      <Solid
        paths={GANTRY_ART.bar}
        tone="mid"
        inner={
          <>
            <Dots points={GANTRY_ART.barScrews} size={0.5} tone="mid" />
          </>
        }
      />
      <Line d={GANTRY_ART.railLine} tone="faint" />
      <Solid paths={GANTRY_ART.rod} tone="mid" />
      <Solid paths={GANTRY_ART.knob} tone="mid" inner={<Line d={GANTRY_ART.knurl} tone="lo" />} />
      <Line d={GANTRY_ART.pointer} tone="hi" />
    </g>
  );

  const box = (
    <g key="box">
      <Solid paths={BOX_ART.box} tone="mid" inner={<Line d={BOX_ART.seam} tone="faint" />} />
      <Solid paths={BOX_ART.slot} tone="lo" flat />
      <Solid paths={BOX_ART.drawerFront} tone="mid" />
      <Solid paths={BOX_ART.pull} tone="mid" />
      <Dots points={BOX_ART.drawerScrews} size={0.45} tone="mid" />
      {BOX_ART.coins.map((c, i) => (
        <Solid key={i} paths={c} tone="hi" />
      ))}
      <Solid paths={BOX_ART.dialStand} tone="mid" />
      <Solid
        paths={BOX_ART.puck}
        tone="hi"
        inner={
          <>
            <Line d={BOX_ART.dialBand} tone="faint" />
            <Line d={BOX_ART.dialKnurl} tone="lo" />
            <Line d={BOX_ART.dialMinor} tone="lo" />
            <Line d={BOX_ART.dialMajor} tone="mid" />
          </>
        }
      />
      <Line d={BOX_ART.bezel} tone="lo" />
      <Solid paths={BOX_ART.crown} tone="mid" />
      <Solid paths={BOX_ART.lug} tone="mid" />
    </g>
  );

  return { base, bed, card, gantry, box };
}

export function HeadArt() {
  return (
    <g key="head">
      <Solid paths={HEAD_ART.head} tone="mid" />
      <Solid paths={HEAD_ART.face} tone="hi" lit>
        <FaceText transform={HEAD_ART.stampText} size={4.5} tone="hi" anchor="middle">
          PAID
        </FaceText>
      </Solid>
    </g>
  );
}

export function CoinArt() {
  return (
    <g key="coin">
      <Solid paths={BOX_ART.coin} tone="hi" lit inner={<Line d={BOX_ART.coinFace} tone="mid" />} />
    </g>
  );
}
