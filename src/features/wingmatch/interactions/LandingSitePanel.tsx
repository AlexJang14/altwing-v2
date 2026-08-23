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

function LandingSitePanel({
  locked = false,
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

    setSelectedSiteId(site.id);

    setVisitedSites((current) => {
      if (current.includes(site.id)) {
        return current;
      }

      return [
        ...current,
        site.id,
      ];
    });
  }

  function handleLock() {
    if (!selectedSite) {
      return;
    }

    const result: LandingSiteResult = {
      siteId:
        selectedSite.id,

      siteName:
        selectedSite.name,

      slope:
        selectedSite.slope,

      rockRisk:
        selectedSite.rockRisk,

      scienceValue:
        selectedSite.scienceValue,

      fuelCost:
        selectedSite.fuelCost,

      comparisons:
        visitedSites.length,
    };

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
            TERRAIN SELECTION
          </span>

          <h2>
            Choose where to land.
          </h2>
        </div>

        <div className="landing-panel__counter">
          {visitedSites.length}
          <small>
            / 3 compared
          </small>
        </div>
      </div>

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

              <p>
                {
                  site.description
                }
              </p>
            </button>
          );
        })}
      </div>

      {selectedSite ? (
        <div className="landing-selection">
          <span>
            CURRENT SELECTION
          </span>

          <strong>
            {selectedSite.name}
          </strong>

          <p>
            {
              selectedSite.description
            }
          </p>
        </div>
      ) : (
        <div className="landing-selection landing-selection--empty">
          Select a site to inspect
          the tradeoff.
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
          ? "Landing site locked"
          : selectedSite
            ? `Commit ${selectedSite.name}`
            : "Select a landing site"}
      </button>
    </div>
  );
}

export default LandingSitePanel;