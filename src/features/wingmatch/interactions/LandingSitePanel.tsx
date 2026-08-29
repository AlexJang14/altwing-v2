import { useState } from "react";
import "./landing-site.css";

export type LandingSiteId =
  | "site-a"
  | "site-b"
  | "site-c";

export interface LandingSiteResult {
  siteId: LandingSiteId;
  siteName: string;

  slope: number;
  rockRisk: "LOW" | "MEDIUM" | "HIGH";
  scienceValue:
    | "MEDIUM"
    | "HIGH"
    | "VERY HIGH";

  fuelCost: "LOW" | "MEDIUM" | "HIGH";

  comparisons: number;
}

interface LandingSite {
  id: LandingSiteId;
  name: string;

  slope: number;
  rockRisk: "LOW" | "MEDIUM" | "HIGH";
  scienceValue:
    | "MEDIUM"
    | "HIGH"
    | "VERY HIGH";

  fuelCost: "LOW" | "MEDIUM" | "HIGH";

  description: string;

  x: number;
  y: number;
}

interface LandingSitePanelProps {
  locked?: boolean;

  onPreview?: (
    result: LandingSiteResult,
  ) => void;

  onLock?: (
    result: LandingSiteResult,
  ) => void;
}

const sites: LandingSite[] = [
  {
    id: "site-a",

    name: "SITE A",

    slope: 3,
    rockRisk: "LOW",
    scienceValue: "MEDIUM",
    fuelCost: "HIGH",

    description:
      "Safest terrain, but reaching it requires a larger divert maneuver.",

    x: 22,
    y: 67,
  },

  {
    id: "site-b",

    name: "SITE B",

    slope: 7,
    rockRisk: "MEDIUM",
    scienceValue: "HIGH",
    fuelCost: "LOW",

    description:
      "Close to the current trajectory with stronger science value, but steeper terrain.",

    x: 53,
    y: 42,
  },

  {
    id: "site-c",

    name: "SITE C",

    slope: 4,
    rockRisk: "HIGH",
    scienceValue: "VERY HIGH",
    fuelCost: "MEDIUM",

    description:
      "The most scientifically valuable site, but surface hazards are significantly higher.",

    x: 78,
    y: 70,
  },
];

interface LandingSiteProfile {
  safety: number;
  science: number;
  fuelMargin: number;
}

function getSiteProfile(
  siteId: LandingSiteId,
): LandingSiteProfile {
  if (siteId === "site-a") {
    return {
      safety: 92,
      science: 45,
      fuelMargin: 35,
    };
  }

  if (siteId === "site-b") {
    return {
      safety: 63,
      science: 78,
      fuelMargin: 88,
    };
  }

  return {
    safety: 42,
    science: 97,
    fuelMargin: 60,
  };
}

function getSiteOutcome(
  siteId: LandingSiteId,
) {
  if (siteId === "site-a") {
    return "Stable terrain gives the vehicle strong touchdown margin, but the large divert consumes fuel and limits science return.";
  }

  if (siteId === "site-b") {
    return "The vehicle stays near its current trajectory and reaches strong science terrain, but accepts a steeper landing surface.";
  }

  return "The mission reaches the highest-value science terrain, but high rock exposure leaves much less margin for landing error.";
}

function getSiteTradeoff(
  siteId: LandingSiteId,
) {
  if (siteId === "site-a") {
    return "GAIN: landing margin  /  ACCEPT: fuel cost + lower science";
  }

  if (siteId === "site-b") {
    return "GAIN: fuel efficiency + science  /  ACCEPT: terrain slope";
  }

  return "GAIN: maximum science  /  ACCEPT: surface hazard + landing risk";
}

function buildLandingResult(
  site: LandingSite,
  comparisons: number,
): LandingSiteResult {
  return {
    siteId: site.id,
    siteName: site.name,
    slope: site.slope,
    rockRisk: site.rockRisk,
    scienceValue:
      site.scienceValue,
    fuelCost: site.fuelCost,
    comparisons,
  };
}

function LandingSitePanel({
  locked = false,
  onPreview,
  onLock,
}: LandingSitePanelProps) {
  const [selectedSiteId, setSelectedSiteId] =
    useState<LandingSiteId | null>(
      null,
    );

  const [visitedSites, setVisitedSites] =
    useState<LandingSiteId[]>([]);

  const selectedSite =
    sites.find(
      (site) =>
        site.id === selectedSiteId,
    ) ?? null;

  function handleSelect(
    site: LandingSite,
  ) {
    if (locked) {
      return;
    }

    const nextVisited =
      visitedSites.includes(site.id)
        ? visitedSites
        : [
            ...visitedSites,
            site.id,
          ];

    setSelectedSiteId(
      site.id,
    );

    setVisitedSites(
      nextVisited,
    );

    onPreview?.(
      buildLandingResult(
        site,
        nextVisited.length,
      ),
    );
  }

  function handleLock() {
    if (!selectedSite) {
      return;
    }

    const result =
      buildLandingResult(
        selectedSite,
        visitedSites.length,
      );

    console.group(
      "AltWing Landing Site Selection",
    );

    console.log(
      "Selected site:",
      result,
    );

    console.log(
      "Sites compared:",
      visitedSites,
    );

    console.groupEnd();

    onLock?.(result);
  }

  return (
    <div className="landing-panel">
      <div className="landing-panel__header">
        <div>
          <span>
            LANDING WINDOW
          </span>

          <h2>
            Choose what you are
            willing to risk.
          </h2>
        </div>

        <div className="landing-panel__counter">
          {visitedSites.length}
          <small>
            / 3 compared
          </small>
        </div>
      </div>

      <p className="landing-brief">
        Three sites. Three different
        mission outcomes. There is no
        safest choice that also gives
        you everything else.
      </p>

      <div className="landing-map">
        <div className="landing-map__grid" />

        <div className="landing-map__crater landing-map__crater--1" />
        <div className="landing-map__crater landing-map__crater--2" />
        <div className="landing-map__crater landing-map__crater--3" />

        <div className="landing-map__trajectory">
          CURRENT TRAJECTORY
        </div>

        <svg
          viewBox="0 0 600 260"
          className="landing-map__path"
          aria-hidden="true"
        >
          <path
            d="M 300 0 C 315 70, 322 130, 320 250"
          />

          <circle
            cx="300"
            cy="22"
            r="5"
          />
        </svg>

        {sites.map((site) => {
          const selected =
            selectedSiteId ===
            site.id;

          return (
            <button
              type="button"
              key={site.id}
              className={[
                "landing-map__site",

                selected
                  ? "landing-map__site--selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${site.x}%`,
                top: `${site.y}%`,
              }}
              disabled={locked}
              onClick={() =>
                handleSelect(site)
              }
            >
              <span>
                {site.name.replace(
                  "SITE ",
                  "",
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="landing-sites">
        {sites.map((site) => {
          const selected =
            selectedSiteId ===
            site.id;

          const visited =
            visitedSites.includes(
              site.id,
            );

          const profile =
            getSiteProfile(
              site.id,
            );

          return (
            <button
              type="button"
              key={site.id}
              disabled={locked}
              onClick={() =>
                handleSelect(site)
              }
              className={[
                "landing-site-card",

                selected
                  ? "landing-site-card--selected"
                  : "",

                visited
                  ? "landing-site-card--visited"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="landing-site-card__top">
                <strong>
                  {site.name}
                </strong>

                {visited && (
                  <small>
                    ANALYZED
                  </small>
                )}
              </div>

              <div className="landing-site-card__metrics">
                <div>
                  <span>SLOPE</span>
                  <b>
                    {site.slope}°
                  </b>
                </div>

                <div>
                  <span>
                    ROCK RISK
                  </span>

                  <b>
                    {site.rockRisk}
                  </b>
                </div>

                <div>
                  <span>
                    SCIENCE
                  </span>

                  <b>
                    {
                      site.scienceValue
                    }
                  </b>
                </div>

                <div>
                  <span>
                    FUEL
                  </span>

                  <b>
                    {
                      site.fuelCost
                    }
                  </b>
                </div>
              </div>

              <div className="landing-site-card__profile">
                <div>
                  <div>
                    <span>
                      LANDING SAFETY
                    </span>

                    <b>
                      {profile.safety}
                    </b>
                  </div>

                  <div className="landing-profile-rail">
                    <div
                      style={{
                        width:
                          `${profile.safety}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <span>
                      SCIENCE RETURN
                    </span>

                    <b>
                      {profile.science}
                    </b>
                  </div>

                  <div className="landing-profile-rail">
                    <div
                      style={{
                        width:
                          `${profile.science}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <span>
                      FUEL MARGIN
                    </span>

                    <b>
                      {profile.fuelMargin}
                    </b>
                  </div>

                  <div className="landing-profile-rail">
                    <div
                      style={{
                        width:
                          `${profile.fuelMargin}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <p>
                {
                  site.description
                }
              </p>

              <small className="landing-site-card__tradeoff">
                {
                  getSiteTradeoff(
                    site.id,
                  )
                }
              </small>
            </button>
          );
        })}
      </div>

      {selectedSite ? (
        <div className="landing-selection">
          <div className="landing-selection__top">
            <div>
              <span>
                OUTCOME PREVIEW
              </span>

              <strong>
                {selectedSite.name}
              </strong>
            </div>

            <small>
              NOT COMMITTED
            </small>
          </div>

          <p>
            {
              getSiteOutcome(
                selectedSite.id,
              )
            }
          </p>

          <div className="landing-selection__tradeoff">
            {
              getSiteTradeoff(
                selectedSite.id,
              )
            }
          </div>
        </div>
      ) : (
        <div className="landing-selection landing-selection--empty">
          Select a landing site.
          Mission consequences will
          preview before you commit.
        </div>
      )}

      <button
        type="button"
        className="landing-lock"
        disabled={
          locked ||
          !selectedSite
        }
        onClick={handleLock}
      >
        {locked
          ? "Landing decision committed ✓"
          : selectedSite
            ? `Commit ${selectedSite.name} →`
            : "Select a landing site"}
      </button>
    </div>
  );
}

export default LandingSitePanel;