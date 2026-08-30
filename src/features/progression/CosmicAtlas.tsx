import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  CELESTIAL_OBJECTS,
  COSMIC_DISCOVERY_EVENT,
  readCosmicCollection,
  type CelestialObject,
  type CosmicCollection,
  type CosmicRarity,
} from "./cosmic";

import "./cosmic.css";


const rarityFilters:
  Array<
    "ALL" | CosmicRarity
  > = [
    "ALL",
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY",
  ];


function CosmicAtlas() {
  const [
    collection,
    setCollection,
  ] =
    useState<CosmicCollection>(
      () =>
        readCosmicCollection(),
    );

  const [
    selected,
    setSelected,
  ] =
    useState<
      CelestialObject | null
    >(null);

  const [
    filter,
    setFilter,
  ] =
    useState<
      "ALL" | CosmicRarity
    >("ALL");


  useEffect(() => {
    const refresh = () => {
      setCollection(
        readCosmicCollection(),
      );
    };

    window.addEventListener(
      COSMIC_DISCOVERY_EVENT,
      refresh,
    );

    window.addEventListener(
      "altwing:cosmic-pack-opened",
      refresh,
    );

    return () => {
      window.removeEventListener(
        COSMIC_DISCOVERY_EVENT,
        refresh,
      );

      window.removeEventListener(
        "altwing:cosmic-pack-opened",
        refresh,
      );
    };
  }, []);


  useEffect(() => {
    if (!selected) {
      return;
    }

    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        setSelected(null);
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  }, [selected]);


  const discovered =
    useMemo(
      () =>
        new Set(
          collection.discoveredIds,
        ),
      [
        collection
          .discoveredIds,
      ],
    );


  const visibleObjects =
    useMemo(
      () =>
        filter === "ALL"
          ? CELESTIAL_OBJECTS
          : CELESTIAL_OBJECTS.filter(
              (object) =>
                object.rarity ===
                filter,
            ),
      [filter],
    );


  const discoverySource =
    selected
      ? [...collection.history]
          .reverse()
          .find(
            (item) =>
              item.objectId ===
                selected.id &&
              !item.duplicate,
          )
      : null;


  const detailModal =
    selected
      ? createPortal(
          <div
            className="cosmic-modal-backdrop"
            role="presentation"
            onMouseDown={() =>
              setSelected(null)
            }
          >
            <div
              className="cosmic-detail"
              data-cosmic={
                selected.id
              }
              role="dialog"
              aria-modal="true"
              aria-label={
                `${selected.name} details`
              }
              onMouseDown={(
                event,
              ) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className="cosmic-detail-close"
                aria-label="Close cosmic object details"
                onClick={() =>
                  setSelected(null)
                }
              >
                ×
              </button>

              <div className="cosmic-detail-orb">
                <i />
              </div>

              <small>
                {selected.rarity}
                {" · "}
                {selected.category}
              </small>

              <h3>
                {selected.name}
              </h3>

              <span>
                {selected.shortType}
              </span>

              <div className="cosmic-fact">
                <b>
                  WHY IT&apos;S INTERESTING
                </b>

                <p>
                  {selected.fact}
                </p>
              </div>

              {selected
                .unlockRequirement &&
                !discovered.has(
                  selected.id,
                ) && (
                  <div className="cosmic-achievement-lock">
                    <b>
                      LEGENDARY REQUIREMENT
                    </b>

                    <span>
                      {
                        selected
                          .unlockRequirement
                      }
                    </span>
                  </div>
                )}

              {discoverySource && (
                <div className="cosmic-earned-by">
                  <b>
                    HOW YOU FOUND IT
                  </b>

                  <span>
                    {
                      discoverySource
                        .sourceLabel
                    }
                  </span>
                </div>
              )}

              {discovered.has(
                selected.id,
              ) && (
                <div className="cosmic-collected">
                  ✓ ADDED TO YOUR ATLAS
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;


  return (
    <>
      <section className="cosmic-atlas cosmic-atlas-v2">
        <div className="cosmic-atlas-heading">
          <div>
            <small>
              COSMIC ATLAS
            </small>

            <strong>
              YOUR DISCOVERED UNIVERSE
            </strong>
          </div>

          <div className="cosmic-atlas-count">
            <b>
              {
                collection
                  .discoveredIds
                  .length
              }
              /
              {
                CELESTIAL_OBJECTS
                  .length
              }
            </b>

            <span>
              ✦{" "}
              {
                collection
                  .stardust
              }{" "}
              STARDUST
            </span>
          </div>
        </div>

        <div className="cosmic-atlas-progress">
          <i
            style={{
              width:
                `${
                  (
                    collection
                      .discoveredIds
                      .length /
                    CELESTIAL_OBJECTS
                      .length
                  ) *
                  100
                }%`,
            }}
          />
        </div>

        <p className="cosmic-atlas-hint">
          Open Deep Space Packs to
          discover new objects.
          Builds, evidence, and
          leadership unlock stronger
          signals.
        </p>

        <div className="cosmic-filter">
          {rarityFilters.map(
            (item) => (
              <button
                type="button"
                key={item}
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ),
          )}
        </div>

        <div className="cosmic-grid">
          {visibleObjects.map(
            (object) => {
              const unlocked =
                discovered.has(
                  object.id,
                );

              const achievement =
                object.unlockMode ===
                "ACHIEVEMENT";

              return (
                <button
                  type="button"
                  key={object.id}
                  data-cosmic={
                    object.id
                  }
                  disabled={
                    !unlocked &&
                    !achievement
                  }
                  className={[
                    "cosmic-object-card",

                    unlocked
                      ? "is-discovered"
                      : "is-locked",

                    achievement
                      ? "is-achievement"
                      : "",

                    `rarity-${object.rarity.toLowerCase()}`,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    setSelected(
                      object,
                    )
                  }
                >
                  <span className="cosmic-object-icon">
                    <i />
                  </span>

                  <strong>
                    {unlocked ||
                    achievement
                      ? object.name
                      : "???"}
                  </strong>

                  <small>
                    {unlocked
                      ? object.rarity
                      : achievement
                        ? "ACHIEVEMENT"
                        : "UNDISCOVERED"}
                  </small>
                </button>
              );
            },
          )}
        </div>
      </section>

      {detailModal}
    </>
  );
}


export default CosmicAtlas;
