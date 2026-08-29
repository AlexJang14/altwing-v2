import { useState } from "react";
import "./fault-isolation.css";

export type FaultId =
  | "power"
  | "computer"
  | "rf-path"
  | "data-bus";

export type RecoveryActionId =
  | "backup-rf"
  | "reboot-computer"
  | "autonomous-hold";

export interface FaultIsolationResult {
  faultId: FaultId;
  faultName: string;

  recoveryActionId:
    RecoveryActionId;

  recoveryActionName: string;

  testsRun: string[];
  testCount: number;

  foundRfEvidence: boolean;
  inspectedPower: boolean;
  inspectedBus: boolean;
}

interface FaultIsolationPanelProps {
  locked?: boolean;

  onPreview?: (
    result: FaultIsolationResult,
  ) => void;

  onLock?: (
    result: FaultIsolationResult,
  ) => void;
}

interface DiagnosticTest {
  id: string;
  name: string;
  result: string;
  status:
    | "PASS"
    | "FAIL"
    | "WARNING";
}

interface RecoveryAction {
  id: RecoveryActionId;
  name: string;
  description: string;
  tradeoff: string;
}

const diagnosticTests:
  DiagnosticTest[] = [
  {
    id: "power",
    name: "POWER BUS TEST",
    result:
      "28.1 V — stable under load",
    status: "PASS",
  },

  {
    id: "antenna",
    name: "ANTENNA LOOPBACK",
    result:
      "63% packet loss detected",
    status: "FAIL",
  },

  {
    id: "bus",
    name: "DATA BUS CHECK",
    result:
      "Command and telemetry bus operating normally",
    status: "PASS",
  },

  {
    id: "rf",
    name: "RF PATH TEST",
    result:
      "Signal attenuation +8.2 dB above expected",
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

const recoveryActions:
  RecoveryAction[] = [
  {
    id: "backup-rf",
    name: "REROUTE TO BACKUP RF",
    description:
      "Switch communication through the backup radio path and attempt immediate reacquisition.",
    tradeoff:
      "GAIN: link recovery attempt  /  ACCEPT: power + redundancy cost",
  },

  {
    id: "reboot-computer",
    name: "REBOOT FLIGHT COMPUTER",
    description:
      "Restart communication and command software while the lander remains autonomous.",
    tradeoff:
      "GAIN: software reset  /  ACCEPT: temporary control interruption",
  },

  {
    id: "autonomous-hold",
    name: "HOLD AUTONOMOUS MODE",
    description:
      "Preserve vehicle stability and wait for the next communication opportunity.",
    tradeoff:
      "GAIN: vehicle safety + reserve  /  ACCEPT: delayed science + contact",
  },
];

function getFaultName(
  faultId: FaultId,
) {
  return (
    hypotheses.find(
      (item) =>
        item.id === faultId,
    )?.name ?? faultId
  );
}

function getRecoveryName(
  recoveryActionId:
    RecoveryActionId,
) {
  return (
    recoveryActions.find(
      (item) =>
        item.id ===
        recoveryActionId,
    )?.name ??
    recoveryActionId
  );
}

function buildResult(
  faultId: FaultId,
  recoveryActionId:
    RecoveryActionId,
  testsRun: string[],
): FaultIsolationResult {
  return {
    faultId,

    faultName:
      getFaultName(
        faultId,
      ),

    recoveryActionId,

    recoveryActionName:
      getRecoveryName(
        recoveryActionId,
      ),

    testsRun,

    testCount:
      testsRun.length,

    foundRfEvidence:
      testsRun.includes(
        "antenna",
      ) ||
      testsRun.includes(
        "rf",
      ),

    inspectedPower:
      testsRun.includes(
        "power",
      ),

    inspectedBus:
      testsRun.includes(
        "bus",
      ),
  };
}

function FaultIsolationPanel({
  locked = false,
  onPreview,
  onLock,
}: FaultIsolationPanelProps) {
  const [
    testsRun,
    setTestsRun,
  ] =
    useState<string[]>([]);

  const [
    selectedFault,
    setSelectedFault,
  ] =
    useState<FaultId | null>(
      null,
    );

  const [
    selectedRecovery,
    setSelectedRecovery,
  ] =
    useState<
      RecoveryActionId | null
    >(null);

  const remainingTests =
    3 - testsRun.length;

  function emitPreview(
    faultId:
      | FaultId
      | null,
    recoveryId:
      | RecoveryActionId
      | null,
    testIds:
      string[] = testsRun,
  ) {
    if (
      !faultId ||
      !recoveryId
    ) {
      return;
    }

    onPreview?.(
      buildResult(
        faultId,
        recoveryId,
        testIds,
      ),
    );
  }

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

    const nextTests = [
      ...testsRun,
      test.id,
    ];

    setTestsRun(
      nextTests,
    );

    emitPreview(
      selectedFault,
      selectedRecovery,
      nextTests,
    );
  }

  function selectFault(
    faultId: FaultId,
  ) {
    if (locked) {
      return;
    }

    setSelectedFault(
      faultId,
    );

    emitPreview(
      faultId,
      selectedRecovery,
    );
  }

  function selectRecovery(
    recoveryId:
      RecoveryActionId,
  ) {
    if (locked) {
      return;
    }

    setSelectedRecovery(
      recoveryId,
    );

    emitPreview(
      selectedFault,
      recoveryId,
    );
  }

  function handleLock() {
    if (
      !selectedFault ||
      !selectedRecovery
    ) {
      return;
    }

    const result =
      buildResult(
        selectedFault,
        selectedRecovery,
        testsRun,
      );

    console.group(
      "AltWing Flight Anomaly",
    );

    console.log(
      "Diagnosis:",
      result.faultName,
    );

    console.log(
      "Recovery:",
      result.recoveryActionName,
    );

    console.log(
      "Evidence:",
      result.testsRun,
    );

    console.groupEnd();

    onLock?.(
      result,
    );
  }

  return (
    <div className="fault-panel">
      <div className="fault-anomaly">
        <div>
          <span>
            ⚠ FLIGHT ANOMALY
          </span>

          <strong>
            COMMUNICATIONS BLACKOUT
          </strong>
        </div>

        <div className="fault-anomaly__status">
          <span>
            AUTONOMY
          </span>

          <b>
            ACTIVE
          </b>
        </div>
      </div>

      <div className="fault-anomaly__telemetry">
        <div>
          <span>
            TOUCHDOWN
          </span>

          <strong>
            CONFIRMED
          </strong>
        </div>

        <div>
          <span>
            CLEAN PACKET
          </span>

          <strong>
            34 s AGO
          </strong>
        </div>

        <div>
          <span>
            TEST BUDGET
          </span>

          <strong>
            3 MAX
          </strong>
        </div>
      </div>

      <div className="fault-header">
        <div>
          <span>
            DIAGNOSE UNDER
            UNCERTAINTY
          </span>

          <h2>
            Find the fault before
            you choose how to recover.
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
          GROUND LINK LOST
        </strong>

        <p>
          The lander is stable after
          touchdown, but clean
          communication packets are
          no longer reaching the
          ground station.
        </p>
      </div>

      <div className="fault-section-label">
        01 / COLLECT EVIDENCE
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

      <div className="fault-section-label">
        02 / FORM A HYPOTHESIS
      </div>

      <div className="fault-hypotheses">
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
                  selectFault(
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

      <div className="fault-section-label">
        03 / CHOOSE RECOVERY
      </div>

      <div className="fault-recovery">
        {recoveryActions.map(
          (action) => {
            const selected =
              selectedRecovery ===
              action.id;

            return (
              <button
                type="button"
                key={action.id}
                disabled={locked}
                onClick={() =>
                  selectRecovery(
                    action.id,
                  )
                }
                className={[
                  "fault-recovery-card",

                  selected
                    ? "fault-recovery-card--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div>
                  <strong>
                    {action.name}
                  </strong>

                  {selected && (
                    <span>
                      PREVIEWING
                    </span>
                  )}
                </div>

                <p>
                  {
                    action.description
                  }
                </p>

                <small>
                  {
                    action.tradeoff
                  }
                </small>
              </button>
            );
          },
        )}
      </div>

      {selectedFault &&
        selectedRecovery && (
          <div className="fault-decision-preview">
            <span>
              PROPOSED RESPONSE
            </span>

            <strong>
              {
                getFaultName(
                  selectedFault,
                )
              }
            </strong>

            <p>
              Diagnose the failure as{" "}
              <b>
                {
                  getFaultName(
                    selectedFault,
                  )
                }
              </b>{" "}
              and{" "}
              <b>
                {
                  getRecoveryName(
                    selectedRecovery,
                  )
                }
              </b>
              .
            </p>

            <small>
              The mission consequence
              preview above shows the
              operational tradeoff —
              not whether your diagnosis
              is correct.
            </small>
          </div>
        )}

      <button
        type="button"
        className="fault-lock"
        disabled={
          locked ||
          !selectedFault ||
          !selectedRecovery
        }
        onClick={handleLock}
      >
        {locked
          ? "Response committed ✓"
          : selectedFault &&
              selectedRecovery
            ? "Commit diagnosis + recovery →"
            : "Diagnose and choose a recovery"}
      </button>
    </div>
  );
}

export default FaultIsolationPanel;
