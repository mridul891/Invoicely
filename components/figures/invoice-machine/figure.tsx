import { Plate } from "@/components/iso/react/draw";
import {
  BlockArt,
  CardArt,
  ChamberRulesArt,
  ChamberSheetArt,
  GearArt,
  MachineArt,
  PinArt,
  PressArt,
  PressRodsArt,
} from "./art";
import { InvoiceMachineLive } from "./live";
import "./invoice-machine.css";

export function InvoiceMachineFigure() {
  const art = MachineArt();
  const rules = ChamberRulesArt();
  return (
    <div className="imachine">
      <Plate
        fig="Hero"
        title="the invoice machine"
        hint="drag to scrub · Space generates · E explodes"
        readout="READY · INV-2026-0042 · $3,916.00"
        keys={[
          { label: "invoice job", mark: "lit" },
          { label: "stations", mark: "raised" },
          { label: "line", mark: "dim" },
        ]}
        caption="A machine that turns business data into a finished invoice. The client card rides in, three item blocks follow, the tax dial locks at 10%, the press forms the sheet — and INV-2026-0042 for $3,916 slides into the tray."
      >
        <InvoiceMachineLive
          label="Isometric invoice machine: client hopper, item conveyor, assembly chamber, tax dial, printer and output tray"
          base={art.base}
          hopper={art.hopper}
          lane={art.lane}
          chamber={art.chamber}
          pressRods={<PressRodsArt />}
          press={<PressArt />}
          dialStatic={art.dialStatic}
          pin={<PinArt />}
          gearA={<GearArt which="a" />}
          gearB={<GearArt which="b" />}
          printer={art.printer}
          tray={art.tray}
          card={<CardArt />}
          blocks={[<BlockArt key={0} index={0} />, <BlockArt key={1} index={1} />, <BlockArt key={2} index={2} />]}
          csheet={<ChamberSheetArt />}
          rules={rules}
        />
      </Plate>
    </div>
  );
}

export function InvoiceMachinePreview() {
  return (
    <div className="imachine">
      <InvoiceMachineFigure />
    </div>
  );
}
