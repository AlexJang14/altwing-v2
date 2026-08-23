import { useState } from "react";
import "./fault-isolation.css";

export type FaultId =
  | "power"
  | "computer"
  | "rf-path"
  | "data-bus";

export interface FaultIsolationResult {
  faultId: FaultId;
  faultName: string;

  testsRun: string[];
  testCount: number;

  foundRfEvidence: boolean;
  inspectedPower: boolean;
  inspectedBus: boolean;
}

interface FaultIsolationPanelProps {
  locked?: boolean;

  onLock?: (
    result: FaultIsolationResult,
  ) => void;
}

interface DiagnosticTest {
  id: string;
  name: string;
  result: string;
  status: "PASS" | "FAIL" | "WARNING";
}

const diagnosticTests: DiagnosticTest[] = [
  {
    id: "power",
    name: "POWER BUS TEST",
    result: "28.1 V — stable under load",
    status: "PASS",
  },

  {
    id: "antenna",
    name: "ANTENNA LOOPBACK",
    result: "63% packet loss detected",
    status: "FAIL",
  },

  {
    id: "bus",
    name: "DATA BUS CHECK",
    result: "Command and telemetry bus operating normally",
    status: "PASS",
  },

  {
    id: "rf",
    name: "RF PATH TEST",
    result: "Signal attenuation +8.2 dB above expected",
    status: "WARNING",
  },
];

const hypotheses = [
  {
    id: "power" as FaultId,
    name: "POWER SYSTEM",
  },

  {
    id: "computer" as FaultId,
    name: "FLIGHT COMPUTER",
  },

  {
    id: "rf-path" as FaultId,
    name: "RF / ANTENNA PATH",
  },

  {
    id: "data-bus" as FaultId,
    name: "DATA BUS",
  },
];

function FaultIsolationPanel({
  locked = false,
  onLock,
}: FaultIsolationPanelProps) {
  const [testsRun, setTestsRun] =
    useState<string[]>([]);

  const [
    selectedFault,
    setSelectedFault,
  ] =
    useState<FaultId | null>(null);

  const remainingTests =
    3 - testsRun.length;

  function runTest(
    test: DiagnosticTest,
  ) {
    if (
      locked ||
      testsRun.includes(test.id) ||
      remainingTests <= 0
    ) {
      return;
    }

    setTestsRun((current) => [
      ...current,
      test.id,
    ]);
  }

  function handleLock() {
    if (!selectedFault) {
      return;
    }

    const fault =
      hypotheses.find(
        (item) =>
          item.id === selectedFault,
      );

    if (!fault) {
      return;
    }

    onLock?.({
      faultId:
        selectedFault,

      faultName:
        fault.name,

      testsRun,

      testCount:
        testsRun.length,

      foundRfEvidence:
        testsRun.includes("antenna") ||
        testsRun.includes("rf"),

      inspectedPower:
        testsRun.includes("power"),

      inspectedBus:
        testsRun.includes("bus"),
    });
  }

  return (
    <div className="fault-panel">
      <div className="fault-header">
        <div>
          <span>
            AVIONICS DIAGNOSTICS
          </span>

          <h2>
            Isolate the fault.
          </h2>
        </div>

        <div className="fault-budget">
          {remainingTests}

          <small>
            TESTS LEFT
          </small>
        </div>
      </div>

      <div className="fault-symptom">
        <span>
          PRIMARY SYMPTOM
        </span>

        <strong>
          COMMUNICATION LINK LOST
        </strong>

        <p>
          The lander is healthy after
          touchdown, but communication
          packets are dropping before
          reaching the ground station.
        </p>
      </div>

      <div className="fault-tests">
        {diagnosticTests.map(
          (test) => {
            const completed =
              testsRun.includes(
                test.id,
              );

            return (
              <button
                type="button"
                key={test.id}
                disabled={
                  locked ||
                  completed ||
                  remainingTests <= 0
                }
                onClick={() =>
                  runTest(test)
                }
                className={[
                  "fault-test",

                  completed
                    ? "fault-test--complete"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div>
                  <strong>
                    {test.name}
                  </strong>

                  <span>
                    {completed
                      ? test.status
                      : "RUN TEST"}
                  </span>
                </div>

                {completed && (
                  <p>
                    {test.result}
                  </p>
                )}
              </button>
            );
          },
        )}
      </div>

      <div className="fault-evidence">
        <span>
          EVIDENCE COLLECTED
        </span>

        <strong>
          {testsRun.length}
          <small>
            {" "}
            / 3 tests
          </small>
        </strong>
      </div>

      <div className="fault-hypotheses">
        <span>
          FAULT HYPOTHESIS
        </span>

        {hypotheses.map(
          (hypothesis) => {
            const selected =
              selectedFault ===
              hypothesis.id;

            return (
              <button
                type="button"
                key={
                  hypothesis.id
                }
                disabled={locked}
                onClick={() =>
                  setSelectedFault(
                    hypothesis.id,
                  )
                }
                className={[
                  "fault-hypothesis",

                  selected
                    ? "fault-hypothesis--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span />

                <strong>
                  {
                    hypothesis.name
                  }
                </strong>
              </button>
            );
          },
        )}
      </div>

      <button
        type="button"
        className="fault-lock"
        disabled={
          locked ||
          !selectedFault
        }
        onClick={handleLock}
      >
        {locked
          ? "Diagnosis locked"
          : selectedFault
            ? "Commit diagnosis"
            : "Select a fault hypothesis"}
      </button>
    </div>
  );
}

export default FaultIsolationPanel;