import {
  useEffect,
  useState,
} from "react";

import "./post-wing-guide.css";


interface Props {
  enabled: boolean;
}


interface GuideStep {
  selector?: string;
  text?: string;

  eyebrow: string;
  title: string;
  description: string;

  keepTop?: boolean;
}


interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
}


const GUIDE_KEY =
  "altwing-post-wing-guide-v1";


const STEPS:
  GuideStep[] = [

  {
    selector:
      ".hlp-current-wing",

    eyebrow:
      "01 · YOUR WING",

    title:
      "This is your starting direction.",

    description:
      "WingMatch found a pattern worth exploring. It is not a permanent label — you can test other Wings too.",
  },


  {
    text:
      "Explore",

    eyebrow:
      "02 · EXPLORE",

    title:
      "See what aerospace actually includes.",

    description:
      "Use Explore when you want to browse aerospace fields, projects, and paths before deciding what you want to try.",

    keepTop:
      true,
  },


  {
    selector:
      ".hlp-primary",

    eyebrow:
      "03 · TRY THE WORK",

    title:
      "Do not stop at the result.",

    description:
      "Start your Wing path to make engineering decisions, run an interactive model, revise your design, and leave with Proof of Flight.",
  },


  {
    selector:
      ".hlp-build-library",

    eyebrow:
      "04 · TRY ANOTHER WING",

    title:
      "You are not locked into one field.",

    description:
      "Propulsion might be your current Wing, but you can also try GNC and, as new labs unlock, other engineering fields.",
  },


  {
    text:
      "My Universe",

    eyebrow:
      "05 · MY UNIVERSE",

    title:
      "This is where your work starts adding up.",

    description:
      "Your Wing, Builds, progress, discoveries, and eventually your project evidence live here.",

    keepTop:
      true,
  },
];


function normalize(
  value: string,
) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}


function findTextTarget(
  text: string,
): HTMLElement | null {

  const target =
    normalize(text);


  const elements =
    Array.from(
      document.querySelectorAll<HTMLElement>(
        "button, a, [role='button']",
      ),
    );


  const exact =
    elements.find(
      element =>
        normalize(
          element.textContent ?? "",
        ) === target,
    );


  if (exact) {
    return exact;
  }


  return (
    elements.find(
      element =>
        normalize(
          element.textContent ?? "",
        ).includes(
          target,
        ),
    ) ??
    null
  );
}


function findTarget(
  step: GuideStep,
): HTMLElement | null {

  if (step.selector) {

    return (
      document.querySelector<HTMLElement>(
        step.selector,
      )
    );
  }


  if (step.text) {

    return findTextTarget(
      step.text,
    );
  }


  return null;
}


export default function PostWingGuide({
  enabled,
}: Props) {

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
      TargetRect | null
    >(
      null,
    );


  const step =
    STEPS[
      stepIndex
    ];


  function readRect(
    element: HTMLElement,
  ) {

    const next =
      element.getBoundingClientRect();


    setRect({
      top:
        next.top,

      left:
        next.left,

      width:
        next.width,

      height:
        next.height,

      bottom:
        next.bottom,
    });
  }


  function moveToStep(
    index: number,
  ) {

    const nextStep =
      STEPS[
        index
      ];


    const target =
      findTarget(
        nextStep,
      );


    setStepIndex(
      index,
    );


    if (!target) {

      setRect(
        null,
      );

      return;
    }


    if (
      !nextStep.keepTop
    ) {

      target.scrollIntoView({
        behavior:
          "smooth",

        block:
          "center",

        inline:
          "nearest",
      });
    }


    window.setTimeout(
      () =>
        readRect(
          target,
        ),
      nextStep.keepTop
        ? 80
        : 420,
    );
  }


  function finish() {

    localStorage.setItem(
      GUIDE_KEY,
      "complete",
    );


    setActive(
      false,
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function next() {

    if (
      stepIndex >=
      STEPS.length - 1
    ) {

      finish();

      return;
    }


    moveToStep(
      stepIndex + 1,
    );
  }


  function previous() {

    if (
      stepIndex <= 0
    ) {
      return;
    }


    moveToStep(
      stepIndex - 1,
    );
  }


  useEffect(
    () => {

      if (!enabled) {
        return;
      }


      const alreadySeen =
        localStorage.getItem(
          GUIDE_KEY,
        );


      if (alreadySeen) {
        return;
      }


      const timer =
        window.setTimeout(
          () => {

            setActive(
              true,
            );

            moveToStep(
              0,
            );

          },
          800,
        );


      return () =>
        window.clearTimeout(
          timer,
        );

    },
    [
      enabled,
    ],
  );


  useEffect(
    () => {

      if (!active) {
        return;
      }


      const update = () => {

        const target =
          findTarget(
            STEPS[
              stepIndex
            ],
          );


        if (target) {
          readRect(
            target,
          );
        }
      };


      window.addEventListener(
        "resize",
        update,
      );


      window.addEventListener(
        "scroll",
        update,
        {
          passive:
            true,
        },
      );


      return () => {

        window.removeEventListener(
          "resize",
          update,
        );


        window.removeEventListener(
          "scroll",
          update,
        );
      };

    },
    [
      active,
      stepIndex,
    ],
  );


  if (!active) {
    return null;
  }


  const tooltipBelow =
    !rect ||
    rect.bottom <
      window.innerHeight *
        0.58;


  const tooltipStyle =
    rect
      ? tooltipBelow
        ? {
            top:
              Math.min(
                rect.bottom + 18,
                window.innerHeight - 270,
              ),

            left:
              Math.max(
                18,
                Math.min(
                  rect.left,
                  window.innerWidth - 390,
                ),
              ),
          }
        : {
            top:
              Math.max(
                18,
                rect.top - 242,
              ),

            left:
              Math.max(
                18,
                Math.min(
                  rect.left,
                  window.innerWidth - 390,
                ),
              ),
          }
      : {
          top:
            120,

          left:
            Math.max(
              18,
              window.innerWidth / 2 -
                180,
            ),
        };


  return (
    <div className="pwg">

      <div className="pwg-blocker" />


      {rect && (

        <div
          className="pwg-spotlight"
          style={{
            top:
              rect.top - 8,

            left:
              rect.left - 8,

            width:
              rect.width + 16,

            height:
              rect.height + 16,
          }}
        />

      )}


      <section
        className={[
          "pwg-card",

          tooltipBelow
            ? "is-below"
            : "is-above",
        ].join(" ")}
        style={
          tooltipStyle
        }
      >

        <div className="pwg-progress">

          {STEPS.map(
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


        <span className="pwg-eyebrow">
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
            step.description
          }
        </p>


        <div className="pwg-actions">

          <button
            type="button"
            className="pwg-skip"
            onClick={
              finish
            }
          >
            SKIP TOUR
          </button>


          <div>

            {stepIndex > 0 && (

              <button
                type="button"
                className="pwg-back"
                onClick={
                  previous
                }
              >
                ←
              </button>

            )}


            <button
              type="button"
              className="pwg-next"
              onClick={
                next
              }
            >
              {stepIndex ===
              STEPS.length - 1
                ? "GOT IT"
                : "NEXT →"}
            </button>

          </div>

        </div>


        <small>
          {stepIndex + 1}
          {" / "}
          {STEPS.length}
        </small>

      </section>

    </div>
  );
}
