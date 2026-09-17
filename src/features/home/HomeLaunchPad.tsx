import { useEffect, useState } from "react";
import BuildEngine
  from "../wingmatch/build/engine/BuildEngine";

import {
  CORE_WINGS,
  WING_BUILD_CATALOG,
  type WingId,
} from "../wingmatch/build/catalog/buildCatalog";

import PostWingGuide
  from "./PostWingGuide";

import HomeOnboardingTour
  from "./onboarding/HomeOnboardingTour";

import "./home-launch-pad.css";

interface Props {
  onStartWingMatch: () => void;
  onOpenUniverse: () => void;
}

interface Wing {
  id: string;
  name: string;
  short: string;
}

const WINGS: Record<
  string,
  {
    name: string;
    short: string;
    description: string;
    challenge: string;
  }
> = {
  gnc: {
    name: "Guidance, Navigation & Control",
    short: "GNC",
    description:
      "Motion, trajectory, navigation, and how spacecraft stay under control.",
    challenge:
      "Help a Mars lander respond when one navigation sensor becomes unreliable.",
  },

  avionics: {
    name: "Avionics",
    short: "AVIONICS",
    description:
      "Sensors, electronics, onboard software, telemetry, and fault detection.",
    challenge:
      "Build a system that detects when one spacecraft sensor is giving bad data.",
  },

  structures: {
    name: "Structures",
    short: "STRUCTURES",
    description:
      "Loads, materials, mechanisms, mass, and how spacecraft survive.",
    challenge:
      "Compare two landing-leg designs and find which survives with less mass.",
  },

  thermal: {
    name: "Thermal Engineering",
    short: "THERMAL",
    description:
      "Heat, insulation, radiators, temperature limits, and extreme environments.",
    challenge:
      "Keep a small spacecraft inside a safe temperature range.",
  },

  propulsion: {
    name: "Propulsion",
    short: "PROPULSION",
    description:
      "Thrust, engines, fuel, efficiency, and how spacecraft create motion.",
    challenge:
      "Compare two engines for the same Mars mission and see what each costs in fuel and travel time.",
  },

  "mission-design": {
    name: "Mission Design",
    short: "MISSION DESIGN",
    description:
      "Objectives, risk, resources, science value, and whole-mission tradeoffs.",
    challenge:
      "Design a Mars mission with limited mass, power, time, and one science goal.",
  },
};

function isBuildWing(
  value: string,
): value is WingId {
  return value in WING_BUILD_CATALOG;
}


function loadWing(): Wing | null {
  try {
    const saved = localStorage.getItem(
      "altwing-selected-wing-v1"
    );

    if (saved) {
      const parsed = JSON.parse(saved);
      const info = WINGS[parsed.id];

      return {
        id: parsed.id,
        name: parsed.name ?? info?.name ?? parsed.id,
        short: parsed.short ?? info?.short ?? parsed.id,
      };
    }

    const legacy = localStorage.getItem(
      "altwing-selected-wing"
    );

    if (legacy) {
      const info = WINGS[legacy];

      return {
        id: legacy,
        name: info?.name ?? legacy,
        short: info?.short ?? legacy,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export default function HomeLaunchPad({
  onStartWingMatch,
  onOpenUniverse,
}: Props) {
  const [wing, setWing] = useState<Wing | null>(
    () => loadWing()
  );


  const [
    selectedBuildWing,
    setSelectedBuildWing,
  ] =
    useState<WingId | null>(
      null
    );

  useEffect(() => {
    const refresh = () => setWing(loadWing());

    window.addEventListener(
      "altwing:selected-wing",
      refresh
    );

    window.addEventListener(
      "storage",
      refresh
    );

    window.addEventListener(
      "focus",
      refresh
    );

    return () => {
      window.removeEventListener(
        "altwing:selected-wing",
        refresh
      );

      window.removeEventListener(
        "storage",
        refresh
      );

      window.removeEventListener(
        "focus",
        refresh
      );
    };
  }, []);

  const info = wing
    ? WINGS[wing.id]
    : null;

  if (
    selectedBuildWing
  ) {

    return (
      <BuildEngine
        wingId={
          selectedBuildWing
        }
        onBack={() =>
          setSelectedBuildWing(
            null
          )
        }
      />
    );
  }


  return (
    <section className="hlp">

      <HomeOnboardingTour
        enabled={
          Boolean(
            wing
          )
        }
      />

      <PostWingGuide
        enabled={
          Boolean(
            wing
          )
        }
      />

      <div className="hlp-inner">

        <div className="hlp-flow">
          <span>THE ALTWING PATH</span>

          <strong>
            Discover → Try → Build → Show → Plan
          </strong>
        </div>

        <div className="hlp-grid">

          <article className="hlp-main">

            <span className="hlp-kicker">
              {wing
                ? `${wing.short} · WING FOUND`
                : "START HERE"}
            </span>

            <h2>
              {wing
                ? "You found a direction. Now test the work."
                : "You don't need to know your aerospace career yet."}
            </h2>

            <p className="hlp-description">
              {wing
                ? info?.challenge
                : "Start with one five-minute Mars mission. Make engineering decisions and discover a direction worth testing."}
            </p>

            {wing && (
              <div className="hlp-wing">

                <div className="hlp-penguin">
                  <img
                    src="/brand/altwing-penguin.png"
                    alt=""
                  />
                </div>

                <div>
                  <span>
                    YOUR CURRENT WING
                  </span>

                  <strong>
                    {wing.name}
                  </strong>

                  <p>
                    {info?.description}
                  </p>
                </div>

              </div>
            )}

            <div className="hlp-actions">

              <button
                className="hlp-primary"
                type="button"
                onClick={() => {

                  if (!wing) {
                    onStartWingMatch();
                    return;
                  }


                  if (
                    isBuildWing(
                      wing.id
                    )
                  ) {

                    setSelectedBuildWing(
                      wing.id
                    );

                    return;
                  }


                  onOpenUniverse();
                }}
              >
                {wing
                  ? `START MY ${wing.short} PATH`
                  : "START WINGMATCH · 5 MIN"}

                <b>→</b>
              </button>

              {wing && (
                <button
                  className="hlp-secondary"
                  type="button"
                  onClick={onStartWingMatch}
                >
                  RETAKE WINGMATCH
                </button>
              )}

            </div>

            <small>
              {wing
                ? "Start small. Build, test, improve."
                : "No aerospace experience required."}
            </small>

          </article>


          <aside className="hlp-route">

            <header>
              <span>YOUR ROUTE</span>

              <strong>
                {wing
                  ? "STEP 2 OF 4"
                  : "STEP 1 OF 4"}
              </strong>
            </header>

            <div
              className="hlp-step active"
            >
              <b>01</b>

              <div>
                <strong>
                  Find a direction
                </strong>

                <p>
                  Make aerospace decisions.
                </p>
              </div>

              <span>
                {wing ? "✓" : "NOW"}
              </span>
            </div>

            <div
              className={
                wing
                  ? "hlp-step active"
                  : "hlp-step"
              }
            >
              <b>02</b>

              <div>
                <strong>
                  Try the work
                </strong>

                <p>
                  Complete a small build.
                </p>
              </div>

              <span>
                {wing ? "NEXT" : ""}
              </span>
            </div>

            <div className="hlp-step">
              <b>03</b>

              <div>
                <strong>
                  Make something real
                </strong>

                <p>
                  Test it. Improve it. Save it.
                </p>
              </div>
            </div>

            <div className="hlp-step">
              <b>04</b>

              <div>
                <strong>
                  Use what you learned
                </strong>

                <p>
                  Classes, clubs, projects, colleges.
                </p>
              </div>
            </div>

          </aside>

        </div>


        <section className="hlp-build-library">

          <div className="hlp-library-heading">

            <div>
              <span>
                TRY ANOTHER WING
              </span>

              <h3>
                Your WingMatch result
                is a starting point,
                not a lock-in.
              </h3>
            </div>

            <p>
              Try different engineering
              fields and let your interests
              change as you actually do
              the work.
            </p>

          </div>


          <div className="hlp-build-grid">

            {CORE_WINGS.map(
              build => {

                const playable =
                  build.wingId ===
                    "propulsion" ||
                  build.wingId ===
                    "gnc";

                const current =
                  wing?.id ===
                  build.wingId;

                return (
                  <button
                    key={
                      build.wingId
                    }
                    type="button"
                    className={[
                      "hlp-build-card",

                      playable
                        ? "is-playable"
                        : "",

                      current
                        ? "is-current"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={
                      !playable
                    }
                    onClick={() =>
                      setSelectedBuildWing(
                        build.wingId
                      )
                    }
                  >

                    <div className="hlp-build-card-top">

                      <span>
                        {
                          build.wingName
                        }
                      </span>

                      <b>
                        {current
                          ? "YOUR WING"
                          : playable
                            ? "INTERACTIVE"
                            : "COMING NEXT"}
                      </b>

                    </div>


                    <h4>
                      {
                        build.buildTitle
                      }
                    </h4>

                    <p>
                      {
                        build.beginnerQuestion
                      }
                    </p>


                    <div className="hlp-build-card-bottom">

                      <span>
                        {
                          playable
                            ? "TRY BUILD"
                            : "LAB IN DEVELOPMENT"
                        }
                      </span>

                      {playable && (
                        <strong>
                          →
                        </strong>
                      )}

                    </div>

                  </button>
                );
              },
            )}

          </div>

        </section>


        <div className="hlp-why">

          <div className="hlp-why-title">
            <span>WHY ALTWING?</span>

            <h3>
              Stop researching careers.
              <br />
              Start testing them.
            </h3>
          </div>

          <article>
            <b>01</b>

            <strong>
              Find a direction.
            </strong>

            <p>
              See which aerospace problems make you want to keep going.
            </p>
          </article>

          <article>
            <b>02</b>

            <strong>
              Build something.
            </strong>

            <p>
              Try the work instead of trusting a job description.
            </p>
          </article>

          <article>
            <b>03</b>

            <strong>
              Know what's next.
            </strong>

            <p>
              Connect it to classes, activities, projects, and college.
            </p>
          </article>

        </div>

      </div>
    </section>
  );
}
