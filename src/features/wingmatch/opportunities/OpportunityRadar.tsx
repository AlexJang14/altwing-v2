import {
  useMemo,
  useState,
} from "react";

import {
  OPPORTUNITIES,
} from "./opportunities";

import type {
  PrimaryWingId,
} from "../engine/wingmatchV5";

import "../styles/opportunity-radar.css";


interface Props {
  wingIds:
    PrimaryWingId[];
}


type Filter =
  | "MATCHES"
  | "STATE"
  | "INTERNATIONAL"
  | "SCHOOL";


const filters:
  Filter[] = [
    "MATCHES",
    "STATE",
    "INTERNATIONAL",
    "SCHOOL",
  ];


const STATES = [
  ["ALL", "All States"],
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
  ["DC", "Washington, DC"],
] as const;


const STATE_KEY =
  "altwing-opportunity-state";


function OpportunityRadar({
  wingIds,
}: Props) {

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "MATCHES",
    );


  const [
    state,
    setState,
  ] =
    useState(
      () =>
        localStorage.getItem(
          STATE_KEY,
        ) ??
        "ALL",
    );


  function changeState(
    value: string,
  ) {
    setState(value);

    localStorage.setItem(
      STATE_KEY,
      value,
    );
  }


  const results =
    useMemo(
      () => {

        const ranked =
          OPPORTUNITIES.map(
            (
              opportunity,
            ) => {

              const matches =
                opportunity
                  .wingMatches
                  .filter(
                    (
                      wing,
                    ) =>
                      wingIds
                        .includes(
                          wing,
                        ),
                  )
                  .length;

              return {
                opportunity,
                matches,
              };
            },
          );


        return ranked
          .filter(
            (
              item,
            ) => {

              const opportunity =
                item.opportunity;


              if (
                filter ===
                "MATCHES"
              ) {
                return (
                  item.matches >
                  0
                );
              }


              if (
                filter ===
                "INTERNATIONAL"
              ) {
                return (
                  opportunity
                    .scope ===
                  "INTERNATIONAL"
                );
              }


              if (
                filter ===
                "SCHOOL"
              ) {
                return (
                  opportunity
                    .scope ===
                  "SCHOOL"
                );
              }


              /*
               * STATE:
               *
               * - state-specific opportunity
               * - internally NATIONAL / available in
               *   all U.S. states
               *
               * National is NOT a visible tab.
               */

              if (
                state ===
                "ALL"
              ) {
                return (
                  opportunity
                    .scope ===
                    "STATE" ||
                  opportunity
                    .scope ===
                    "NATIONAL" ||
                  Boolean(
                    opportunity
                      .availableInAllStates,
                  )
                );
              }


              return (
                (
                  opportunity
                    .scope ===
                    "STATE" &&
                  opportunity
                    .stateCode ===
                    state
                ) ||
                opportunity
                  .scope ===
                  "NATIONAL" ||
                Boolean(
                  opportunity
                    .availableInAllStates,
                )
              );
            },
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.matches -
              a.matches,
          );
      },
      [
        filter,
        state,
        wingIds,
      ],
    );


  return (
    <section className="opportunity-radar">

      <div className="opportunity-radar-heading">

        <div>

          <span>
            OPPORTUNITY RADAR
          </span>

          <h2>
            Where can you try
            these Wings in the
            real world?
          </h2>

          <p>
            Opportunities are
            ranked across your
            strongest Wing signals,
            not only your #1 result.
            AltWing does not invent
            programs when verified
            information is missing.
          </p>

        </div>


        <strong>
          {
            results.length
          }
          {" "}SIGNALS
        </strong>

      </div>


      <div className="opportunity-controls">

        <div className="opportunity-filters">

          {filters.map(
            (
              item,
            ) => (
              <button
                type="button"
                key={item}
                className={
                  filter ===
                    item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    item,
                  )
                }
              >
                {item}
              </button>
            ),
          )}

        </div>


        {filter ===
          "STATE" && (
          <label className="opportunity-state-select">

            <span>
              YOUR STATE
            </span>

            <select
              value={state}
              onChange={(
                event,
              ) =>
                changeState(
                  event.target
                    .value,
                )
              }
            >

              {STATES.map(
                (
                  [
                    code,
                    name,
                  ],
                ) => (
                  <option
                    key={code}
                    value={code}
                  >
                    {name}
                  </option>
                ),
              )}

            </select>

          </label>
        )}

      </div>


      {results.length ===
      0 ? (

        <div className="opportunity-empty">

          <strong>
            No verified signals
            loaded here yet.
          </strong>

          <p>
            That does not mean
            there are no
            opportunities in this
            location. AltWing simply
            has not added a verified
            official-source entry
            for this filter yet.
          </p>

          <span>
            Try MATCHES,
            INTERNATIONAL,
            or SCHOOL.
          </span>

        </div>

      ) : (

        <div className="opportunity-grid">

          {results.map(
            ({
              opportunity,
              matches,
            }) => (
              <article
                key={
                  opportunity.id
                }
              >

                <div className="opportunity-card-top">

                  <span>
                    {opportunity
                      .scope ===
                    "STATE"
                      ? opportunity
                          .stateCode ??
                        "STATE"
                      : opportunity
                          .scope}
                  </span>

                  <b
                    data-status={
                      opportunity
                        .status
                    }
                  >
                    {
                      opportunity
                        .status
                    }
                  </b>

                </div>


                <h3>
                  {
                    opportunity
                      .title
                  }
                </h3>


                <small>
                  {
                    opportunity
                      .organization
                  }
                </small>


                <p>
                  {
                    opportunity
                      .summary
                  }
                </p>


                <div className="opportunity-meta">

                  <div>

                    <span>
                      TIMING
                    </span>

                    <strong>
                      {
                        opportunity
                          .timing
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      ELIGIBILITY
                    </span>

                    <strong>
                      {
                        opportunity
                          .eligibility
                      }
                    </strong>

                  </div>

                </div>


                <footer>

                  <span>
                    {matches > 0
                      ? `${matches} WING MATCH${
                          matches === 1
                            ? ""
                            : "ES"
                        }`
                      : "EXPLORE"}
                  </span>

                  <small>
                    OFFICIAL SOURCE
                    {" · "}
                    {
                      opportunity
                        .officialSource
                    }
                    {" · "}
                    VERIFIED{" "}
                    {
                      opportunity
                        .lastVerified
                    }
                  </small>

                </footer>

              </article>
            ),
          )}

        </div>
      )}

    </section>
  );
}


export default OpportunityRadar;
