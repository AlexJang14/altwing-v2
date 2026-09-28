import {
  useState,
} from "react";

import "./avionics-lab.css";

interface Props {
  onEvidence: (
    evidence: string
  ) => void;
}

type NodeId =
  | "sensor"
  | "computer"
  | "software"
  | "bus"
  | "actuator";

const TRUE_FAULT:
  NodeId =
    "bus";

const SYSTEMS = [
  {
    id:
      "sensor" as NodeId,
    short:
      "SENSOR",
    name:
      "Navigation Sensor",
    telemetry: [
      "Power: NOMINAL",
      "Output: PRESENT",
      "Update rate: 20 Hz",
      "Self-test: PASS",
    ],
  },

  {
    id:
      "computer" as NodeId,
    short:
      "COMPUTER",
    name:
      "Flight Computer",
    telemetry: [
      "CPU load: 42%",
      "Sensor packets: RECEIVED",
      "Calculation: COMPLETE",
      "Health: NOMINAL",
    ],
  },

  {
    id:
      "software" as NodeId,
    short:
      "SOFTWARE",
    name:
      "Flight Software",
    telemetry: [
      "Guidance solution: VALID",
      "Command generated: YES",
      "Timestamp: CURRENT",
      "Health: NOMINAL",
    ],
  },

  {
    id:
      "bus" as NodeId,
    short:
      "COMMAND BUS",
    name:
      "Command Bus",
    telemetry: [
      "Packets sent: 12",
      "Acknowledged: 3",
      "Packet loss: HIGH",
      "Voltage: INTERMITTENT",
    ],
  },

  {
    id:
      "actuator" as NodeId,
    short:
      "ACTUATOR",
    name:
      "Control Actuator",
    telemetry: [
      "Power: NOMINAL",
      "Local health: PASS",
      "Valid command: NO",
      "Motion response: NONE",
    ],
  },
];

function getNode(
  id: NodeId
) {
  return SYSTEMS.find(
    node =>
      node.id === id
  )!;
}

export default function AvionicsLab({
  onEvidence,
}: Props) {
  const [
    active,
    setActive,
  ] =
    useState<NodeId | null>(
      null
    );

  const [
    inspected,
    setInspected,
  ] =
    useState<NodeId[]>(
      []
    );

  const [
    suspect,
    setSuspect,
  ] =
    useState<NodeId | null>(
      null
    );

  const [
    ran,
    setRan,
  ] =
    useState(false);

  const [
    locked,
    setLocked,
  ] =
    useState(false);

  const correct =
    suspect ===
    TRUE_FAULT;

  function inspect(
    id: NodeId
  ) {
    setActive(id);

    setInspected(
      current =>
        current.includes(id)
          ? current
          : [
              ...current,
              id,
            ]
    );

    setRan(false);
    setLocked(false);
    onEvidence("");
  }

  function runDiagnostic() {
    if (!suspect) {
      return;
    }

    setRan(true);

    onEvidence(
      [
        "Avionics diagnostic run.",
        `Suspected fault: ${getNode(suspect).name}.`,
        `Result: ${correct ? "FAULT ISOLATED" : "REVISE DIAGNOSIS"}.`,
      ].join(" "),
    );
  }

  function saveDiagnosis() {
    if (
      !suspect ||
      !correct
    ) {
      return;
    }

    setLocked(true);

    onEvidence(
      [
        `Final avionics diagnosis: ${getNode(suspect).name}.`,
        "The sensor, computer, and software remain healthy.",
        "Command acknowledgements fall sharply before the actuator.",
        "The actuator passes local health checks but receives no valid command.",
        "The Command Bus is the isolated fault.",
      ].join(" "),
    );
  }

  return (
    <section className="av-lab">

      <div className="av-heading">

        <span>
          ARES-12 · AVIONICS DIAGNOSTIC
        </span>

        <h3>
          The spacecraft sent a command.
          Nothing moved.
        </h3>

        <p>
          Follow the signal from sensing
          to physical response and isolate
          the first subsystem where the
          evidence stops making sense.
        </p>

      </div>


      <div className="av-alert">
        <span>
          FLIGHT ALERT
        </span>

        <strong>
          Command issued · actuator response absent
        </strong>
      </div>


      <h4 className="av-label">
        01 · TRACE THE SIGNAL
      </h4>


      <div className="av-chain">

        {SYSTEMS.map(
          (
            node,
            index,
          ) => (
            <button
              key={
                node.id
              }
              type="button"
              className={[
                active ===
                node.id
                  ? "active"
                  : "",

                inspected.includes(
                  node.id
                )
                  ? "checked"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                inspect(
                  node.id
                )
              }
            >
              <span>
                {String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <strong>
                {
                  node.short
                }
              </strong>

              <small>
                {inspected.includes(
                  node.id
                )
                  ? "INSPECTED"
                  : "OPEN TELEMETRY"}
              </small>
            </button>
          ),
        )}

      </div>


      {active && (
        <div className="av-telemetry">

          <header>
            <span>
              LIVE TELEMETRY
            </span>

            <strong>
              {
                getNode(
                  active
                ).name
              }
            </strong>
          </header>


          <div>

            {getNode(
              active
            ).telemetry.map(
              line => {
                const warning =
                  line.includes(
                    "HIGH"
                  ) ||
                  line.includes(
                    "INTERMITTENT"
                  ) ||
                  line.includes(
                    "NO"
                  ) ||
                  line.includes(
                    "NONE"
                  );

                return (
                  <p
                    key={
                      line
                    }
                    className={
                      warning
                        ? "warning"
                        : ""
                    }
                  >
                    {line}
                  </p>
                );
              },
            )}

          </div>
        </div>
      )}


      <h4 className="av-label">
        02 · ISOLATE THE FAULT
      </h4>


      <div className="av-suspects">

        {SYSTEMS.map(
          node => (
            <button
              key={
                node.id
              }
              type="button"
              className={
                suspect ===
                node.id
                  ? "selected"
                  : ""
              }
              onClick={() => {
                setSuspect(
                  node.id
                );

                setRan(false);
                setLocked(false);
                onEvidence("");
              }}
            >
              {
                node.short
              }
            </button>
          ),
        )}

      </div>


      <button
        type="button"
        className="av-run"
        disabled={
          !suspect ||
          inspected.length <
            2
        }
        onClick={
          runDiagnostic
        }
      >
        {inspected.length < 2
          ? "INSPECT AT LEAST 2 SYSTEMS"
          : !suspect
            ? "SELECT A SUSPECT"
            : "RUN DIAGNOSTIC →"}
      </button>


      {ran && (
        <div
          className={
            correct
              ? "av-result correct"
              : "av-result wrong"
          }
        >
          <span>
            DIAGNOSTIC RESULT
          </span>

          <h4>
            {correct
              ? "FAULT ISOLATED"
              : "REVISE DIAGNOSIS"}
          </h4>

          <p>
            {correct
              ? "Software generated a valid command, but acknowledgements disappear before the actuator. The evidence isolates the Command Bus."
              : "Check where the last healthy signal appears and where the first abnormal telemetry begins."}
          </p>

          {correct &&
          !locked && (
            <button
              type="button"
              onClick={
                saveDiagnosis
              }
            >
              KEEP THIS DIAGNOSIS →
            </button>
          )}
        </div>
      )}


      {locked && (
        <div className="av-saved">
          <span>
            AVIONICS DIAGNOSIS SAVED
          </span>

          <strong>
            COMMAND BUS
          </strong>
        </div>
      )}

    </section>
  );
}
