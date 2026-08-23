import { useMemo, useState } from "react";
import ControlTuningPanel from "./ControlTuningPanel";
import type { ControllerTuningResult } from "./ControlTuningPanel";
import MissionVisual from "./MissionVisual";
import { activeMissionScenes } from "./missionScenes";
import type {
  ControllerMissionScene,
  MissionOption,
  MissionScene,
  ReasoningSignal,
  TelemetryItem,
  WingId,
} from "./types";
import "./wingmatch.css";

interface WingMatchMissionProps {
  onExit: () => void;
}

type WingScores = Partial<Record<WingId, number>>;
type ReasoningScores = Partial<Record<ReasoningSignal, number>>;

interface MissionHistoryItem {
  sceneId: string;
  phase: string;
  title: string;
  consequence: string;
  effects: TelemetryItem[];
}

interface CommitFlashData {
  title: string;
  effects: TelemetryItem[];
  continues: boolean;
}

function isControllerMission(
  scene: MissionScene,
): scene is ControllerMissionScene {
  return (
    "interaction" in scene &&
    (scene as ControllerMissionScene).interaction ===
      "controller-tuning"
  );
}

function mergeTelemetry(
  baseTelemetry: TelemetryItem[],
  changes: TelemetryItem[],
) {
  const merged = [...baseTelemetry];

  changes.forEach((change) => {
    const existingIndex = merged.findIndex(
      (item) => item.label === change.label,
    );

    if (existingIndex >= 0) {
      merged[existingIndex] = change;
    } else {
      merged.push(change);
    }
  });

  return merged;
}

function addScores<T extends string>(
  current: Partial<Record<T, number>>,
  incoming: Partial<Record<T, number>> | undefined,
) {
  const next = { ...current };

  if (!incoming) {
    return next;
  }

  Object.entries(incoming).forEach(([key, value]) => {
    if (typeof value !== "number") {
      return;
    }

    const typedKey = key as T;

    next[typedKey] =
      (next[typedKey] ?? 0) + value;
  });

  return next;
}

function WingMatchMission({
  onExit,
}: WingMatchMissionProps) {
  const [sceneIndex, setSceneIndex] =
    useState(0);

  const [previewOption, setPreviewOption] =
    useState<MissionOption | null>(null);

  const [committedOption, setCommittedOption] =
    useState<MissionOption | null>(null);

  const [
    controllerLocked,
    setControllerLocked,
  ] = useState(false);

  const [
    controllerResult,
    setControllerResult,
  ] =
    useState<ControllerTuningResult | null>(
      null,
    );

  const [commitFlash, setCommitFlash] =
    useState<CommitFlashData | null>(null);

  const [wingScores, setWingScores] =
    useState<WingScores>({});

  const [
    reasoningScores,
    setReasoningScores,
  ] = useState<ReasoningScores>({});

  const [
    missionHistory,
    setMissionHistory,
  ] = useState<MissionHistoryItem[]>([]);

  const scene =
    activeMissionScenes[sceneIndex];

  /*
    IMPORTANT:
    controllerScene is either the actual Mission 03
    ControllerMissionScene object or null.

    This replaces the old boolean controllerMission.
  */
  const controllerScene =
    isControllerMission(scene)
      ? scene
      : null;

  const previousDecision =
    missionHistory.length > 0
      ? missionHistory[
          missionHistory.length - 1
        ]
      : null;

  const visibleTelemetry = useMemo(() => {
    if (
      controllerScene ||
      !previewOption
    ) {
      return scene.telemetry;
    }

    return mergeTelemetry(
      scene.telemetry,
      previewOption.telemetryChanges,
    );
  }, [
    controllerScene,
    previewOption,
    scene.telemetry,
  ]);

  const projectedLabels = useMemo(() => {
    return new Set(
      previewOption?.telemetryChanges.map(
        (item) => item.label,
      ) ?? [],
    );
  }, [previewOption]);

  const hasNextBuiltScene =
    sceneIndex <
    activeMissionScenes.length - 1;

  function advanceMission() {
    if (!hasNextBuiltScene) {
      return;
    }

    setSceneIndex(
      (current) => current + 1,
    );

    setPreviewOption(null);
    setCommittedOption(null);

    setControllerLocked(false);
    setControllerResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showDecisionFlash(
    title: string,
    effects: TelemetryItem[],
  ) {
    setCommitFlash({
      title,
      effects,
      continues: hasNextBuiltScene,
    });

    window.setTimeout(() => {
      setCommitFlash(null);

      if (hasNextBuiltScene) {
        advanceMission();
      }
    }, 1200);
  }

  function handleChoose(
    option: MissionOption,
  ) {
    if (committedOption) {
      return;
    }

    setPreviewOption(option);
  }

  function handleChoiceCommit() {
    if (
      !previewOption ||
      committedOption ||
      controllerScene
    ) {
      return;
    }

    const nextWingScores = addScores(
      wingScores,
      previewOption.scores.wings,
    );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        previewOption.scores.reasoning,
      );

    const historyItem: MissionHistoryItem =
      {
        sceneId: scene.id,
        phase: scene.phase,
        title: previewOption.title,
        consequence:
          previewOption.consequence,
        effects:
          previewOption.telemetryChanges,
      };

    const nextHistory = [
      ...missionHistory,
      historyItem,
    ];

    setWingScores(nextWingScores);

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory(nextHistory);

    setCommittedOption(previewOption);

    console.group(
      `AltWing WingMatch — Mission ${String(
        scene.missionNumber,
      ).padStart(2, "0")}`,
    );

    console.log(
      "Decision:",
      previewOption.title,
    );

    console.log(
      "Cumulative Wing scores:",
      nextWingScores,
    );

    console.log(
      "Cumulative Reasoning scores:",
      nextReasoningScores,
    );

    console.log(
      "Mission history:",
      nextHistory,
    );

    console.groupEnd();

    showDecisionFlash(
      previewOption.title,
      previewOption.telemetryChanges,
    );
  }

  function handleControllerLock(
    result: ControllerTuningResult,
  ) {
    if (
      !controllerScene ||
      controllerLocked
    ) {
      return;
    }

    /*
      Mission 03 scores behavior,
      not just the final slider value.

      Testing several settings increases
      iteration / feedback-control signals.
    */
    const iterationScore =
      result.adjustments >= 3
        ? 3
        : result.adjustments >= 1
          ? 2
          : 1;

    const feedbackScore =
      result.adjustments >= 2
        ? 3
        : 2;

    const quantitativeScore =
      result.adjustments >= 2
        ? 2
        : 1;

    const optimizationScore =
      result.responseState === "balanced"
        ? 2
        : 1;

    const incomingWingScores: WingScores =
      {
        gnc: 3,
        systems: 1,
      };

    const incomingReasoningScores: ReasoningScores =
      {
        "feedback-control":
          feedbackScore,

        iteration:
          iterationScore,

        "quantitative-reasoning":
          quantitativeScore,

        optimization:
          optimizationScore,
      };

    const nextWingScores = addScores(
      wingScores,
      incomingWingScores,
    );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const finalGainStatus =
      result.responseState === "balanced"
        ? "nominal"
        : "warning";

    const overshootStatus =
      result.overshoot <= 12
        ? "nominal"
        : "warning";

    const settlingStatus =
      result.settlingTime <= 6
        ? "nominal"
        : "warning";

    const effects: TelemetryItem[] = [
      {
        label: "GAIN",
        value:
          result.value.toFixed(2),
        status: finalGainStatus,
      },

      {
        label: "OVERSHOOT",
        value: `${result.overshoot}%`,
        status: overshootStatus,
      },

      {
        label: "SETTLING",
        value: `${result.settlingTime}s`,
        status: settlingStatus,
      },
    ];

    const consequence =
      result.responseState === "balanced"
        ? "The lander settles toward the commanded attitude without feeding the oscillation."
        : result.responseState === "slow"
          ? "The lander remains stable, but the control response is slow."
          : "The response remains aggressive and continues to overshoot the target.";

    const title =
      `Controller gain ${result.value.toFixed(
        2,
      )}`;

    const historyItem: MissionHistoryItem =
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      };

    const nextHistory = [
      ...missionHistory,
      historyItem,
    ];

    setWingScores(nextWingScores);

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory(nextHistory);

    setControllerResult(result);
    setControllerLocked(true);

    console.group(
      "AltWing WingMatch — Mission 03",
    );

    console.log(
      "Controller result:",
      result,
    );

    console.log(
      "Behavior-based scoring:",
      incomingReasoningScores,
    );

    console.log(
      "Cumulative Wing scores:",
      nextWingScores,
    );

    console.log(
      "Cumulative Reasoning scores:",
      nextReasoningScores,
    );

    console.log(
      "Mission history:",
      nextHistory,
    );

    console.groupEnd();

    showDecisionFlash(
      title,
      effects,
    );
  }

  return (
    <main className="wingmatch-shell">
      {commitFlash && (
        <div
          className="commit-flash"
          role="status"
        >
          <div className="commit-flash-inner">
            <span>
              DECISION COMMITTED
            </span>

            <strong>
              {commitFlash.title}
            </strong>

            <div className="commit-flash-effects">
              {commitFlash.effects.map(
                (change) => (
                  <div key={change.label}>
                    <small>
                      {change.label}
                    </small>

                    <b>
                      {change.value}
                    </b>
                  </div>
                ),
              )}
            </div>

            <p>
              {commitFlash.continues
                ? "MISSION CONTINUES"
                : "MISSION DATA RECORDED"}
            </p>
          </div>
        </div>
      )}

      <header className="wingmatch-header">
        <button
          className="wingmatch-brand"
          type="button"
          onClick={onExit}
          aria-label="Return to AltWing home"
        >
          <span>Alt</span>
          <strong>Wing</strong>
        </button>

        <div className="wingmatch-progress">
          <span>
            MISSION{" "}
            {String(
              scene.missionNumber,
            ).padStart(2, "0")}{" "}
            /{" "}
            {String(
              scene.totalMissions,
            ).padStart(2, "0")}
          </span>

          <div className="wingmatch-progress-track">
            <div
              className="wingmatch-progress-fill"
              style={{
                width: `${
                  (scene.missionNumber /
                    scene.totalMissions) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className="wingmatch-exit"
          onClick={onExit}
        >
          Exit mission
        </button>
      </header>

      <section className="wingmatch-main">
        <div className="wingmatch-flight">
          <div className="wingmatch-flight-topline">
            <div>
              <span className="wingmatch-live-dot" />
              LIVE MISSION
            </div>

            <span>
              {scene.timeRemaining}
            </span>
          </div>

          {sceneIndex > 0 &&
            previousDecision && (
              <div className="mission-continuity">
                <div className="mission-continuity-label">
                  PREVIOUS DECISION
                </div>

                <div className="mission-continuity-main">
                  <strong>
                    {
                      previousDecision.title
                    }
                  </strong>

                  <span>
                    {
                      previousDecision.phase
                    }
                  </span>
                </div>

                <div className="mission-continuity-effects">
                  {previousDecision.effects.map(
                    (change) => (
                      <div
                        key={
                          change.label
                        }
                      >
                        <small>
                          {
                            change.label
                          }
                        </small>

                        <b>
                          {
                            change.value
                          }
                        </b>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {!controllerScene && (
            <MissionVisual
              sceneId={scene.id}
              altitude={scene.altitude}
              previewOptionId={
                previewOption?.id
              }
            />
          )}

          <div className="wingmatch-phase">
            <span>
              {scene.phase}
            </span>

            <h1>
              {scene.situation}
            </h1>
          </div>

          {!controllerScene &&
            previewOption &&
            !committedOption && (
              <div className="projected-effect">
                <div className="projected-effect-heading">
                  PROJECTED EFFECT
                </div>

                <div className="projected-effect-items">
                  {previewOption.telemetryChanges.map(
                    (change) => (
                      <div
                        className={`projected-effect-item projected-effect-item--${
                          change.status ??
                          "nominal"
                        }`}
                        key={
                          change.label
                        }
                      >
                        <span>
                          {
                            change.label
                          }
                        </span>

                        <strong>
                          {
                            change.value
                          }
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          <div className="wingmatch-telemetry">
            {visibleTelemetry.map(
              (item) => {
                const isProjected =
                  projectedLabels.has(
                    item.label,
                  );

                return (
                  <div
                    className={[
                      "wingmatch-metric",

                      `wingmatch-metric--${
                        item.status ??
                        "nominal"
                      }`,

                      isProjected
                        ? "wingmatch-metric--projected"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={item.label}
                  >
                    <div className="wingmatch-metric-heading">
                      <span>
                        {item.label}
                      </span>

                      {isProjected &&
                        !committedOption && (
                          <em>
                            PROJECTED
                          </em>
                        )}
                    </div>

                    <strong>
                      {item.value}
                    </strong>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <aside className="decision-panel">
          <div className="decision-kicker">
            {controllerScene
              ? "FLIGHT CONTROL"
              : `DECISION ${String(
                  scene.missionNumber,
                ).padStart(2, "0")}`}
          </div>

          <h2>
            {scene.question}
          </h2>

          {controllerScene ? (
            <>
              <p className="decision-hint">
                Change the gain and watch
                how the vehicle responds.
                Test more than one setting
                before you lock it.
              </p>

              <div
                style={{
                  marginTop: "18px",
                }}
              >
                <ControlTuningPanel
                  config={
                    controllerScene.controller
                  }
                  locked={
                    controllerLocked
                  }
                  onLock={
                    handleControllerLock
                  }
                />
              </div>

              {controllerLocked &&
                controllerResult && (
                  <div className="committed-status">
                    <div>
                      <span>
                        CONTROL LOCKED
                      </span>

                      <strong>
                        Gain{" "}
                        {controllerResult.value.toFixed(
                          2,
                        )}
                      </strong>
                    </div>

                    <p>
                      {
                        controllerResult.adjustments
                      }{" "}
                      adjustment
                      {controllerResult.adjustments ===
                      1
                        ? ""
                        : "s"}{" "}
                      tested before
                      commitment.
                    </p>

                    <div className="committed-next">
                      Mission 04 —
                      next build
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <p className="decision-hint">
                No perfect answer. Choose
                the tradeoff you would
                accept.
              </p>

              <div className="decision-options">
                {scene.options.map(
                  (option, index) => {
                    const isSelected =
                      previewOption?.id ===
                      option.id;

                    const isCommitted =
                      committedOption?.id ===
                      option.id;

                    return (
                      <button
                        type="button"
                        key={
                          option.id
                        }
                        className={[
                          "decision-option",

                          isSelected
                            ? "decision-option--selected"
                            : "",

                          isCommitted
                            ? "decision-option--committed"
                            : "",
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(" ")}
                        onClick={() =>
                          handleChoose(
                            option,
                          )
                        }
                        disabled={Boolean(
                          committedOption,
                        )}
                      >
                        <div className="decision-option-number">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="decision-option-copy">
                          <strong>
                            {
                              option.title
                            }
                          </strong>

                          <p>
                            {
                              option.description
                            }
                          </p>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>

              {!committedOption && (
                <button
                  type="button"
                  className="commit-button"
                  disabled={
                    !previewOption
                  }
                  onClick={
                    handleChoiceCommit
                  }
                >
                  {previewOption
                    ? "Commit decision"
                    : "Select a tradeoff"}
                </button>
              )}

              {committedOption &&
                !hasNextBuiltScene && (
                  <div className="committed-status">
                    <div>
                      <span>
                        DECISION COMMITTED
                      </span>

                      <strong>
                        {
                          committedOption.title
                        }
                      </strong>
                    </div>

                    <p>
                      {
                        committedOption.consequence
                      }
                    </p>
                  </div>
                )}
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

export default WingMatchMission;