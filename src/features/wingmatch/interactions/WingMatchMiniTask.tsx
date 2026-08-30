import {
  useMemo,
  useState,
} from "react";

import type {
  StyleScores,
} from "../engine/wingmatchV5";

import "../styles/wingmatch-v5.css";


export interface MiniTaskResult {
  title: string;

  consequence: string;

  styleWeights:
    StyleScores;
}


interface Props {
  task:
    | "control"
    | "diagnostic";

  locked: boolean;

  onComplete:
    (
      result:
        MiniTaskResult,
    ) => void;
}


function shuffle<T>(
  input: readonly T[],
) {
  const next = [
    ...input,
  ];

  for (
    let i =
      next.length - 1;
    i > 0;
    i -= 1
  ) {
    const j =
      Math.floor(
        Math.random() *
        (i + 1),
      );

    [
      next[i],
      next[j],
    ] = [
      next[j],
      next[i],
    ];
  }

  return next;
}


function ControlTask({
  locked,
  onComplete,
}: Omit<Props, "task">) {

  const [
    gain,
    setGain,
  ] =
    useState(82);


  const [
    adjustments,
    setAdjustments,
  ] =
    useState(0);


  const overshoot =
    Math.round(
      6 +
      Math.abs(
        gain -
        52,
      ) *
        0.72,
    );


  const settling =
    (
      3.4 +
      Math.abs(
        gain -
        52,
      ) *
        0.09
    ).toFixed(1);


  function changeGain(
    value: number,
  ) {
    if (locked) {
      return;
    }

    setGain(value);

    setAdjustments(
      (
        current,
      ) =>
        current + 1,
    );
  }


  function lock() {
    if (locked) {
      return;
    }

    const stable =
      gain >= 42 &&
      gain <= 62;


    const experiment =
      Math.min(
        0.90,
        adjustments *
          0.18,
      );


    const optimize =
      stable
        ? 0.80
        : gain >= 30 &&
            gain <= 72
          ? 0.48
          : 0.18;


    const risk =
      gain >= 74
        ? 0.55
        : 0.10;


    const systems =
      adjustments >= 3
        ? 0.32
        : 0.12;


    onComplete({
      title:
        `Control setting locked after ${adjustments} adjustment${
          adjustments === 1
            ? ""
            : "s"
        }`,

      consequence:
        "You tested a live control response and chose when you had enough information to commit.",

      styleWeights: {
        experiment,
        optimize,
        risk,
        systems,
      },
    });
  }


  return (
    <section className="v5-mini-task">

      <div className="v5-mini-heading">

        <span>
          MINI LAB · CONTROL
        </span>

        <h2>
          The lander keeps
          wobbling.
        </h2>

        <p>
          Move the control setting
          until you would be willing
          to fly it.
        </p>

      </div>


      <div className="v5-control-visual">

        <div
          className="v5-control-craft"
          style={{
            transform:
              `translate(-50%,-50%) rotate(${
                (
                  gain -
                  52
                ) /
                3
              }deg)`,
          }}
        >
          <i />
        </div>

        <div className="v5-control-target">
          +
        </div>

        <div className="v5-control-wave">
          <i
            style={{
              width:
                `${Math.min(
                  95,
                  overshoot *
                    2.4,
                )}%`,
            }}
          />
        </div>

      </div>


      <div className="v5-control-readout">

        <article>
          <span>
            OVERSHOOT
          </span>

          <strong>
            {overshoot}%
          </strong>
        </article>

        <article>
          <span>
            SETTLING
          </span>

          <strong>
            {settling}s
          </strong>
        </article>

        <article>
          <span>
            TESTS
          </span>

          <strong>
            {adjustments}
          </strong>
        </article>

      </div>


      <label className="v5-control-slider">

        <span>
          CALMER
        </span>

        <input
          type="range"
          min="15"
          max="90"
          value={gain}
          disabled={locked}
          onChange={(
            event,
          ) =>
            changeGain(
              Number(
                event
                  .target
                  .value,
              ),
            )
          }
        />

        <span>
          STRONGER
        </span>

      </label>


      <button
        type="button"
        className="v5-mini-commit"
        disabled={locked}
        onClick={lock}
      >
        LOCK THIS SETTING →
      </button>


      <small className="v5-mini-note">
        AltWing records how you
        explore the problem — not
        whether you found one
        secret correct number.
      </small>

    </section>
  );
}


const diagnostics = [
  {
    id:
      "independent",

    title:
      "Check an independent sensor",

    copy:
      "Compare the suspicious signal with another measurement.",

    weights: {
      evidence: 0.78,
      systems: 0.20,
    },
  },

  {
    id:
      "model",

    title:
      "Compare the motion model",

    copy:
      "See whether the signal matches what the vehicle should be doing.",

    weights: {
      model: 0.78,
      evidence: 0.18,
    },
  },

  {
    id:
      "perturb",

    title:
      "Make a tiny test change",

    copy:
      "Change one input and see how the signal responds.",

    weights: {
      experiment: 0.82,
      optimize: 0.18,
    },
  },

  {
    id:
      "system",

    title:
      "Check the whole system health",

    copy:
      "Look for related problems in power, computers, and communications.",

    weights: {
      systems: 0.82,
      evidence: 0.18,
    },
  },

  {
    id:
      "time",

    title:
      "Protect the decision window",

    copy:
      "Avoid extra testing and preserve time for the next maneuver.",

    weights: {
      risk: 0.68,
      optimize: 0.20,
    },
  },
] as const;


function DiagnosticTask({
  locked,
  onComplete,
}: Omit<Props, "task">) {

  const ordered =
    useMemo(
      () =>
        shuffle(
          diagnostics,
        ),
      [],
    );


  const [
    selected,
    setSelected,
  ] =
    useState<string[]>(
      [],
    );


  function toggle(
    id: string,
  ) {
    if (locked) {
      return;
    }

    setSelected(
      (
        current,
      ) => {

        if (
          current.includes(
            id,
          )
        ) {
          return current.filter(
            (
              item,
            ) =>
              item !== id,
          );
        }

        if (
          current.length >=
          2
        ) {
          return current;
        }

        return [
          ...current,
          id,
        ];
      },
    );
  }


  function commit() {
    if (
      locked ||
      selected.length !==
        2
    ) {
      return;
    }

    const styles:
      StyleScores = {};


    selected.forEach(
      (
        id,
      ) => {

        const item =
          diagnostics.find(
            (
              test,
            ) =>
              test.id ===
              id,
          );

        if (!item) {
          return;
        }

        Object.entries(
          item.weights,
        ).forEach(
          (
            [
              style,
              value,
            ],
          ) => {

            styles[
              style as keyof StyleScores
            ] =
              (
                styles[
                  style as keyof StyleScores
                ] ??
                0
              ) +
              value;
          },
        );
      },
    );


    onComplete({
      title:
        "Two diagnostic actions selected",

      consequence:
        "You had limited time and chose which evidence or action was worth using before commitment.",

      styleWeights:
        styles,
    });
  }


  return (
    <section className="v5-mini-task">

      <div className="v5-mini-heading">

        <span>
          MINI LAB · DIAGNOSTICS
        </span>

        <h2>
          A spacecraft signal
          suddenly looks wrong.
        </h2>

        <p>
          You have time for only
          two actions. Pick the two
          you would use.
        </p>

      </div>


      <div className="v5-diagnostic-grid">

        {ordered.map(
          (
            item,
            index,
          ) => {

            const active =
              selected.includes(
                item.id,
              );

            return (
              <button
                type="button"
                key={item.id}
                disabled={locked}
                className={
                  active
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  toggle(
                    item.id,
                  )
                }
              >
                <small>
                  ACTION{" "}
                  {index + 1}
                </small>

                <strong>
                  {
                    item.title
                  }
                </strong>

                <p>
                  {
                    item.copy
                  }
                </p>

                <b>
                  {active
                    ? "SELECTED ✓"
                    : "SELECT"}
                </b>
              </button>
            );
          },
        )}

      </div>


      <div className="v5-diagnostic-footer">

        <span>
          {selected.length}
          {" / 2 "}
          selected
        </span>

        <button
          type="button"
          className="v5-mini-commit"
          disabled={
            locked ||
            selected.length !==
              2
          }
          onClick={commit}
        >
          COMMIT ACTIONS →
        </button>

      </div>


      <small className="v5-mini-note">
        There is no single required
        pair. The choice helps reveal
        how you approach uncertainty.
      </small>

    </section>
  );
}


function WingMatchMiniTask({
  task,
  locked,
  onComplete,
}: Props) {

  if (
    task ===
    "control"
  ) {
    return (
      <ControlTask
        locked={locked}
        onComplete={
          onComplete
        }
      />
    );
  }

  return (
    <DiagnosticTask
      locked={locked}
      onComplete={
        onComplete
      }
    />
  );
}


export default WingMatchMiniTask;
