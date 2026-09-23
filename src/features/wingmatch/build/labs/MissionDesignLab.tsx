import {
  useMemo,
  useState,
} from "react";

import "./mission-design-lab.css";


interface Props {
  onEvidence: (
    evidence: string,
  ) => void;
}


type ScienceId =
  | "compact"
  | "advanced";

type CommsId =
  | "standard"
  | "high";

type MobilityId =
  | "stationary"
  | "short"
  | "long";

type SafetyId =
  | "lean"
  | "balanced"
  | "robust";


const MASS_LIMIT = 250;
const POWER_LIMIT = 450;
const RISK_LIMIT = 25;


const SCIENCE = {
  compact: {
    id: "compact" as ScienceId,
    name: "COMPACT SCIENCE",
    mass: 45,
    power: 80,
    risk: 5,
    science: 48,
    description:
      "A smaller instrument suite with lower resource demand.",
  },

  advanced: {
    id: "advanced" as ScienceId,
    name: "ADVANCED SCIENCE",
    mass: 95,
    power: 160,
    risk: 9,
    science: 85,
    description:
      "Higher scientific return, but much more mass and power.",
  },
};


const COMMS = {
  standard: {
    id: "standard" as CommsId,
    name: "STANDARD COMMS",
    mass: 20,
    power: 55,
    risk: 7,
    data: 55,
    description:
      "Lower resource use with a smaller data-return capability.",
  },

  high: {
    id: "high" as CommsId,
    name: "HIGH-GAIN COMMS",
    mass: 35,
    power: 110,
    risk: 4,
    data: 88,
    description:
      "Better data return and link margin at a higher power cost.",
  },
};


const MOBILITY = {
  stationary: {
    id: "stationary" as MobilityId,
    name: "STATIONARY LANDER",
    mass: 0,
    power: 0,
    risk: 2,
    mobility: 10,
    description:
      "Simple and reliable, but explores only one landing site.",
  },

  short: {
    id: "short" as MobilityId,
    name: "SHORT-RANGE ROVER",
    mass: 60,
    power: 120,
    risk: 8,
    mobility: 62,
    description:
      "Adds local exploration without dominating the mission budget.",
  },

  long: {
    id: "long" as MobilityId,
    name: "LONG-RANGE ROVER",
    mass: 110,
    power: 200,
    risk: 15,
    mobility: 95,
    description:
      "Major exploration capability with high mass, power, and complexity.",
  },
};


const SAFETY = {
  lean: {
    id: "lean" as SafetyId,
    name: "LEAN MARGIN",
    mass: 25,
    power: 35,
    riskReduction: 2,
    reliability: 48,
    description:
      "Saves resources, but leaves less margin for unexpected problems.",
  },

  balanced: {
    id: "balanced" as SafetyId,
    name: "BALANCED MARGIN",
    mass: 55,
    power: 80,
    riskReduction: 7,
    reliability: 75,
    description:
      "A moderate reserve for faults, uncertainty, and mission changes.",
  },

  robust: {
    id: "robust" as SafetyId,
    name: "ROBUST MARGIN",
    mass: 90,
    power: 120,
    riskReduction: 13,
    reliability: 93,
    description:
      "Strong resilience, but the reserve itself consumes mission resources.",
  },
};


export default function MissionDesignLab({
  onEvidence,
}: Props) {

  const [
    science,
    setScience,
  ] = useState<ScienceId>(
    "compact"
  );

  const [
    comms,
    setComms,
  ] = useState<CommsId>(
    "high"
  );

  const [
    mobility,
    setMobility,
  ] = useState<MobilityId>(
    "short"
  );

  const [
    safety,
    setSafety,
  ] = useState<SafetyId>(
    "balanced"
  );

  const [
    hasRun,
    setHasRun,
  ] = useState(false);

  const [
    locked,
    setLocked,
  ] = useState(false);


  const result =
    useMemo(
      () => {

        const s =
          SCIENCE[science];

        const c =
          COMMS[comms];

        const m =
          MOBILITY[mobility];

        const f =
          SAFETY[safety];


        const mass =
          s.mass +
          c.mass +
          m.mass +
          f.mass;


        const power =
          s.power +
          c.power +
          m.power +
          f.power;


        const rawRisk =
          s.risk +
          c.risk +
          m.risk;


        const risk =
          Math.max(
            1,
            rawRisk -
            f.riskReduction
          );


        const missionValue =
          Math.round(
            (
              s.science * .48
            ) +
            (
              c.data * .18
            ) +
            (
              m.mobility * .19
            ) +
            (
              f.reliability * .15
            )
          );


        const massPass =
          mass <=
          MASS_LIMIT;


        const powerPass =
          power <=
          POWER_LIMIT;


        const riskPass =
          risk <=
          RISK_LIMIT;


        const missionPass =
          massPass &&
          powerPass &&
          riskPass;


        let architecture =
          "BALANCED SURFACE MISSION";


        if (
          s.science >= 80 &&
          m.mobility >= 60
        ) {
          architecture =
            "MOBILE SCIENCE EXPLORER";
        }
        else if (
          c.data >= 80 &&
          f.reliability >= 90
        ) {
          architecture =
            "RESILIENT RELAY LANDER";
        }
        else if (
          m.mobility >= 90
        ) {
          architecture =
            "LONG-RANGE SCOUT";
        }
        else if (
          s.science >= 80
        ) {
          architecture =
            "SCIENCE-FIRST LANDER";
        }


        return {
          mass,
          power,
          risk,
          missionValue,
          massPass,
          powerPass,
          riskPass,
          missionPass,
          architecture,
        };

      },
      [
        science,
        comms,
        mobility,
        safety,
      ],
    );


  function resetResult() {

    setHasRun(false);
    setLocked(false);

    onEvidence("");
  }


  function runArchitecture() {

    setHasRun(true);


    onEvidence(
      [
        "Mission architecture evaluated.",
        `Science: ${SCIENCE[science].name}.`,
        `Communications: ${COMMS[comms].name}.`,
        `Mobility: ${MOBILITY[mobility].name}.`,
        `Safety: ${SAFETY[safety].name}.`,
        `Added mass: ${result.mass} kg.`,
        `Peak power: ${result.power} W.`,
        `Mission risk score: ${result.risk}.`,
        `Mission value score: ${result.missionValue}.`,
        `Architecture: ${result.architecture}.`,
        `Result: ${result.missionPass ? "PASS" : "REVISE"}.`,
      ].join(" "),
    );
  }


  function lockArchitecture() {

    if (
      !result.missionPass
    ) {
      return;
    }


    setLocked(true);


    onEvidence(
      [
        `Final mission architecture: ${result.architecture}.`,
        `Science payload: ${SCIENCE[science].name}.`,
        `Communications: ${COMMS[comms].name}.`,
        `Mobility: ${MOBILITY[mobility].name}.`,
        `Safety strategy: ${SAFETY[safety].name}.`,
        `Final mass: ${result.mass} kg of ${MASS_LIMIT} kg.`,
        `Final power: ${result.power} W of ${POWER_LIMIT} W.`,
        `Final risk score: ${result.risk} of ${RISK_LIMIT}.`,
        `Mission value: ${result.missionValue}.`,
      ].join(" "),
    );
  }


  return (
    <section className="mdlab">

      <div className="mdlab-intro">

        <span>
          ARES-13 · MISSION ARCHITECTURE
        </span>

        <h3>
          You cannot maximize everything.
        </h3>

        <p>
          Build a Mars surface mission
          under fixed mass, power, and risk
          limits. Every capability you add
          consumes resources somewhere else.
        </p>

      </div>


      <aside className="mdlab-disclosure">

        <strong>
          SIMPLIFIED SYSTEMS-ENGINEERING CHALLENGE
        </strong>

        <p>
          The numbers are fictional educational
          parameters. The goal is to practice
          mission trade studies: balancing
          performance, resources, risk,
          reliability, and mission objectives.
        </p>

      </aside>


      <section className="mdlab-budget">

        <div>

          <span>
            MASS BUDGET
          </span>

          <strong
            className={
              result.massPass
                ? "pass"
                : "fail"
            }
          >
            {result.mass}
            {" / "}
            {MASS_LIMIT} kg
          </strong>

        </div>


        <div>

          <span>
            POWER BUDGET
          </span>

          <strong
            className={
              result.powerPass
                ? "pass"
                : "fail"
            }
          >
            {result.power}
            {" / "}
            {POWER_LIMIT} W
          </strong>

        </div>


        <div>

          <span>
            RISK LIMIT
          </span>

          <strong
            className={
              result.riskPass
                ? "pass"
                : "fail"
            }
          >
            {result.risk}
            {" / "}
            {RISK_LIMIT}
          </strong>

        </div>

      </section>


      <ChoiceSection
        number="01"
        title="Science payload"
        subtitle="How much science capability should the mission carry?"
        items={Object.values(
          SCIENCE
        )}
        selected={science}
        onSelect={
          id => {
            setScience(
              id as ScienceId
            );
            resetResult();
          }
        }
      />


      <ChoiceSection
        number="02"
        title="Communications"
        subtitle="How much capability should be reserved for sending data home?"
        items={Object.values(
          COMMS
        )}
        selected={comms}
        onSelect={
          id => {
            setComms(
              id as CommsId
            );
            resetResult();
          }
        }
      />


      <ChoiceSection
        number="03"
        title="Mobility"
        subtitle="Should the mission remain at one site or travel across Mars?"
        items={Object.values(
          MOBILITY
        )}
        selected={mobility}
        onSelect={
          id => {
            setMobility(
              id as MobilityId
            );
            resetResult();
          }
        }
      />


      <ChoiceSection
        number="04"
        title="Safety margin"
        subtitle="How much resource reserve should the mission carry?"
        items={Object.values(
          SAFETY
        )}
        selected={safety}
        onSelect={
          id => {
            setSafety(
              id as SafetyId
            );
            resetResult();
          }
        }
      />


      {!hasRun && (

        <button
          type="button"
          className="mdlab-run"
          onClick={
            runArchitecture
          }
        >
          EVALUATE MISSION →
        </button>

      )}


      {hasRun && (

        <section className="mdlab-result">

          <div className="mdlab-result-top">

            <div>

              <span>
                MISSION ARCHITECTURE
              </span>

              <h3>
                {
                  result.architecture
                }
              </h3>

            </div>


            <strong
              className={
                result.missionPass
                  ? "pass"
                  : "fail"
              }
            >
              {result.missionPass
                ? "MISSION VIABLE"
                : "REVISE DESIGN"}
            </strong>

          </div>


          <div className="mdlab-score">

            <span>
              MISSION VALUE
            </span>

            <strong>
              {
                result.missionValue
              }
            </strong>

            <small>
              Educational comparison score
            </small>

          </div>


          <div className="mdlab-status-grid">

            <div>

              <span>
                MASS
              </span>

              <strong
                className={
                  result.massPass
                    ? "pass"
                    : "fail"
                }
              >
                {result.massPass
                  ? "PASS"
                  : "OVER"}
              </strong>

            </div>


            <div>

              <span>
                POWER
              </span>

              <strong
                className={
                  result.powerPass
                    ? "pass"
                    : "fail"
                }
              >
                {result.powerPass
                  ? "PASS"
                  : "OVER"}
              </strong>

            </div>


            <div>

              <span>
                RISK
              </span>

              <strong
                className={
                  result.riskPass
                    ? "pass"
                    : "fail"
                }
              >
                {result.riskPass
                  ? "PASS"
                  : "HIGH"}
              </strong>

            </div>

          </div>


          <div className="mdlab-insight">

            <span>
              SYSTEMS THINKING
            </span>

            <p>
              Adding capability is easy.
              Making all of the subsystems
              fit together inside the same
              spacecraft is the harder job.
              Mission design is about deciding
              which performance matters most
              under shared constraints.
            </p>

          </div>


          {!result.missionPass && (

            <button
              type="button"
              className="mdlab-revise"
              onClick={() =>
                setHasRun(
                  false
                )
              }
            >
              REVISE ARCHITECTURE
            </button>

          )}


          {result.missionPass &&
          !locked && (

            <button
              type="button"
              className="mdlab-lock"
              onClick={
                lockArchitecture
              }
            >
              KEEP THIS MISSION →
            </button>

          )}

        </section>

      )}


      {locked && (

        <section className="mdlab-locked">

          <span>
            MISSION ARCHITECTURE SAVED
          </span>

          <strong>
            {
              result.architecture
            }
          </strong>

          <p>
            Your systems-level decision
            is ready for the Compare stage.
          </p>

        </section>

      )}

    </section>
  );
}


interface ChoiceItem {
  id: string;
  name: string;
  mass: number;
  power: number;
  description: string;
}


interface ChoiceSectionProps {
  number: string;
  title: string;
  subtitle: string;
  items: ChoiceItem[];
  selected: string;
  onSelect: (
    id: string,
  ) => void;
}


function ChoiceSection({
  number,
  title,
  subtitle,
  items,
  selected,
  onSelect,
}: ChoiceSectionProps) {

  return (
    <section className="mdlab-choice-section">

      <header>

        <span>
          {number}
        </span>

        <div>

          <strong>
            {title}
          </strong>

          <small>
            {subtitle}
          </small>

        </div>

      </header>


      <div className="mdlab-choices">

        {items.map(
          item => (

            <button
              type="button"
              key={
                item.id
              }
              className={
                selected ===
                item.id
                  ? "is-selected"
                  : ""
              }
              onClick={() =>
                onSelect(
                  item.id
                )
              }
            >

              <span>
                {
                  item.name
                }
              </span>


              <div>

                <small>
                  MASS
                </small>

                <strong>
                  {
                    item.mass
                  } kg
                </strong>

              </div>


              <div>

                <small>
                  POWER
                </small>

                <strong>
                  {
                    item.power
                  } W
                </strong>

              </div>


              <p>
                {
                  item.description
                }
              </p>

            </button>

          ),
        )}

      </div>

    </section>
  );
}
