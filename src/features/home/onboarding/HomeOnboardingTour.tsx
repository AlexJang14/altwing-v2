import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./home-onboarding-tour.css";


interface Props {
  enabled: boolean;
}


interface Step {
  eyebrow: string;
  title: string;
  body: string;

  target:
    () =>
      HTMLElement | null;

  scroll?: boolean;
}


function findButton(
  text: string,
) {

  const items =
    Array.from(
      document.querySelectorAll<
        HTMLElement
      >(
        "button, a",
      ),
    );


  return (
    items.find(
      item =>
        item.textContent
          ?.trim()
          .toLowerCase()
          .includes(
            text.toLowerCase(),
          ),
    ) ??
    null
  );
}


function findBuild(
  text: string,
) {

  const cards =
    Array.from(
      document.querySelectorAll<
        HTMLElement
      >(
        ".hlp-build-card",
      ),
    );


  return (
    cards.find(
      card =>
        card.textContent
          ?.toLowerCase()
          .includes(
            text.toLowerCase(),
          ),
    ) ??
    null
  );
}


export default function HomeOnboardingTour({
  enabled,
}: Props) {

  const [
    owner,
    setOwner,
  ] =
    useState(false);


  const [
    active,
    setActive,
  ] =
    useState(false);


  const [
    stepIndex,
    setStepIndex,
  ] =
    useState(0);


  const [
    rect,
    setRect,
  ] =
    useState<
      DOMRect | null
    >(
      null,
    );


  const steps =
    useMemo<Step[]>(
      () => [

        {
          eyebrow:
            "01 · YOUR RESULT",

          title:
            "You found your first Wing.",

          body:
            "WingMatch gives you a direction worth testing. It is a starting point, not a permanent label.",

          target:
            () =>
              document.querySelector<HTMLElement>(
                ".hlp-current-wing",
              ),
        },


        {
          eyebrow:
            "02 · TRY YOUR WING",

          title:
            "Now actually try the work.",

          body:
            "Start My Wing Path opens an interactive engineering Build. You will make decisions, run a model, revise your design, and create Proof of Flight.",

          target:
            () =>
              document.querySelector<HTMLElement>(
                ".hlp-primary",
              ),
        },


        {
          eyebrow:
            "03 · EXPLORE",

          title:
            "Your result does not lock you in.",

          body:
            "Explore lets you look beyond your WingMatch result and discover other aerospace fields, projects, and paths.",

          target:
            () =>
              findButton(
                "Explore",
              ),
        },


        {
          eyebrow:
            "04 · TRY ANOTHER WING",

          title:
            "The best way to compare fields is to try them.",

          body:
            "For example, Lost Sensor lets you experience Guidance, Navigation & Control even if WingMatch originally gave you Propulsion.",

          target:
            () =>
              findBuild(
                "Lost Sensor",
              ),

          scroll:
            true,
        },


        {
          eyebrow:
            "05 · MY UNIVERSE",

          title:
            "Your work starts adding up here.",

          body:
            "My Universe is where your Wing, Builds, Proof of Flight, progress, and discoveries come together.",

          target:
            () =>
              findButton(
                "My Universe",
              ),
        },

      ],
      [],
    );


  const step =
    steps[
      stepIndex
    ];


  /*
   * Prevent duplicate tour instances.
   * Only one Home tour can own the screen.
   */
  useEffect(
    () => {

      if (!enabled) {
        return;
      }


      const w =
        window as Window & {
          __altwingHomeTourOwner?:
            boolean;
        };


      if (
        w.__altwingHomeTourOwner
      ) {
        return;
      }


      w.__altwingHomeTourOwner =
        true;


      setOwner(
        true,
      );


      return () => {

        w.__altwingHomeTourOwner =
          false;

      };

    },
    [
      enabled,
    ],
  );


  /*
   * New version key means the cleaned-up
   * tour will run once even if V1 was seen.
   */
  useEffect(
    () => {

      if (
        !enabled ||
        !owner
      ) {
        return;
      }


      const seen =
        localStorage.getItem(
          "altwing-home-tour-v2",
        );


      if (
        seen ===
        "complete"
      ) {
        return;
      }


      const timer =
        window.setTimeout(
          () => {

            setActive(
              true,
            );

          },
          700,
        );


      return () =>
        window.clearTimeout(
          timer,
        );

    },
    [
      enabled,
      owner,
    ],
  );


  function locate() {

    if (
      !active ||
      !step
    ) {
      return;
    }


    const target =
      step.target();


    if (!target) {

      setRect(
        null,
      );

      return;
    }


    const measureTarget = () => {

      const freshTarget =
        step.target();


      if (!freshTarget) {

        setRect(
          null,
        );

        return;
      }


      const nextRect =
        freshTarget
          .getBoundingClientRect();


      setRect(
        nextRect,
      );
    };


    if (
      step.scroll
    ) {

      /*
       * Important:
       * use instant positioning for the tour,
       * then measure AFTER layout settles.
       * Smooth scrolling caused stale coordinates.
       */

      target.scrollIntoView({
        behavior:
          "auto",

        block:
          "center",

        inline:
          "nearest",
      });


      window.requestAnimationFrame(
        () => {

          window.requestAnimationFrame(
            () => {

              measureTarget();

            },
          );

        },
      );


      return;
    }


    measureTarget();
  }


  useEffect(
    () => {

      if (!active) {
        return;
      }


      setRect(
        null,
      );


      const timer =
        window.setTimeout(
          locate,
          100,
        );


      const update =
        () =>
          locate();


      window.addEventListener(
        "resize",
        update,
      );


      window.addEventListener(
        "scroll",
        update,
        true,
      );


      return () => {

        window.clearTimeout(
          timer,
        );


        window.removeEventListener(
          "resize",
          update,
        );


        window.removeEventListener(
          "scroll",
          update,
          true,
        );

      };

    },
    [
      active,
      stepIndex,
    ],
  );


  function finish() {

    localStorage.setItem(
      "altwing-home-tour-v2",
      "complete",
    );


    setActive(
      false,
    );


    setStepIndex(
      0,
    );


    setRect(
      null,
    );
  }


  function next() {

    if (
      stepIndex >=
      steps.length - 1
    ) {

      finish();

      return;
    }


    setStepIndex(
      current =>
        current + 1,
    );
  }


  function back() {

    setStepIndex(
      current =>
        Math.max(
          0,
          current - 1,
        ),
    );
  }


  function replay() {

    setStepIndex(
      0,
    );


    setRect(
      null,
    );


    setActive(
      true,
    );
  }


  if (
    !enabled ||
    !owner
  ) {
    return null;
  }


  const pointerBelow =
    rect
      ? rect.top <
        90
      : false;


  return (
    <>

      {!active && (

        <button
          type="button"
          className="aw-tour-replay"
          onClick={
            replay
          }
        >
          ? GUIDE
        </button>

      )}


      {active && (

        <div className="aw-tour-root">

          <div className="aw-tour-dim" />


          {rect && (

            <>

              <div
                className="aw-tour-spotlight"
                style={{
                  left:
                    rect.left -
                    8,

                  top:
                    rect.top -
                    8,

                  width:
                    rect.width +
                    16,

                  height:
                    rect.height +
                    16,
                }}
              />


              <div
                className={[
                  "aw-tour-pointer",

                  pointerBelow
                    ? "is-below"
                    : "",
                ]
                  .filter(
                    Boolean,
                  )
                  .join(
                    " ",
                  )}
                style={{
                  left:
                    Math.max(
                      12,
                      rect.left +
                        rect.width /
                          2 -
                        42,
                    ),

                  top:
                    pointerBelow
                      ? rect.bottom +
                        12
                      : Math.max(
                          12,
                          rect.top -
                            42,
                        ),
                }}
              >

                {pointerBelow
                  ? "↑ LOOK HERE"
                  : "LOOK HERE ↓"}

              </div>

            </>

          )}


          <section className="aw-tour-card">

            <div className="aw-tour-bars">

              {steps.map(
                (
                  _,
                  index,
                ) => (

                  <span
                    key={
                      index
                    }
                    className={
                      index <=
                      stepIndex
                        ? "is-active"
                        : ""
                    }
                  />

                ),
              )}

            </div>


            <div className="aw-tour-count">
              {stepIndex + 1}
              {" / "}
              {steps.length}
            </div>


            <span className="aw-tour-eyebrow">
              {
                step.eyebrow
              }
            </span>


            <h3>
              {
                step.title
              }
            </h3>


            <p>
              {
                step.body
              }
            </p>


            <div className="aw-tour-actions">

              <button
                type="button"
                className="aw-tour-skip"
                onClick={
                  finish
                }
              >
                SKIP TOUR
              </button>


              <div>

                {stepIndex >
                  0 && (

                  <button
                    type="button"
                    className="aw-tour-back"
                    onClick={
                      back
                    }
                  >
                    ←
                  </button>

                )}


                <button
                  type="button"
                  className="aw-tour-next"
                  onClick={
                    next
                  }
                >
                  {stepIndex ===
                  steps.length - 1
                    ? "DONE ✓"
                    : "NEXT →"}
                </button>

              </div>

            </div>

          </section>

        </div>

      )}

    </>
  );
}


declare global {

  interface Window {
    __altwingHomeTourOwner?:
      boolean;
  }

}
