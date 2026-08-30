import type {
  PrimaryWingId,
} from "../engine/wingmatchV5";

import "../styles/wing-mascot.css";


export type MascotWing =
  | PrimaryWingId
  | "launch";


interface Props {
  wingId:
    MascotWing;

  size?:
    | "home"
    | "hero"
    | "card";
}


function WingMascot({
  wingId,
  size = "hero",
}: Props) {

  return (
    <div
      className={[
        "wing-mascot",

        `wing-mascot--${wingId}`,

        `wing-mascot--${size}`,
      ].join(" ")}
      role="img"
      aria-label={
        wingId === "launch"
          ? "AltWing launch penguin"
          : `${wingId} Wing penguin`
      }
    >

      <div className="wing-mascot__aura" />

      <div className="wing-mascot__orbit wing-mascot__orbit--one" />
      <div className="wing-mascot__orbit wing-mascot__orbit--two" />

      <div className="wing-mascot__booster wing-mascot__booster--left">
        <i />
      </div>

      <div className="wing-mascot__booster wing-mascot__booster--right">
        <i />
      </div>

      <div className="wing-mascot__antenna">
        <i />
        <b />
      </div>

      <div className="wing-mascot__signal signal-one" />
      <div className="wing-mascot__signal signal-two" />

      <div className="wing-mascot__frame frame-left" />
      <div className="wing-mascot__frame frame-right" />
      <div className="wing-mascot__frame frame-top" />

      <div className="wing-mascot__shield" />

      <div className="wing-mascot__mission-ring" />
      <div className="wing-mascot__mission-star">
        ✦
      </div>

      <img
        src="/brand/altwing-penguin.png"
        alt=""
      />

    </div>
  );
}


export default WingMascot;
