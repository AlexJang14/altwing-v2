import type {
  WingId,
} from "../wingmatch/build/catalog/buildCatalog";
import posthog, {
  isPostHogConfigured,
} from "../../posthog";

import "./explore-aerospace.css";


interface Props {
  onBack: () => void;

  onTryWing: (
    wingId: WingId,
  ) => void;
}


interface WingCard {
  id: WingId;
  number: string;
  name: string;
  simple: string;
  detail: string;
  lab: string;
  question: string;
}


const CORE_WINGS: WingCard[] = [
  {
    id: "propulsion",
    number: "01",
    name: "Propulsion",
    simple:
      "Make spacecraft move.",
    detail:
      "Engines · fuel · thrust · performance",
    lab:
      "ENGINE TRADEOFF",
    question:
      "How do you get the performance you need without wasting fuel?",
  },

  {
    id: "gnc",
    number: "02",
    name:
      "Guidance, Navigation & Control",
    simple:
      "Know where you are — and where you're going.",
    detail:
      "Sensors · trajectory · navigation · control",
    lab:
      "LOST SENSOR",
    question:
      "What do you trust when spacecraft sensors disagree?",
  },

  {
    id: "structures",
    number: "03",
    name: "Structures",
    simple:
      "Make spacecraft survive the forces of flight.",
    detail:
      "Loads · materials · stress · safety margin",
    lab:
      "SURVIVE TOUCHDOWN",
    question:
      "How strong can you make it without making it too heavy?",
  },

  {
    id: "thermal",
    number: "04",
    name:
      "Thermal Engineering",
    simple:
      "Keep spacecraft alive through extreme temperatures.",
    detail:
      "Heat · insulation · sunlight · eclipse",
    lab:
      "KEEP IT ALIVE",
    question:
      "How do you stay warm in darkness without overheating in sunlight?",
  },

  {
    id: "avionics",
    number: "05",
    name: "Avionics",
    simple:
      "Find what failed inside the spacecraft's electronic brain.",
    detail:
      "Sensors · computers · software · commands",
    lab:
      "FIND THE FAULT",
    question:
      "Can you trace a failure through the spacecraft before it becomes a mission failure?",
  },

  {
    id: "mission-design",
    number: "06",
    name:
      "Mission Design",
    simple:
      "Decide what the whole mission should accomplish.",
    detail:
      "Mass · power · science · risk · operations",
    lab:
      "BUILD A MARS MISSION",
    question:
      "What deserves the limited resources when every objective competes with another?",
  },
];


const EXPANSION_WINGS = [
  {
    name: "Aerodynamics",
    description:
      "Shape vehicles to work with air instead of fighting it.",
  },

  {
    name:
      "Orbital Mechanics",
    description:
      "Plan how spacecraft move through orbits and between worlds.",
  },

  {
    name:
      "Robotics & Autonomy",
    description:
      "Build machines that sense, decide, and act far from Earth.",
  },
];


function ExploreAerospace({
  onBack,
  onTryWing,
}: Props) {

  return (
    <main className="aw-explore">

      <header className="aw-explore-nav">

        <button
          type="button"
          onClick={onBack}
          className="aw-explore-back"
        >
          ← HOME
        </button>

        <strong className="aw-explore-brand">
          Alt
          <span>Wing</span>
        </strong>

        <span className="aw-explore-nav-label">
          EXPLORE
        </span>

      </header>


      <section className="aw-explore-hero">

        <div className="aw-explore-kicker">
          <i />
          EXPLORE AEROSPACE
        </div>

        <h1>
          Don't memorize careers.
          <br />
          <span>
            Try the work.
          </span>
        </h1>

        <p>
          Aerospace is not one job.
          A spacecraft works because many
          different engineering fields solve
          different problems together.
          Pick one below and step into a short,
          interactive engineering challenge.
        </p>

        <div className="aw-explore-path">
          <span>CHOOSE A WING</span>
          <b>→</b>
          <span>MAKE DECISIONS</span>
          <b>→</b>
          <span>RUN THE LAB</span>
          <b>→</b>
          <span>LEAVE PROOF</span>
        </div>

      </section>


      <section className="aw-explore-core">

        <div className="aw-explore-section-heading">

          <div>
            <span>
              6 CORE WINGS
            </span>

            <h2>
              What part of a spacecraft
              would you want to own?
            </h2>
          </div>

          <p>
            No aerospace experience needed.
            Each Wing explains the problem first,
            then lets you test the engineering.
          </p>

        </div>


        <div className="aw-wing-grid">

          {CORE_WINGS.map(
            (wing) => (

              <article
                className="aw-wing-card"
                key={wing.id}
              >

                <div className="aw-wing-card-top">

                  <span>
                    {wing.number}
                  </span>

                  <small>
                    CORE WING
                  </small>

                </div>


                <div className="aw-wing-card-copy">

                  <h3>
                    {wing.name}
                  </h3>

                  <strong>
                    {wing.simple}
                  </strong>

                  <p>
                    {wing.detail}
                  </p>

                </div>


                <div className="aw-wing-question">

                  <span>
                    THE ENGINEERING QUESTION
                  </span>

                  <p>
                    {wing.question}
                  </p>

                </div>


                <div className="aw-wing-lab">

                  <div>
                    <small>
                      INTERACTIVE LAB
                    </small>

                    <strong>
                      {wing.lab}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isPostHogConfigured) {
                        posthog.capture(
                          "wing_exploration_started",
                          {
                            wing_id: wing.id,
                          },
                        );
                      }

                      onTryWing(
                        wing.id,
                      );
                    }}
                  >
                    TRY THIS WING
                    <span>→</span>
                  </button>

                </div>

              </article>

            ),
          )}

        </div>

      </section>


      <section className="aw-explore-system">

        <div className="aw-system-copy">

          <span>
            WHY SIX?
          </span>

          <h2>
            Real missions are systems.
        </h2>

          <p>
            An engine can create more thrust
            but use more fuel. A stronger
            structure can survive harder loads
            but add mass. More insulation can
            protect hardware but change the
            thermal and power problem.
          </p>

          <p>
            That is why AltWing lets you try
            individual Wings while showing how
            every decision connects to the
            spacecraft around it.
          </p>

        </div>


        <div className="aw-system-map">

          <div>
            PROPULSION
          </div>

          <span>↔</span>

          <div>
            GNC
          </div>

          <span>↔</span>

          <div>
            STRUCTURES
          </div>

          <span>↔</span>

          <div>
            THERMAL
          </div>

          <span>↔</span>

          <div>
            AVIONICS
          </div>

          <span>↔</span>

          <div>
            MISSION
          </div>

        </div>

      </section>


      <section className="aw-explore-expansion">

        <div className="aw-explore-section-heading">

          <div>
            <span>
              NEXT WINGS
            </span>

            <h2>
              The universe gets bigger.
            </h2>
          </div>

          <p>
            These fields are part of the
            AltWing roadmap. Core Wings are
            playable now.
          </p>

        </div>


        <div className="aw-expansion-grid">

          {EXPANSION_WINGS.map(
            (wing) => (

              <article
                key={wing.name}
              >

                <span>
                  EXPANSION
                </span>

                <h3>
                  {wing.name}
                </h3>

                <p>
                  {wing.description}
                </p>

                <small>
                  COMING NEXT
                </small>

              </article>

            ),
          )}

        </div>

      </section>


      <section className="aw-explore-footer">

        <img
          src="/brand/altwing-penguin.png"
          alt=""
        />

        <div>
          <span>
            NOT SURE WHERE TO START?
          </span>

          <h2>
            Let WingMatch choose
            a starting direction.
          </h2>

          <p>
            Your result is not a label.
            It simply gives you a Wing worth
            testing first.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
        >
          BACK HOME →
        </button>

      </section>

    </main>
  );
}


export default ExploreAerospace;
