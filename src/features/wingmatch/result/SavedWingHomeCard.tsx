import {
  useEffect,
  useState,
} from "react";

import "./saved-wing-home-card.css";


interface SavedWing {
  id: string;
  name: string;
  short: string;
}


interface Props {
  onOpenUniverse: () => void;
  onRetake: () => void;
}


const WING_META:
  Record<
    string,
    {
      name: string;
      short: string;
      copy: string;
    }
  > = {

    gnc: {
      name:
        "Guidance, Navigation & Control",

      short:
        "GNC",

      copy:
        "Explore how spacecraft sense motion, follow trajectories, and stay under control.",
    },

    avionics: {
      name:
        "Avionics",

      short:
        "AVIONICS",

      copy:
        "Explore sensors, electronics, software signals, telemetry, and spacecraft diagnostics.",
    },

    structures: {
      name:
        "Structures",

      short:
        "STRUCTURES",

      copy:
        "Explore how spacecraft survive loads while staying strong, light, and reliable.",
    },

    thermal: {
      name:
        "Thermal Engineering",

      short:
        "THERMAL",

      copy:
        "Explore how engineers control heat and protect spacecraft in extreme environments.",
    },

    propulsion: {
      name:
        "Propulsion",

      short:
        "PROPULSION",

      copy:
        "Explore thrust, fuel, engines, performance, and how spacecraft create motion.",
    },

    "mission-design": {
      name:
        "Mission Design",

      short:
        "MISSION DESIGN",

      copy:
        "Explore how engineers balance science, risk, resources, and the mission as a whole.",
    },
  };


function readSavedWing():
  SavedWing | null {

  try {

    const full =
      localStorage.getItem(
        "altwing-selected-wing-v1",
      );


    if (full) {

      const parsed =
        JSON.parse(
          full,
        );


      if (
        parsed &&
        typeof parsed.id ===
          "string"
      ) {

        const fallback =
          WING_META[
            parsed.id
          ];


        return {
          id:
            parsed.id,

          name:
            parsed.name ??
            fallback?.name ??
            parsed.id,

          short:
            parsed.short ??
            fallback?.short ??
            parsed.id.toUpperCase(),
        };
      }
    }


    const legacy =
      localStorage.getItem(
        "altwing-selected-wing",
      );


    if (legacy) {

      const fallback =
        WING_META[
          legacy
        ];


      return {
        id:
          legacy,

        name:
          fallback?.name ??
          legacy,

        short:
          fallback?.short ??
          legacy.toUpperCase(),
      };
    }


    return null;

  } catch {

    return null;
  }
}


function SavedWingHomeCard({
  onOpenUniverse,
  onRetake,
}: Props) {

  const [
    wing,
    setWing,
  ] =
    useState<
      SavedWing | null
    >(
      () =>
        readSavedWing(),
    );


  useEffect(
    () => {

      const refresh = () => {
        setWing(
          readSavedWing(),
        );
      };


      window.addEventListener(
        "altwing:selected-wing",
        refresh,
      );


      window.addEventListener(
        "storage",
        refresh,
      );


      return () => {

        window.removeEventListener(
          "altwing:selected-wing",
          refresh,
        );


        window.removeEventListener(
          "storage",
          refresh,
        );
      };

    },
    [],
  );


  if (!wing) {
    return null;
  }


  const meta =
    WING_META[
      wing.id
    ];


  return (
    <section
      className="saved-wing-card-section"
      data-wing={
        wing.id
      }
    >

      <div className="saved-wing-card">

        <div className="saved-wing-mascot">

          <div className="saved-wing-orbit" />

          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <span>
            {
              wing.short
            }
          </span>

        </div>


        <div className="saved-wing-copy">

          <span className="saved-wing-eyebrow">
            WINGMATCH COMPLETE
          </span>


          <h2>
            Your Wing is saved.
          </h2>


          <h3>
            {
              wing.name
            }
          </h3>


          <p>
            {
              meta?.copy ??
              "Your WingMatch result is saved. Now test the work behind it."
            }
          </p>


          <div className="saved-wing-state">

            <i />

            <span>
              YOUR CURRENT WING
            </span>

            <strong>
              {
                wing.short
              }
            </strong>

          </div>

        </div>


        <div className="saved-wing-actions">

          <button
            type="button"
            className="saved-wing-open"
            onClick={
              onOpenUniverse
            }
          >
            OPEN MY UNIVERSE
            <span>→</span>
          </button>


          <button
            type="button"
            className="saved-wing-retake"
            onClick={
              onRetake
            }
          >
            RETAKE WINGMATCH
          </button>

        </div>

      </div>

    </section>
  );
}


export default SavedWingHomeCard;
