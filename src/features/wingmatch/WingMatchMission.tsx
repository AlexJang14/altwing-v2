import { useMemo, useState } from "react";
import { missionScenes } from "./missionScenes";
import type {
  MissionOption,
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

interface DecisionHistoryItem {
  sceneId: string;
  phase: string;
  option: MissionOption;
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

    next[typedKey] = (next[typedKey] ?? 0) + value;
  });

  return next;
}

function WingMatchMission({ onExit }: WingMatchMissionProps) {
  const [sceneIndex, setSceneIndex] = useState(0);

  const [previewOption, setPreviewOption] =
    useState<MissionOption | null>(null);

  const [committedOption, setCommittedOption] =
    useState<MissionOption | null>(null);

  const [showCommitFlash, setShowCommitFlash] = useState(false);

  const [wingScores, setWingScores] = useState<WingScores>({});
  const [reasoningScores, setReasoningScores] =
    useState<ReasoningScores>({});

  const [decisionHistory, setDecisionHistory] = useState<
    DecisionHistoryItem[]
  >([]);

  const scene = missionScenes[sceneIndex];

  const previousDecision =
    decisionHistory.length > 0
      ? decisionHistory[decisionHistory.length - 1]
      : null;

  const visibleTelemetry = useMemo(() => {
    if (!previewOption) {
      return scene.telemetry;
    }

    return mergeTelemetry(
      scene.telemetry,
      previewOption.telemetryChanges,
    );
  }, [previewOption, scene.telemetry]);

  const projectedLabels = useMemo(() => {
    return new Set(
      previewOption?.telemetryChanges.map((item) => item.label) ?? [],
    );
  }, [previewOption]);

  const hasNextBuiltScene =
    sceneIndex < missionScenes.length - 1;

  function handleChoose(option: MissionOption) {
    if (committedOption) {
      return;
    }

    setPreviewOption(option);
  }

  function handleCommit() {
    if (!previewOption || committedOption) {
      return;
    }

    const nextWingScores = addScores(
      wingScores,
      previewOption.scores.wings,
    );

    const nextReasoningScores = addScores(
      reasoningScores,
      previewOption.scores.reasoning,
    );

    const nextHistoryItem: DecisionHistoryItem = {
      sceneId: scene.id,
      phase: scene.phase,
      option: previewOption,
    };

    const nextHistory = [
      ...decisionHistory,
      nextHistoryItem,
    ];

    setWingScores(nextWingScores);
    setReasoningScores(nextReasoningScores);
    setDecisionHistory(nextHistory);
    setCommittedOption(previewOption);
    setShowCommitFlash(true);

    console.group(
      `AltWing WingMatch — Mission ${String(
        scene.missionNumber,
      ).padStart(2, "0")}`,
    );

    console.log("Decision:", previewOption.title);
    console.log("Cumulative Wing scores:", nextWingScores);
    console.log(
      "Cumulative Reasoning scores:",
      nextReasoningScores,
    );
    console.log("Decision history:", nextHistory);

    console.groupEnd();

    window.setTimeout(() => {
      setShowCommitFlash(false);

      if (hasNextBuiltScene) {
        setSceneIndex((current) => current + 1);
        setPreviewOption(null);
        setCommittedOption(null);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 1200);
  }

  return (
    <main className="wingmatch-shell">
      {showCommitFlash && committedOption && (
        <div className="commit-flash" role="status">
          <div className="commit-flash-inner">
            <span>DECISION COMMITTED</span>

            <strong>{committedOption.title}</strong>

            <div className="commit-flash-effects">
              {committedOption.telemetryChanges.map((change) => (
                <div key={change.label}>
                  <small>{change.label}</small>
                  <b>{change.value}</b>
                </div>
              ))}
            </div>

            <p>
              {hasNextBuiltScene
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
            MISSION {String(scene.missionNumber).padStart(2, "0")} /{" "}
            {String(scene.totalMissions).padStart(2, "0")}
          </span>

          <div className="wingmatch-progress-track">
            <div
              className="wingmatch-progress-fill"
              style={{
                width: `${
                  (scene.missionNumber / scene.totalMissions) * 100
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

            <span>{scene.timeRemaining}</span>
          </div>

          {sceneIndex > 0 && previousDecision && (
            <div className="mission-continuity">
              <div className="mission-continuity-label">
                PREVIOUS DECISION
              </div>

              <div className="mission-continuity-main">
                <strong>{previousDecision.option.title}</strong>

                <span>{previousDecision.phase}</span>
              </div>

              <div className="mission-continuity-effects">
                {previousDecision.option.telemetryChanges.map(
                  (change) => (
                    <div key={change.label}>
                      <small>{change.label}</small>
                      <b>{change.value}</b>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="entry-visual" aria-hidden="true">
            <div className="entry-stars" />

            <svg
              className="entry-trajectory"
              viewBox="0 0 600 330"
            >
              <path
                d={
                  sceneIndex === 0
                    ? "M 70 55 C 185 55, 335 85, 455 220"
                    : "M 80 78 C 210 94, 340 120, 470 230"
                }
                className="entry-path"
              />

              <circle
                cx={sceneIndex === 0 ? "70" : "80"}
                cy={sceneIndex === 0 ? "55" : "78"}
                r="5"
                className="entry-start"
              />
            </svg>

            <div
              className={`entry-capsule ${
                previewOption ? "entry-capsule--active" : ""
              }`}
            >
              <div className="entry-capsule-body" />
              <div className="entry-capsule-flame" />
            </div>

            <div className="entry-atmosphere" />

            <div className="entry-mars">
              <div className="entry-mars-glow" />
            </div>

            <div className="entry-altitude">
              <span>ALTITUDE</span>
              <strong>{scene.altitude}</strong>
            </div>
          </div>

          <div className="wingmatch-phase">
            <span>{scene.phase}</span>

            <h1>{scene.situation}</h1>
          </div>

          {previewOption && !committedOption && (
            <div className="projected-effect">
              <div className="projected-effect-heading">
                PROJECTED EFFECT
              </div>

              <div className="projected-effect-items">
                {previewOption.telemetryChanges.map((change) => (
                  <div
                    className={`projected-effect-item projected-effect-item--${
                      change.status ?? "nominal"
                    }`}
                    key={change.label}
                  >
                    <span>{change.label}</span>
                    <strong>{change.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="wingmatch-telemetry">
            {visibleTelemetry.map((item) => {
              const isProjected = projectedLabels.has(item.label);

              return (
                <div
                  className={[
                    "wingmatch-metric",
                    `wingmatch-metric--${item.status ?? "nominal"}`,
                    isProjected
                      ? "wingmatch-metric--projected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={item.label}
                >
                  <div className="wingmatch-metric-heading">
                    <span>{item.label}</span>

                    {isProjected && !committedOption && (
                      <em>PROJECTED</em>
                    )}
                  </div>

                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="decision-panel">
          <div className="decision-kicker">
            DECISION {String(scene.missionNumber).padStart(2, "0")}
          </div>

          <h2>{scene.question}</h2>

          <p className="decision-hint">
            No perfect answer. Choose the tradeoff you would accept.
          </p>

          <div className="decision-options">
            {scene.options.map((option, index) => {
              const isSelected = previewOption?.id === option.id;
              const isCommitted = committedOption?.id === option.id;

              return (
                <button
                  type="button"
                  key={option.id}
                  className={[
                    "decision-option",
                    isSelected
                      ? "decision-option--selected"
                      : "",
                    isCommitted
                      ? "decision-option--committed"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleChoose(option)}
                  disabled={Boolean(committedOption)}
                >
                  <div className="decision-option-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="decision-option-copy">
                    <strong>{option.title}</strong>
                    <p>{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {!committedOption && (
            <button
              type="button"
              className="commit-button"
              disabled={!previewOption}
              onClick={handleCommit}
            >
              {previewOption
                ? "Commit decision"
                : "Select a tradeoff"}
            </button>
          )}

          {committedOption && !hasNextBuiltScene && (
            <div className="committed-status">
              <div>
                <span>DECISION COMMITTED</span>
                <strong>{committedOption.title}</strong>
              </div>

              <p>{committedOption.consequence}</p>

              <div className="committed-next">
                Mission 03 — next build
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default WingMatchMission;