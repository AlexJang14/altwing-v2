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
  const scene = missionScenes[0];

  const [previewOption, setPreviewOption] =
    useState<MissionOption | null>(null);

  const [committedOption, setCommittedOption] =
    useState<MissionOption | null>(null);

  const [wingScores, setWingScores] = useState<WingScores>({});
  const [reasoningScores, setReasoningScores] =
    useState<ReasoningScores>({});

  const visibleTelemetry = useMemo(() => {
    if (!previewOption) {
      return scene.telemetry;
    }

    return mergeTelemetry(
      scene.telemetry,
      previewOption.telemetryChanges,
    );
  }, [previewOption, scene.telemetry]);

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

    setWingScores(nextWingScores);
    setReasoningScores(nextReasoningScores);
    setCommittedOption(previewOption);

    console.group("AltWing WingMatch — Mission 01");
    console.log("Decision:", previewOption.title);
    console.log("Wing scores:", nextWingScores);
    console.log("Reasoning scores:", nextReasoningScores);
    console.groupEnd();
  }

  return (
    <main className="wingmatch-shell">
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

          <div className="entry-visual" aria-hidden="true">
            <div className="entry-stars" />

            <svg
              className="entry-trajectory"
              viewBox="0 0 600 330"
            >
              <path
                d="M 70 55 C 185 55, 335 85, 455 220"
                className="entry-path"
              />

              <circle
                cx="70"
                cy="55"
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

          <div className="wingmatch-telemetry">
            {visibleTelemetry.map((item) => (
              <div
                className={`wingmatch-metric wingmatch-metric--${
                  item.status ?? "nominal"
                }`}
                key={item.label}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <aside className="decision-panel">
          <div className="decision-kicker">
            DECISION {String(scene.missionNumber).padStart(2, "0")}
          </div>

          <h2>{scene.question}</h2>

          <p className="decision-hint">
            There is no single perfect answer. Choose what you would
            prioritize with the information you have.
          </p>

          <div className="decision-options">
            {scene.options.map((option, index) => {
              const isSelected =
                previewOption?.id === option.id;

              const isCommitted =
                committedOption?.id === option.id;

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

                  <div>
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
                : "Choose an approach"}
            </button>
          )}

          {committedOption && (
            <div className="decision-result">
              <div className="decision-result-label">
                DECISION LOGGED
              </div>

              <h3>{committedOption.title}</h3>

              <p>{committedOption.consequence}</p>

              <div className="decision-result-status">
                Mission response recorded.
              </div>

              <button
                type="button"
                className="next-mission-placeholder"
                disabled
              >
                Mission 02 — next build
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default WingMatchMission;