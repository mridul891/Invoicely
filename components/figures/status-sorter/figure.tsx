import { Plate } from "@/components/iso/react/draw";
import { CarriageArt, EnvelopeArt, SorterArt } from "./art";
import { SorterLive } from "./live";
import "./status-sorter.css";

export function SorterFigure() {
  const art = SorterArt();
  return (
    <Plate
      fig="Fig 2"
      title="the status sorter"
      hint="← → files · Space advances"
      readout="DRAFT · 2 invoices · $3,180.00"
      keys={[
        { label: "active invoice", mark: "lit" },
        { label: "pigeonholes", mark: "raised" },
        { label: "base", mark: "dim" },
      ]}
      caption="A sorting desk for payment status. The carriage files each invoice down the rail — draft, sent, paid, overdue — and the knob counts off the pigeonholes. Fifteen of sixteen billed invoices are paid: about 94% on time."
    >
      <SorterLive
        label="Isometric sorting desk with four pigeonholes for draft, sent, paid and overdue invoices and a filing carriage"
        base={art.base}
        kase={art.kase}
        rail={art.rail}
        knob={art.knob}
        envelopes={[
          <EnvelopeArt key={0} index={0} label="DRAFT" />,
          <EnvelopeArt key={1} index={1} label="SENT" />,
          <EnvelopeArt key={2} index={2} label="PAID ×15" />,
          <EnvelopeArt key={3} index={3} label="LATE" />,
        ]}
        carriage={<CarriageArt />}
      />
    </Plate>
  );
}
