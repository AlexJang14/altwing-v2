import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  PLAYER_PROGRESS_EVENT,
  readPlayerProgress,
  type PlayerProgress,
} from "./progression";

import {
  COSMIC_DISCOVERY_EVENT,
  readCosmicCollection,
  type CosmicCollection,
} from "./cosmic";

import {
  readCosmicPackInventory,
  type CosmicPackInventory,
} from "./cosmic-packs";

import {
  getImpactSnapshot,
  getNextQuest,
} from "./impact";

import CosmicAtlas from "./CosmicAtlas";
import CosmicPackVault from "./CosmicPackVault";

import "./my-universe.css";


type UniverseTab =
  | "overview"
  | "atlas"
  | "impact";


const ALIAS_KEY =
  "altwing-explorer-alias";


function MyUniversePanel() {
  const [
    progress,
    setProgress,
  ] =
    useState<PlayerProgress>(
      () =>
        readPlayerProgress(),
    );

  const [
    collection,
    setCollection,
  ] =
    useState<CosmicCollection>(
      () =>
        readCosmicCollection(),
    );

  const [
    packInventory,
    setPackInventory,
  ] =
    useState<CosmicPackInventory>(
      () =>
        readCosmicPackInventory(),
    );

  const [
    alias,
    setAlias,
  ] =
    useState(
      () =>
        localStorage.getItem(
          ALIAS_KEY,
        ) ??
        "Explorer",
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<UniverseTab>(
      "overview",
    );

  const [
    copied,
    setCopied,
  ] =
    useState(false);


  useEffect(() => {
    const refresh = () => {
      setProgress(
        readPlayerProgress(),
      );

      setCollection(
        readCosmicCollection(),
      );

      setPackInventory(
        readCosmicPackInventory(),
      );
    };

    window.addEventListener(
      PLAYER_PROGRESS_EVENT,
      refresh,
    );

    window.addEventListener(
      COSMIC_DISCOVERY_EVENT,
      refresh,
    );

    window.addEventListener(
      "altwing:cosmic-pack-awarded",
      refresh,
    );

    window.addEventListener(
      "altwing:cosmic-pack-opened",
      refresh,
    );

    return () => {
      window.removeEventListener(
        PLAYER_PROGRESS_EVENT,
        refresh,
      );

      window.removeEventListener(
        COSMIC_DISCOVERY_EVENT,
        refresh,
      );

      window.removeEventListener(
        "altwing:cosmic-pack-awarded",
        refresh,
      );

      window.removeEventListener(
        "altwing:cosmic-pack-opened",
        refresh,
      );
    };
  }, []);


  const impact =
    useMemo(
      () =>
        getImpactSnapshot(
          progress,
          collection,
        ),
      [
        progress,
        collection,
      ],
    );


  const nextQuest =
    useMemo(
      () =>
        getNextQuest(
          progress,
        ),
      [progress],
    );


  const unopenedCount =
    useMemo(
      () =>
        packInventory.packs.filter(
          (pack) =>
            !pack.openedAt,
        ).length,
      [packInventory],
    );


  const scoreBreakdown =
    useMemo(() => {
      const missionScore =
        impact.missions * 20;

      const wingScore =
        impact.campaignComplete
          ? 100
          : 0;

      const buildScore =
        impact.builds * 200;

      const evidenceScore =
        impact.evidence * 250;

      const leadershipScore =
        impact.leadership * 300;

      const discoveryScore =
        Math.max(
          0,
          impact.explorerScore -
          missionScore -
          wingScore -
          buildScore -
          evidenceScore -
          leadershipScore,
        );

      return [
        {
          label: "MISSIONS",
          value: missionScore,
        },
        {
          label: "WING",
          value: wingScore,
        },
        {
          label: "BUILDS",
          value: buildScore,
        },
        {
          label: "EVIDENCE",
          value: evidenceScore,
        },
        {
          label: "LEADERSHIP",
          value: leadershipScore,
        },
        {
          label: "DISCOVERY",
          value: discoveryScore,
        },
      ];
    }, [impact]);


  const milestones =
    progress.completedMilestones;


  const missionLeadUnlocked =
    milestones.includes(
      "leadership:crew:verified:1",
    );

  const threeExplorersUnlocked =
    milestones.includes(
      "leadership:crew:verified:3",
    );

  const communityUnlocked =
    milestones.includes(
      "leadership:community:verified:5",
    );


  const updateAlias = (
    value: string,
  ) => {
    const next =
      value.slice(0, 20);

    setAlias(next);

    localStorage.setItem(
      ALIAS_KEY,
      next,
    );
  };


  const copyProfile = () => {
    const summary = [
      "ALTWING EXPLORER PROFILE",
      "",
      `${alias || "Explorer"}`,
      `LV.${impact.level} · ${impact.rank}`,
      "",
      `Missions: ${impact.missions}`,
      `Builds: ${impact.builds}`,
      `Evidence: ${impact.evidence}`,
      `Leadership milestones: ${impact.leadership}`,
      `Cosmic Atlas: ${impact.discoveries}/36`,
      `Explorer Score: ${impact.explorerScore}`,
      `Rarest Find: ${
        impact.rarest
          ? `${impact.rarest.name} · ${impact.rarest.rarity}`
          : "None yet"
      }`,
    ].join("\n");

    void navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(false),
          1500,
        );
      })
      .catch(() => {
        setCopied(false);
      });
  };


  return (
    <section className="my-universe-panel">

      <div className="universe-profile">
        <div className="universe-avatar">
          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />
        </div>

        <div>
          <small>
            MY UNIVERSE
          </small>

          <h2>
            LV.{impact.level}
            {" · "}
            {impact.rank}
          </h2>

          <label>
            EXPLORER ALIAS

            <input
              value={alias}
              onChange={(event) =>
                updateAlias(
                  event.target.value,
                )
              }
              aria-label="Explorer alias"
            />
          </label>
        </div>

        <strong>
          {impact.xp}
          <span> XP</span>
        </strong>
      </div>


      <nav
        className="universe-tabs"
        aria-label="My Universe sections"
      >
        <button
          type="button"
          className={
            activeTab ===
            "overview"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "overview",
            )
          }
        >
          OVERVIEW

          {unopenedCount > 0 && (
            <b>
              {unopenedCount}
            </b>
          )}
        </button>

        <button
          type="button"
          className={
            activeTab ===
            "atlas"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "atlas",
            )
          }
        >
          ATLAS

          <span>
            {impact.discoveries}
            /36
          </span>
        </button>

        <button
          type="button"
          className={
            activeTab ===
            "impact"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "impact",
            )
          }
        >
          IMPACT
        </button>
      </nav>


      {activeTab ===
        "overview" && (
        <div className="universe-tab-panel">

          <div className="universe-next">
            <div>
              <span>
                NEXT QUEST ·
                {" "}
                {nextQuest.stage}
              </span>

              <h3>
                {nextQuest.title}
              </h3>

              <p>
                {nextQuest.detail}
              </p>
            </div>

            <b>→</b>
          </div>


          <div className="universe-overview-stats">
            <article>
              <b>
                {impact.missions}
              </b>
              <span>
                MISSIONS
              </span>
            </article>

            <article>
              <b>
                {impact.builds}
              </b>
              <span>
                BUILDS
              </span>
            </article>

            <article>
              <b>
                {impact.discoveries}
              </b>
              <span>
                DISCOVERIES
              </span>
            </article>

            <article>
              <b>
                {impact.explorerScore}
              </b>
              <span>
                SCORE
              </span>
            </article>
          </div>


          <div className="universe-section-heading">
            <div>
              <small>
                REWARDS
              </small>

              <strong>
                Deep Space Packs
              </strong>
            </div>

            {unopenedCount > 0 && (
              <span>
                {unopenedCount}
                {" "}READY
              </span>
            )}
          </div>

          <CosmicPackVault />

        </div>
      )}


      {activeTab ===
        "atlas" && (
        <div className="universe-tab-panel universe-atlas-panel">

          <div className="universe-tab-intro">
            <span>
              COSMIC COLLECTION
            </span>

            <h3>
              Discover the universe
              by doing.
            </h3>

            <p>
              Open Packs, collect
              celestial objects, and
              tap any discovery to
              learn what makes it
              interesting.
            </p>
          </div>

          <CosmicAtlas />

        </div>
      )}


      {activeTab ===
        "impact" && (
        <div className="universe-tab-panel">

          <div className="universe-impact-hero">
            <div>
              <span>
                EXPLORER SCORE
              </span>

              <strong>
                {
                  impact.explorerScore
                }
              </strong>

              <p>
                Real builds,
                evidence, and
                leadership are worth
                more than clicks.
              </p>
            </div>

            <div>
              <span>
                RAREST FIND
              </span>

              <strong>
                {impact.rarest
                  ? impact.rarest.name
                  : "None yet"}
              </strong>

              <p>
                {impact.rarest
                  ? impact.rarest.rarity
                  : "Open your first Pack"}
              </p>
            </div>
          </div>


          <div className="universe-section-heading">
            <div>
              <small>
                SCORE BREAKDOWN
              </small>

              <strong>
                How your impact grows
              </strong>
            </div>
          </div>

          <div className="universe-score-breakdown">
            {scoreBreakdown.map(
              (item) => (
                <article
                  key={item.label}
                >
                  <span>
                    {item.label}
                  </span>

                  <strong>
                    +{item.value}
                  </strong>
                </article>
              ),
            )}
          </div>


          <div className="universe-section-heading">
            <div>
              <small>
                LEADERSHIP PATH
              </small>

              <strong>
                Earn leadership by
                creating impact.
              </strong>
            </div>
          </div>


          <div className="universe-leadership-path">
            <article
              className={
                missionLeadUnlocked
                  ? "complete"
                  : ""
              }
            >
              <b>01</b>

              <div>
                <span>
                  MISSION LEAD
                </span>

                <strong>
                  Help 1 explorer
                  launch a verified
                  Build.
                </strong>
              </div>

              <em>
                {missionLeadUnlocked
                  ? "✓"
                  : "LOCKED"}
              </em>
            </article>


            <article
              className={
                threeExplorersUnlocked
                  ? "complete"
                  : ""
              }
            >
              <b>02</b>

              <div>
                <span>
                  CREW LEADER
                </span>

                <strong>
                  Help 3 explorers
                  launch verified
                  Builds.
                </strong>
              </div>

              <em>
                {threeExplorersUnlocked
                  ? "✓"
                  : "LOCKED"}
              </em>
            </article>


            <article
              className={
                communityUnlocked
                  ? "complete"
                  : ""
              }
            >
              <b>03</b>

              <div>
                <span>
                  COMMUNITY BUILDER
                </span>

                <strong>
                  Create sustained,
                  verified peer
                  impact.
                </strong>
              </div>

              <em>
                {communityUnlocked
                  ? "✓"
                  : "LOCKED"}
              </em>
            </article>
          </div>


          <div className="universe-section-heading">
            <div>
              <small>
                EXPLORER PROFILE
              </small>

              <strong>
                A snapshot of what
                you&apos;ve actually
                done.
              </strong>
            </div>
          </div>


          <div className="universe-profile-snapshot">
            <div>
              <span>
                {alias || "Explorer"}
              </span>

              <h3>
                LV.{impact.level}
                {" · "}
                {impact.rank}
              </h3>

              <p>
                {
                  impact.missions
                }{" "}
                missions ·
                {" "}
                {
                  impact.builds
                }{" "}
                builds ·
                {" "}
                {
                  impact.evidence
                }{" "}
                evidence ·
                {" "}
                {
                  impact.discoveries
                }
                /36 discoveries
              </p>
            </div>

            <button
              type="button"
              onClick={
                copyProfile
              }
            >
              {copied
                ? "COPIED ✓"
                : "COPY PROFILE"}
            </button>
          </div>


          <div className="universe-global-board">
            <div>
              <span>
                GLOBAL LEADERBOARD
              </span>

              <strong>
                VERIFIED ACCOUNTS REQUIRED
              </strong>
            </div>

            <b>
              COMING WITH PILOT
            </b>

            <p>
              AltWing will not invent
              rankings. Global scores,
              rare finds, and Crew
              impact activate only
              when real users can be
              verified.
            </p>
          </div>

        </div>
      )}

    </section>
  );
}


export default MyUniversePanel;
