import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getLevelFloorXP,
  getNextLevelXP,
  getPlayerLevel,
  getPlayerRank,
  PLAYER_PROGRESS_EVENT,
  readPlayerProgress,
  type PlayerProgress,
  type ProgressAwardDetail,
} from "./progression";

import "./player-progress.css";

const skillRows = [
  {
    key: "systemsThinking",
    label: "SYSTEMS THINKING",
  },
  {
    key: "tradeoffs",
    label: "TRADEOFFS",
  },
  {
    key: "evidenceReasoning",
    label: "EVIDENCE REASONING",
  },
  {
    key: "technicalBuild",
    label: "TECHNICAL BUILD",
  },
  {
    key: "leadership",
    label: "LEADERSHIP",
  },
] as const;

function PlayerProgressHUD() {
  const [
    progress,
    setProgress,
  ] = useState<PlayerProgress>(
    () => readPlayerProgress(),
  );

  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const [
    reward,
    setReward,
  ] =
    useState<ProgressAwardDetail | null>(
      null,
    );

  useEffect(() => {
    let timer:
      number | undefined;

    const handleProgress = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<ProgressAwardDetail>;

      setProgress(
        customEvent.detail.current,
      );

      setReward(
        customEvent.detail,
      );

      if (timer) {
        window.clearTimeout(timer);
      }

      timer =
        window.setTimeout(() => {
          setReward(null);
        }, 1900);
    };

    window.addEventListener(
      PLAYER_PROGRESS_EVENT,
      handleProgress,
    );

    return () => {
      window.removeEventListener(
        PLAYER_PROGRESS_EVENT,
        handleProgress,
      );

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const level =
    getPlayerLevel(progress.xp);

  const rank =
    getPlayerRank(level);

  const floorXP =
    getLevelFloorXP(level);

  const nextXP =
    getNextLevelXP(level);

  const levelPercent =
    useMemo(() => {
      if (nextXP === null) {
        return 100;
      }

      const range =
        nextXP - floorXP;

      const earned =
        progress.xp - floorXP;

      if (range <= 0) {
        return 100;
      }

      return Math.max(
        0,
        Math.min(
          100,
          (earned / range) * 100,
        ),
      );
    }, [
      progress.xp,
      floorXP,
      nextXP,
    ]);

  const completed =
    progress.completedMilestones;

  const wingMatchComplete =
    completed.includes(
      "aerospace:wingmatch:complete",
    );

  const hasProject =
    completed.some(
      (id) =>
        id.startsWith("project:"),
    );

  const hasEvidence =
    completed.some(
      (id) =>
        id.startsWith("evidence:"),
    );

  const ledCrew =
    completed.some(
      (id) =>
        id.startsWith(
          "leadership:crew",
        ),
    );

  const communityBuilt =
    completed.some(
      (id) =>
        id.startsWith(
          "leadership:community",
        ),
    );

  const nextQuest =
    !wingMatchComplete
      ? "Finish the Aerospace campaign"
      : !hasProject
        ? "Launch your first real build"
        : !hasEvidence
          ? "Test and publish evidence"
          : !ledCrew
            ? "Lead a Crew challenge"
            : !communityBuilt
              ? "Help another explorer launch"
              : "Keep building your impact";

  return (
    <>
      {reward && (
        <div
          className={[
            "rpg-reward-toast",

            reward.currentLevel >
            reward.previousLevel
              ? "rpg-reward-toast--level"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
        >
          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <div>
            {reward.currentLevel >
            reward.previousLevel ? (
              <>
                <span>
                  LEVEL UP
                </span>

                <strong>
                  LV.
                  {
                    reward.currentLevel
                  }{" "}
                  ·{" "}
                  {getPlayerRank(
                    reward.currentLevel,
                  )}
                </strong>
              </>
            ) : (
              <>
                <span>
                  +{reward.xpReward} XP
                </span>

                <strong>
                  {reward.label}
                </strong>
              </>
            )}
          </div>
        </div>
      )}

      <aside
        className={[
          "player-rpg-dock",
          expanded
            ? "player-rpg-dock--open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          className="player-rpg-summary"
          onClick={() =>
            setExpanded(
              (current) => !current,
            )
          }
          aria-expanded={expanded}
        >
          <div className="player-rpg-avatar">
            <img
              src="/brand/altwing-penguin.png"
              alt=""
            />

            <b>
              {level}
            </b>
          </div>

          <div className="player-rpg-summary-copy">
            <small>
              AEROSPACE WORLD
            </small>

            <strong>
              LV.{level} · {rank}
            </strong>

            <div className="player-rpg-xp-line">
              <div>
                <i
                  style={{
                    width:
                      `${levelPercent}%`,
                  }}
                />
              </div>

              <span>
                {progress.xp} XP
              </span>
            </div>
          </div>

          <span className="player-rpg-chevron">
            {expanded ? "×" : "+"}
          </span>
        </button>

        {expanded && (
          <div className="player-rpg-panel">
            <section>
              <div className="player-rpg-section-title">
                <span>
                  SKILL TREE
                </span>

                <small>
                  GROW BY DOING
                </small>
              </div>

              <div className="player-skill-list">
                {skillRows.map(
                  (skill) => {
                    const points =
                      progress.skills[
                        skill.key
                      ];

                    const visibleLevel =
                      Math.min(
                        6,
                        points,
                      );

                    return (
                      <div
                        className="player-skill-row"
                        key={
                          skill.key
                        }
                      >
                        <div>
                          <span>
                            {
                              skill.label
                            }
                          </span>

                          <b>
                            LV.
                            {
                              visibleLevel
                            }
                          </b>
                        </div>

                        <div className="player-skill-track">
                          <i
                            style={{
                              width:
                                `${
                                  (visibleLevel /
                                    6) *
                                  100
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </section>

            <section>
              <div className="player-rpg-section-title">
                <span>
                  LEADERSHIP PATH
                </span>

                <small>
                  IMPACT &gt; TITLE
                </small>
              </div>

              <div className="leadership-path">
                <div className="leadership-step leadership-step--done">
                  <b>01</b>
                  <div>
                    <strong>
                      EXPLORER
                    </strong>
                    <span>
                      Try the work
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    "leadership-step",
                    hasProject
                      ? "leadership-step--done"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <b>02</b>
                  <div>
                    <strong>
                      BUILDER
                    </strong>
                    <span>
                      Build something real
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    "leadership-step",
                    hasEvidence
                      ? "leadership-step--done"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <b>03</b>
                  <div>
                    <strong>
                      CREATOR
                    </strong>
                    <span>
                      Publish evidence
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    "leadership-step",
                    ledCrew
                      ? "leadership-step--done"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <b>04</b>
                  <div>
                    <strong>
                      MISSION LEAD
                    </strong>
                    <span>
                      Lead other explorers
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    "leadership-step",
                    communityBuilt
                      ? "leadership-step--done"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <b>05</b>
                  <div>
                    <strong>
                      COMMUNITY BUILDER
                    </strong>
                    <span>
                      Help others launch
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="player-next-quest">
              <small>
                NEXT QUEST
              </small>

              <strong>
                {nextQuest}
              </strong>

              <p>
                AltWing rewards real
                progress — not clicks.
              </p>
            </section>
          </div>
        )}
      </aside>
    </>
  );
}

export default PlayerProgressHUD;
