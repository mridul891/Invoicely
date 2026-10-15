import { Plate } from "@/components/iso/react/draw";
import { TotalizerArt } from "./art";
import { TotalizerLive } from "./live";
import "./tax-totalizer.css";

export function TotalizerFigure() {
  const art = TotalizerArt();
  return (
    <Plate
      fig="Fig 3"
      title="the tax totalizer"
      hint="← → sets rate · 0 5 10 18"
      readout="TAX 10% · tax $356.00 · total $3,916.00"
      keys={[
        { label: "your share (lit)", mark: "lit" },
        { label: "tax share", mark: "raised" },
        { label: "base", mark: "dim" },
      ]}
      caption="A totalizer for tax. The crank sets the rate — 0, 5, 10 or 18% — and the two bars always add to one full bar: your share against the tax share of every $100 billed, on the $3,560 subtotal."
    >
      <TotalizerLive
        label="Isometric totalizer with two share bars for client and tax amounts and a tax-rate dial"
        base={art.base}
        bars={art.bars}
        dial={art.dial}
      />
    </Plate>
  );
}
