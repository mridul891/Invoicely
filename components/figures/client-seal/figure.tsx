import { Plate } from "@/components/iso/react/draw";
import { CardArt, ImprintArt, SealArt, SealHeadArt } from "./art";
import { SealLive } from "./live";
import "./client-seal.css";

export function SealFigure() {
  const art = SealArt();
  return (
    <Plate
      fig="Fig 4"
      title="the client seal"
      hint="← → picks card · Space stamps"
      readout="SEALED · Acme Studio · 12 invoices · 22AAAAA0000A1Z5"
      keys={[
        { label: "pulled client card", mark: "lit" },
        { label: "seal + rack", mark: "raised" },
        { label: "base", mark: "dim" },
      ]}
      caption="A seal press for setup-once billing. The knob pulls a client card out of the index — 12, 8, 5 invoices each — and the business seal falls to imprint the GSTIN header and payment chips on every invoice."
    >
      <SealLive
        label="Isometric seal press with a three-card client index, an invoice sheet and a GSTIN seal"
        base={art.base}
        rack={art.rack}
        bed={art.bed}
        sealStatic={art.sealStatic}
        knob={art.knob}
        cards={[<CardArt key={0} index={0} />, <CardArt key={1} index={1} />, <CardArt key={2} index={2} />]}
        sealHead={<SealHeadArt />}
        imprint={<ImprintArt />}
      />
    </Plate>
  );
}
