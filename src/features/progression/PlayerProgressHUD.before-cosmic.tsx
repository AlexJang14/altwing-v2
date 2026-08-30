
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

function PlayerProgressHUD() {
  const [progress, setProgress] =
    useState<PlayerProgress>(
      () => readPlayerProgress(),
    );

  const [open, setOpen] =
    useState(false);

  const [reward, setReward] =
    useState<ProgressAwardDetail | null>(
      null,
    );

  useEffect(() => {
    let timer:
      number | undefined;

    const handler = (
      event: Event,
    ) => {
      const custom =
        event as CustomEvent<ProgressAwardDetail>;

      setProgress(
        custom.detail.current,
      );

      setReward(
        custom.detail,
      );

      if (timer) {
        window.clearTimeout(timer);
      }

      timer =
        window.setTimeout(
          () => setReward(null),
          1900,
        );
    };

    window.addEventListener(
      PLAYER_PROGRESS_EVENT,
      handler,
    );

    return () => {
      window.removeEventListener(
        PLAYER_PROGRESS_EVENT,
        handler,
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

  const floor =
    getLevelFloorXP(level);

  const next =
    getNextLevelXP(level);

  const levelPercent =
    useMemo(() => {
      if (next === null) {
        return 100;
      }

      const span =
        next - floor;

      if (span <= 0) {
        return 100;
      }

      return Math.max(
        0,
        Math.min(
          100,
          ((progress.xp - floor) /
            span) *
            100,
        ),
      );
    }, [
      progress.xp,
      floor,
      next,
    ]);

  const milestones =
    progress.completedMilestones;

  const missionCount =
    milestones.filter(
      (id) =>
        id.startsWith(
          "aerospace:mission:",
        ),
    ).length;

  const campaignComplete =
    milestones.includes(
      "aerospace:wingmatch:complete",
    );

  const hasProject =
    milestones.some(
      (id) =>
        id.startsWith("project:"),
    );

  const hasEvidence =
    milestones.some(
      (id) =>
        id.startsWith("evidence:"),
    );

  const hasLed =
    milestones.some(
      (id) =>
        id.startsWith(
          "leadership:",
        ),
    );

  const worldProgress =
    Math.min(
      100,
      Math.round(
        missionCount * 8 +
        (campaignComplete ? 20 : 0) +
        (hasProject ? 20 : 0),
      ),
    );

  const systems =
    progress.skills
      .systemsThinking;

  const tradeoffs =
    progress.skills
      .tradeoffs;

  const evidence =
    progress.skills
      .evidenceReasoning;

  const build =
    progress.skills
      .technicalBuild;

  const leadership =
    progress.skills
      .leadership;

  return (
    <>
      {reward && (
        <div
          className={[
            "rpg-reward-toast",
            reward.currentLevel >
            reward.previousLevel
              ? "level-up"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <div>
            <span>
              {reward.currentLevel >
              reward.previousLevel
                ? "LEVEL UP"
                : `+${reward.xpReward} XP`}
            </span>

            <strong>
              {reward.currentLevel >
              reward.previousLevel
                ? `LV.${reward.currentLevel} · ${getPlayerRank(
                    reward.currentLevel,
                  )}`
                : reward.label}
            </strong>
          </div>
        </div>
      )}

      <button
        className="rpg-compact-hud"
        type="button"
        onClick={() =>
          setOpen(true)
        }
      >
        <div className="rpg-mini-avatar">
          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <b>{level}</b>
        </div>

        <div>
          <small>
            AEROSPACE WORLD
          </small>

          <strong>
            LV.{level} · {rank}
          </strong>

          <div className="rpg-mini-xp">
            <i>
              <span
                style={{
                  width:
                    `${levelPercent}%`,
                }}
              />
            </i>

            <em>
              {progress.xp} XP
            </em>
          </div>
        </div>
      </button>

      <aside
        className={[
          "rpg-drawer",
          open
            ? "rpg-drawer--open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="rpg-drawer-header">
          <div>
            <small>
              PLAYER PROFILE
            </small>

            <h2>
              AEROSPACE
              <span> WORLD</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
          >
            ×
          </button>
        </header>

        <div className="rpg-drawer-content">

          <section className="rpg-profile-card">
            <div className="rpg-big-avatar">
              <img
                src="/brand/altwing-penguin.png"
                alt=""
              />

              <b>
                LV.{level}
              </b>
            </div>

            <div>
              <small>
                CURRENT RANK
              </small>

              <h3>{rank}</h3>

              <div className="rpg-main-xp">
                <span
                  style={{
                    width:
                      `${levelPercent}%`,
                  }}
                />
              </div>

              <p>
                {progress.xp}
                {next !== null
                  ? ` / ${next} XP`
                  : " XP"}
              </p>
            </div>
          </section>

          <section className="rpg-card">
            <div className="rpg-heading">
              <div>
                <small>
                  WORLD PROGRESS
                </small>

                <strong>
                  MARS DESCENT
                </strong>
              </div>

              <b>
                {worldProgress}%
              </b>
            </div>

            <div className="rpg-world-bar">
              <span
                style={{
                  width:
                    `${worldProgress}%`,
                }}
              />
            </div>

            <div className="rpg-stats">
              <div>
                <b>
                  {missionCount}
                </b>
                <span>
                  MISSIONS
                </span>
              </div>

              <div>
                <b>
                  {campaignComplete
                    ? 1
                    : 0}
                </b>
                <span>
                  WINGS
                </span>
              </div>

              <div>
                <b>
                  {hasProject
                    ? 1
                    : 0}
                </b>
                <span>
                  BUILDS
                </span>
              </div>
            </div>
          </section>

          <section>
            <div className="rpg-section-title">
              <div>
                <small>
                  SKILL TREE
                </small>

                <strong>
                  AEROSPACE CORE
                </strong>
              </div>

              <span>
                GROW BY DOING
              </span>
            </div>

            <div className="rpg-skill-tree">
              <div
                className={[
                  "rpg-node",
                  "systems",
                  systems > 0
                    ? "unlocked"
                    : "",
                ].join(" ")}
              >
                <b>SYS</b>
                <span>
                  SYSTEMS
                </span>
                <small>
                  LV.
                  {Math.min(
                    6,
                    systems,
                  )}
                </small>
              </div>

              <i className="link link-a" />
              <i className="link link-b" />
              <i className="link link-c" />
              <i className="link link-d" />

              <div
                className={[
                  "rpg-node",
                  "tradeoffs",
                  tradeoffs > 0
                    ? "unlocked"
                    : "",
                ].join(" ")}
              >
                <b>TRD</b>
                <span>
                  TRADEOFF
                </span>
                <small>
                  LV.
                  {Math.min(
                    6,
                    tradeoffs,
                  )}
                </small>
              </div>

              <div
                className={[
                  "rpg-node",
                  "evidence",
                  evidence > 0
                    ? "unlocked"
                    : "",
                ].join(" ")}
              >
                <b>EVD</b>
                <span>
                  EVIDENCE
                </span>
                <small>
                  LV.
                  {Math.min(
                    6,
                    evidence,
                  )}
                </small>
              </div>

              <div
                className={[
                  "rpg-node",
                  "build",
                  build > 0 ||
                  hasProject
                    ? "unlocked"
                    : "",
                ].join(" ")}
              >
                <b>BLD</b>
                <span>
                  BUILD
                </span>
                <small>
                  LV.
                  {Math.min(
                    6,
                    build,
                  )}
                </small>
              </div>

              <div
                className={[
                  "rpg-node",
                  "leadership",
                  leadership > 0 ||
                  hasLed
                    ? "unlocked"
                    : "",
                ].join(" ")}
              >
                <b>LDR</b>
                <span>
                  LEAD
                </span>
                <small>
                  LV.
                  {Math.min(
                    6,
                    leadership,
                  )}
                </small>
              </div>
            </div>
          </section>

          <section>
            <div className="rpg-section-title">
              <div>
                <small>
                  QUEST LOG
                </small>

                <strong>
                  ACTIVE PATH
                </strong>
              </div>

              <span>
                REAL ACTION
              </span>
            </div>

            <div className="rpg-quests">

              <div
                className={
                  campaignComplete
                    ? "quest done"
                    : "quest active"
                }
              >
                <b>
                  {campaignComplete
                    ? "✓"
                    : "01"}
                </b>

                <div>
                  <strong>
                    Finish Aerospace Campaign
                  </strong>

                  <span>
                    Reveal your first Wing
                  </span>
                </div>

                <em>
                  +50 XP
                </em>
              </div>

              <div
                className={
                  hasProject
                    ? "quest done"
                    : campaignComplete
                      ? "quest active"
                      : "quest locked"
                }
              >
                <b>
                  {hasProject
                    ? "✓"
                    : campaignComplete
                      ? "02"
                      : "🔒"}
                </b>

                <div>
                  <strong>
                    Launch First Build
                  </strong>

                  <span>
                    Build something real
                  </span>
                </div>

                <em>
                  +100 XP
                </em>
              </div>

              <div
                className={
                  hasEvidence
                    ? "quest done"
                    : hasProject
                      ? "quest active"
                      : "quest locked"
                }
              >
                <b>
                  {hasEvidence
                    ? "✓"
                    : hasProject
                      ? "03"
                      : "🔒"}
                </b>

                <div>
                  <strong>
                    Publish Evidence
                  </strong>

                  <span>
                    Test, improve, share
                  </span>
                </div>

                <em>
                  +175 XP
                </em>
              </div>

              <div
                className={
                  hasLed
                    ? "quest done"
                    : hasEvidence
                      ? "quest active"
                      : "quest locked"
                }
              >
                <b>
                  {hasLed
                    ? "✓"
                    : hasEvidence
                      ? "04"
                      : "🔒"}
                </b>

                <div>
                  <strong>
                    Lead a Crew
                  </strong>

                  <span>
                    Help others build
                  </span>
                </div>

                <em>
                  +350 XP
                </em>
              </div>

            </div>
          </section>

          <section>
            <div className="rpg-section-title">
              <div>
                <small>
                  LEADERSHIP PATH
                </small>

                <strong>
                  IMPACT &gt; TITLE
                </strong>
              </div>
            </div>

            <div className="rpg-lead-path">
              <div className="done">
                <b>01</b>
                <span>
                  EXPLORER
                  <small>
                    Try the work
                  </small>
                </span>
              </div>

              <i />

              <div
                className={
                  hasProject
                    ? "done"
                    : ""
                }
              >
                <b>02</b>
                <span>
                  BUILDER
                  <small>
                    Build something real
                  </small>
                </span>
              </div>

              <i />

              <div
                className={
                  hasEvidence
                    ? "done"
                    : ""
                }
              >
                <b>03</b>
                <span>
                  CREATOR
                  <small>
                    Publish evidence
                  </small>
                </span>
              </div>

              <i />

              <div
                className={
                  hasLed
                    ? "done"
                    : ""
                }
              >
                <b>04</b>
                <span>
                  MISSION LEAD
                  <small>
                    Lead other explorers
                  </small>
                </span>
              </div>

              <i />

              <div>
                <b>05</b>
                <span>
                  COMMUNITY BUILDER
                  <small>
                    Help others launch
                  </small>
                </span>
              </div>
            </div>
          </section>

          <section className="rpg-philosophy">
            <small>
              ALTWING
            </small>

            <strong>
              Your level grows when
              your real-world evidence grows.
            </strong>

            <p>
              Explore in missions.
              Build in the real world.
              Lead when you are ready.
            </p>
          </section>

        </div>
      </aside>
    </>
  );
}

export default PlayerProgressHUD;
