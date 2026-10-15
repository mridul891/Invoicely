import { Plate } from "@/components/iso/react/draw";
import { CoinArt, HeadArt, PressArt } from "./art";
import { PressLive } from "./live";
import "./invoice-press.css";

export function InvoicePressFigure() {
  const art = PressArt();
  return (
    <Plate
      fig="Fig 1"
      title="the invoice press"
      hint="Space stamps · P pays · drag nothing, press everything"
      readout="DRAFT · $3,916.00 due"
      keys={[
        { label: "invoice (watch it)", mark: "lit" },
        { label: "press + cash box", mark: "raised" },
        { label: "base", mark: "dim" },
      ]}
      caption="A countertop press for the invoice lifecycle. The lever stamps DRAFT → SENT, the coin rides its rail into the cash box, and the dial reads days-to-paid. Every number comes from the same model that moves the parts."
    >
      <PressLive
        label="Isometric invoice press: a stamped invoice card, a stamp head, a coin dropping into a cash box, and a days-to-paid dial"
        base={art.base}
        bed={art.bed}
        card={art.card}
        gantry={art.gantry}
        box={art.box}
        head={<HeadArt />}
        coin={<CoinArt />}
      />
    </Plate>
  );
}
