import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  COSMIC_PACK_AWARDED_EVENT,
  COSMIC_PACK_OPENED_EVENT,
  openCosmicPack,
  readCosmicPackInventory,
  type CosmicPackInventory,
  type CosmicPackOpenResult,
} from "../progression/cosmic-packs";

import {
  PackReveal,
} from "../progression/CosmicPackVault";

import "./pack-ready-banner.css";


export default function PackReadyBanner() {

  const [
    inventory,
    setInventory,
  ] =
    useState<CosmicPackInventory>(
      () =>
        readCosmicPackInventory(),
    );


  const [
    reveal,
    setReveal,
  ] =
    useState<
      CosmicPackOpenResult | null
    >(
      null,
    );


  function refresh() {

    setInventory(
      readCosmicPackInventory(),
    );
  }


  useEffect(
    () => {

      window.addEventListener(
        COSMIC_PACK_AWARDED_EVENT,
        refresh,
      );


      window.addEventListener(
        COSMIC_PACK_OPENED_EVENT,
        refresh,
      );


      window.addEventListener(
        "storage",
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


        window.removeEventListener(
          "storage",
          refresh,
        );

      };

    },
    [],
  );


  const unopened =
    useMemo(
      () =>
        inventory.packs.filter(
          pack =>
            !pack.openedAt,
        ),
      [
        inventory,
      ],
    );


  const nextPack =
    unopened[0];


  if (reveal) {

    return (
      <PackReveal
        result={
          reveal
        }
        onClose={() => {

          setReveal(
            null,
          );

          refresh();
        }}
      />
    );
  }


  if (!nextPack) {
    return null;
  }


  function openNextPack() {

    const result =
      openCosmicPack(
        nextPack.id,
      );


    if (!result) {
      refresh();
      return;
    }


    setReveal(
      result,
    );
  }


  return (
    <section className="prb">

      <div className="prb-signal">

        <div className="prb-orbit">

          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

        </div>

      </div>


      <div className="prb-copy">

        <span>
          COSMIC PACK READY ·{" "}
          {unopened.length}
        </span>

        <h3>
          You earned something.
        </h3>

        <p>
          {nextPack.sourceLabel}
        </p>

      </div>


      <div className="prb-pack">

        <span>
          ALTWING
        </span>

        <strong>
          {nextPack.type ===
          "EVIDENCE"
            ? "ENGINEERING"
            : nextPack.type}
        </strong>

        <small>
          DEEP SPACE PACK
        </small>

      </div>


      <button
        type="button"
        onClick={
          openNextPack
        }
      >
        OPEN PACK
        <strong>
          →
        </strong>
      </button>

    </section>
  );
}
