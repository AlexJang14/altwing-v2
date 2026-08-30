import {
  useEffect,
  useState,
} from "react";

import {
  COSMIC_DISCOVERY_EVENT,
  type CosmicDiscoveryDetail,
} from "./cosmic";

import "./cosmic.css";

function CosmicDiscoveryOverlay() {
  const [
    discovery,
    setDiscovery,
  ] =
    useState<
      CosmicDiscoveryDetail | null
    >(null);

  useEffect(() => {
    let timer:
      number | undefined;

    const handler = (
      event: Event,
    ) => {
      const custom =
        event as
          CustomEvent<
            CosmicDiscoveryDetail
          >;

      setDiscovery(
        custom.detail,
      );

      if (timer) {
        window.clearTimeout(
          timer,
        );
      }

      timer =
        window.setTimeout(
          () =>
            setDiscovery(
              null,
            ),
          3600,
        );
    };

    window.addEventListener(
      COSMIC_DISCOVERY_EVENT,
      handler,
    );

    return () => {
      window.removeEventListener(
        COSMIC_DISCOVERY_EVENT,
        handler,
      );

      if (timer) {
        window.clearTimeout(
          timer,
        );
      }
    };
  }, []);

  if (!discovery) {
    return null;
  }

  const {
    object,
    duplicate,
    stardustGain,
    sourceLabel,
  } = discovery;

  return (
    <div
      className={[
        "cosmic-discovery",
        `cosmic-discovery--${object.rarity.toLowerCase()}`,
      ].join(" ")}
      role="status"
    >
      <div className="cosmic-stars" />

      <div className="cosmic-scan-line" />

      <div className="cosmic-discovery-card">
        <span className="cosmic-scan-label">
          DEEP SPACE SIGNAL
        </span>

        <div className="cosmic-orb">
          <div />
          <i />
        </div>

        <p className="cosmic-rarity">
          ★ {object.rarity}
        </p>

        <h2>
          {duplicate
            ? "SIGNAL REACQUIRED"
            : `${object.category} DISCOVERED`}
        </h2>

        <h1>
          {object.name}
        </h1>

        <span className="cosmic-object-type">
          {object.shortType}
        </span>

        {duplicate ? (
          <div className="cosmic-duplicate">
            DUPLICATE DISCOVERY
            <strong>
              +{stardustGain}
              {" "}STARDUST
            </strong>
          </div>
        ) : (
          <p className="cosmic-added">
            NEW DISCOVERY ADDED
            TO COSMIC ATLAS
          </p>
        )}

        <small>
          {sourceLabel}
        </small>
      </div>
    </div>
  );
}

export default CosmicDiscoveryOverlay;
