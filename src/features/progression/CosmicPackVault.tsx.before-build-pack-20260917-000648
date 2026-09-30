import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  awardCosmicPack,
  COSMIC_PACK_AWARDED_EVENT,
  COSMIC_PACK_OPENED_EVENT,
  openCosmicPack,
  readCosmicPackInventory,
  type CosmicPack,
  type CosmicPackInventory,
  type CosmicPackOpenResult,
  type CosmicPackType,
} from "./cosmic-packs";

import {
  readPlayerProgress,
} from "./progression";

import "./cosmic-pack.css";


function packInfo(
  type: CosmicPackType,
) {
  switch (type) {
    case "BUILDER":
      return {
        name: "BUILDER PACK",
        tag: "REAL BUILD REWARD",
        boost: "RARE + EPIC BOOST",
      };

    case "EVIDENCE":
      return {
        name: "EVIDENCE PACK",
        tag: "PROOF REWARD",
        boost: "HIGH RARE / EPIC",
      };

    case "MISSION_LEAD":
      return {
        name: "MISSION LEAD PACK",
        tag: "LEADERSHIP REWARD",
        boost: "EPIC BOOST",
      };

    case "LEVEL":
      return {
        name: "LEVEL-UP PACK",
        tag: "LEVEL REWARD",
        boost: "IMPROVED SIGNAL",
      };

    case "LEGENDARY":
      return {
        name: "LEGENDARY SIGNAL",
        tag: "ACHIEVEMENT EXCLUSIVE",
        boost: "GUARANTEED LEGENDARY",
      };

    default:
      return {
        name: "MISSION PACK",
        tag: "FLIGHT REWARD",
        boost: "3 COSMIC SIGNALS",
      };
  }
}


function migrateExistingProgressToPacks() {
  const progress =
    readPlayerProgress();

  const milestones =
    progress.completedMilestones;


  if (
    milestones.includes(
      "aerospace:wingmatch:complete",
    )
  ) {
    awardCosmicPack(
      "reward:aerospace:wingmatch:complete",
      "MISSION",
      "Aerospace Mission Complete",
    );
  }


  milestones
    .filter(
      (id) =>
        id.startsWith("project:") &&
        id.includes(":build-complete"),
    )
    .forEach((id) => {
      awardCosmicPack(
        `reward:${id}`,
        "BUILDER",
        "Completed Build Quest",
      );
    });


  milestones
    .filter(
      (id) =>
        id.startsWith("evidence:"),
    )
    .forEach((id) => {
      awardCosmicPack(
        `reward:${id}`,
        "EVIDENCE",
        "Published Engineering Evidence",
      );
    });


  milestones.forEach((id) => {
    if (
      id ===
      "leadership:crew:verified:1"
    ) {
      awardCosmicPack(
        "achievement:mission-lead",
        "LEGENDARY",
        "Verified Mission Lead",
        "sagittarius-a-star",
      );

      return;
    }


    if (
      id ===
      "leadership:crew:verified:3"
    ) {
      awardCosmicPack(
        "achievement:crew-3",
        "LEGENDARY",
        "Three Explorers Launched",
        "m87-star",
      );

      return;
    }


    if (
      id ===
      "leadership:community:verified:5"
    ) {
      awardCosmicPack(
        "achievement:community-builder",
        "LEGENDARY",
        "Verified Community Builder",
        "ton-618",
      );

      return;
    }


    if (
      id.startsWith("leadership:")
    ) {
      awardCosmicPack(
        `reward:${id}`,
        "MISSION_LEAD",
        "Leadership Milestone",
      );
    }
  });
}


interface RevealProps {
  result: CosmicPackOpenResult;
  onClose: () => void;
}


function PackReveal({
  result,
  onClose,
}: RevealProps) {
  const [
    revealCount,
    setRevealCount,
  ] = useState(0);


  useEffect(() => {
    setRevealCount(0);

    const timers =
      result.cards.map(
        (_, index) =>
          window.setTimeout(
            () =>
              setRevealCount(
                index + 1,
              ),
            550 +
              index * 700,
          ),
      );

    return () => {
      timers.forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, [result]);


  const allRevealed =
    revealCount >=
    result.cards.length;


  const newDiscoveries =
    result.cards.filter(
      (card) =>
        !card.duplicate,
    ).length;


  const stardust =
    result.cards.reduce(
      (sum, card) =>
        sum +
        card.stardustGain,
      0,
    );


  return (
    <div className="pack-opening">
      <div className="pack-opening-stars" />

      <div className="pack-opening-content">
        <span>
          DEEP SPACE PACK
        </span>

        <h2>
          {
            packInfo(
              result.pack.type,
            ).name
          }
        </h2>

        <p>
          SIGNALS ACQUIRED
        </p>


        <div
          className={[
            "pack-reveal-grid",

            result.cards.length === 1
              ? "pack-reveal-grid--single"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {result.cards.map(
            (card, index) => {
              const revealed =
                index <
                revealCount;

              return (
                <article
                  key={
                    card.object.id +
                    index
                  }
                  data-cosmic={
                    card.object.id
                  }
                  className={[
                    "pack-reveal-card",

                    revealed
                      ? "revealed"
                      : "",

                    `pack-rarity-${card.object.rarity.toLowerCase()}`,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {!revealed ? (
                    <div className="pack-card-back">
                      <b>?</b>

                      <span>
                        SIGNAL{" "}
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>
                  ) : (
                    <>
                      <small>
                        {
                          card.object
                            .rarity
                        }
                      </small>

                      <div className="cosmic-detail-orb">
                        <i />
                      </div>

                      <strong>
                        {
                          card.object
                            .name
                        }
                      </strong>

                      <span>
                        {
                          card.object
                            .shortType
                        }
                      </span>

                      <p className="pack-card-description">
                        {
                          card.object
                            .fact
                        }
                      </p>

                      {card.duplicate && (
                        <b className="pack-duplicate">
                          DUPLICATE
                          {" · +"}
                          {
                            card
                              .stardustGain
                          }
                          {" "}✦
                        </b>
                      )}
                    </>
                  )}
                </article>
              );
            },
          )}
        </div>


        {allRevealed && (
          <>
            <div className="pack-summary">
              <div>
                <b>
                  {newDiscoveries}
                </b>

                <span>NEW</span>
              </div>

              <div>
                <b>
                  {
                    result.cards.length -
                    newDiscoveries
                  }
                </b>

                <span>
                  DUPLICATES
                </span>
              </div>

              <div>
                <b>
                  +{stardust}
                </b>

                <span>
                  STARDUST
                </span>
              </div>
            </div>

            <button
              type="button"
              className="pack-finish"
              onClick={onClose}
            >
              ADD TO COSMIC ATLAS →
            </button>
          </>
        )}
      </div>
    </div>
  );
}


function CosmicPackVault() {
  const [
    inventory,
    setInventory,
  ] =
    useState<CosmicPackInventory>(
      () =>
        readCosmicPackInventory(),
    );

  const [
    opening,
    setOpening,
  ] =
    useState<
      CosmicPackOpenResult | null
    >(null);


  useEffect(() => {
    migrateExistingProgressToPacks();

    setInventory(
      readCosmicPackInventory(),
    );

    const refresh = () => {
      setInventory(
        readCosmicPackInventory(),
      );
    };

    window.addEventListener(
      COSMIC_PACK_AWARDED_EVENT,
      refresh,
    );

    window.addEventListener(
      COSMIC_PACK_OPENED_EVENT,
      refresh,
    );

    return () => {
      window.removeEventListener(
        COSMIC_PACK_AWARDED_EVENT,
        refresh,
      );

      window.removeEventListener(
        COSMIC_PACK_OPENED_EVENT,
        refresh,
      );
    };
  }, []);


  const unopened =
    useMemo(
      () =>
        inventory.packs
          .filter(
            (pack) =>
              !pack.openedAt,
          )
          .reverse(),
      [inventory],
    );


  const openedCount =
    inventory.packs.filter(
      (pack) =>
        Boolean(pack.openedAt),
    ).length;


  const recentOpened =
    useMemo(
      () =>
        inventory.packs
          .filter(
            (pack) =>
              Boolean(
                pack.openedAt,
              ),
          )
          .sort(
            (a, b) =>
              new Date(
                b.openedAt ?? 0,
              ).getTime() -
              new Date(
                a.openedAt ?? 0,
              ).getTime(),
          )
          .slice(0, 5),
      [inventory],
    );


  const openPack = (
    pack: CosmicPack,
  ) => {
    const result =
      openCosmicPack(
        pack.id,
      );

    if (!result) {
      return;
    }

    setOpening(result);

    setInventory(
      readCosmicPackInventory(),
    );
  };


  return (
    <>
      <section className="cosmic-pack-vault">
        <div className="pack-vault-heading">
          <div>
            <small>
              DEEP SPACE PACKS
            </small>

            <strong>
              Signals waiting
              to be opened.
            </strong>
          </div>

          <b>
            {unopened.length}
            {" "}READY
          </b>
        </div>


        {unopened.length === 0 ? (
          <div className="pack-empty">
            <div className="pack-empty-capsule">
              <i />
            </div>

            <div>
              <span>
                NO PACKS READY
              </span>

              <strong>
                Your next real action
                can uncover a signal.
              </strong>

              <p>
                Missions, completed
                builds, evidence, and
                leadership earn
                different Packs.
              </p>
            </div>
          </div>
        ) : (
          <div className="pack-vault-list">
            {unopened.map(
              (pack) => {
                const info =
                  packInfo(
                    pack.type,
                  );

                return (
                  <article
                    key={pack.id}
                    className={[
                      "pack-vault-card",

                      `pack-vault-card--${pack.type.toLowerCase()}`,
                    ].join(" ")}
                  >
                    <div className="pack-capsule">
                      <i />
                      <span />
                    </div>

                    <div>
                      <small>
                        {info.tag}
                      </small>

                      <strong>
                        {info.name}
                      </strong>

                      <span>
                        {info.boost}
                      </span>

                      <p>
                        {
                          pack.sourceLabel
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openPack(pack)
                      }
                    >
                      OPEN PACK
                    </button>
                  </article>
                );
              },
            )}
          </div>
        )}


        <div className="pack-vault-footer">
          <span>
            {inventory.packs.length}
            {" "}EARNED
          </span>

          <span>
            {openedCount}
            {" "}OPENED
          </span>
        </div>

        {recentOpened.length > 0 && (
          <details className="pack-history">
            <summary>
              PACK HISTORY
              <span>
                {openedCount}
                {" "}OPENED
              </span>
            </summary>

            <div>
              {recentOpened.map(
                (pack) => (
                  <article
                    key={
                      `history:${pack.id}`
                    }
                  >
                    <div>
                      <strong>
                        {
                          packInfo(
                            pack.type,
                          ).name
                        }
                      </strong>

                      <small>
                        {
                          pack
                            .sourceLabel
                        }
                      </small>
                    </div>

                    <time>
                      {pack.openedAt
                        ? new Date(
                            pack.openedAt,
                          ).toLocaleDateString()
                        : ""}
                    </time>
                  </article>
                ),
              )}
            </div>
          </details>
        )}
      </section>


      {opening && (
        <PackReveal
          result={opening}
          onClose={() =>
            setOpening(null)
          }
        />
      )}
    </>
  );
}


export default CosmicPackVault;
