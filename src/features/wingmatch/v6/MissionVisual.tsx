import "./mission-visual.css";


interface MissionVisualOption {
  id: string;
  title: string;
}


interface MissionVisualProps {
  sceneId: string;

  options: MissionVisualOption[];

  activeOptionId:
    | string
    | null;

  selectedOptionId:
    | string
    | null;

  onHover:
    (
      id:
        string
        | null,
    ) => void;

  onChoose:
    (
      id: string,
    ) => void;
}


interface SceneMetric {
  label: string;
  value: string;
  tone?:
    | "warning"
    | "good";
}


interface SceneMeta {
  system: string;

  status: string;

  metrics: SceneMetric[];
}


const SCENE_META:
  Record<
    string,
    SceneMeta
  > = {

    "entry-heat": {
      system:
        "ENTRY SIMULATION",

      status:
        "THERMAL LOAD RISING",

      metrics: [
        {
          label:
            "VELOCITY",

          value:
            "5.82 km/s",
        },

        {
          label:
            "HEAT LOAD",

          value:
            "128%",

          tone:
            "warning",
        },

        {
          label:
            "TARGET ERROR",

          value:
            "3.6 km",
        },
      ],
    },


    "sensor-conflict": {
      system:
        "SENSOR FUSION",

      status:
        "MEASUREMENTS DISAGREE",

      metrics: [
        {
          label:
            "SENSOR A",

          value:
            "14.2 km",
        },

        {
          label:
            "SENSOR B",

          value:
            "16.1 km",

          tone:
            "warning",
        },

        {
          label:
            "MODEL",

          value:
            "15.0 km",
        },
      ],
    },


    "fuel-margin": {
      system:
        "PROPULSION",

      status:
        "RESERVE DECREASING",

      metrics: [
        {
          label:
            "FUEL",

          value:
            "31%",
        },

        {
          label:
            "BURN",

          value:
            "42 s",
        },

        {
          label:
            "RESERVE",

          value:
            "8.4%",

          tone:
            "warning",
        },
      ],
    },


    "structure-vibration": {
      system:
        "STRUCTURAL MONITOR",

      status:
        "VIBRATION DETECTED",

      metrics: [
        {
          label:
            "LOAD",

          value:
            "0.81 g",
        },

        {
          label:
            "VIBRATION",

          value:
            "6.4 Hz",

          tone:
            "warning",
        },

        {
          label:
            "MARGIN",

          value:
            "18%",
        },
      ],
    },


    "power-shortage": {
      system:
        "POWER BUS",

      status:
        "POWER BELOW PLAN",

      metrics: [
        {
          label:
            "AVAILABLE",

          value:
            "72 W",
        },

        {
          label:
            "REQUESTED",

          value:
            "104 W",

          tone:
            "warning",
        },

        {
          label:
            "BATTERY",

          value:
            "63%",
        },
      ],
    },


    "landing-site": {
      system:
        "SITE ANALYSIS",

      status:
        "TWO ROUTES AVAILABLE",

      metrics: [
        {
          label:
            "RANGE",

          value:
            "3.8 km",
        },

        {
          label:
            "SLOPE",

          value:
            "11.4°",
        },

        {
          label:
            "SCIENCE",

          value:
            "HIGH",

          tone:
            "good",
        },
      ],
    },


    "fault-isolation": {
      system:
        "FAULT TREE",

      status:
        "CAUSE UNKNOWN",

      metrics: [
        {
          label:
            "COMMAND",

          value:
            "SENT",
        },

        {
          label:
            "MOTION",

          value:
            "0.0 m",

          tone:
            "warning",
        },

        {
          label:
            "POWER",

          value:
            "NOMINAL",
        },
      ],
    },


    "final-priority": {
      system:
        "MISSION CONTROL",

      status:
        "FINAL OPERATION",

      metrics: [
        {
          label:
            "SAFETY",

          value:
            "84%",
        },

        {
          label:
            "SCIENCE",

          value:
            "71%",
        },

        {
          label:
            "RESERVE",

          value:
            "12%",
        },
      ],
    },
  };


const NODE_POSITIONS = [
  {
    x: 185,
    y: 310,
  },

  {
    x: 500,
    y: 105,
  },

  {
    x: 815,
    y: 310,
  },
];


function EntryVisual() {
  return (
    <g className="aw6-viz-core">

      <path
        className="aw6-mars-horizon"
        d="
          M 80 345
          Q 500 240
          920 345
          L 920 410
          L 80 410
          Z
        "
      />

      <ellipse
        className="aw6-entry-glow"
        cx="500"
        cy="230"
        rx="105"
        ry="60"
      />

      <path
        className="aw6-capsule"
        d="
          M 458 220
          Q 500 160
          542 220
          L 532 260
          Q 500 278
          468 260
          Z
        "
      />

      <path
        className="aw6-heat-line"
        d="
          M 467 264
          Q 500 300
          533 264
        "
      />

      <path
        className="aw6-trajectory"
        d="
          M 720 35
          Q 630 85
          555 160
        "
      />

      <circle
        className="aw6-target"
        cx="660"
        cy="330"
        r="25"
      />

      <circle
        className="aw6-target"
        cx="660"
        cy="330"
        r="8"
      />

    </g>
  );
}


function SensorVisual() {
  return (
    <g className="aw6-viz-core">

      <path
        className="aw6-mars-horizon"
        d="
          M 80 355
          Q 500 285
          920 355
          L 920 410
          L 80 410
          Z
        "
      />

      <rect
        className="aw6-rover-body"
        x="455"
        y="245"
        width="90"
        height="48"
        rx="16"
      />

      <circle
        className="aw6-rover-wheel"
        cx="470"
        cy="305"
        r="16"
      />

      <circle
        className="aw6-rover-wheel"
        cx="530"
        cy="305"
        r="16"
      />

      <circle
        className="aw6-rover-sensor"
        cx="500"
        cy="218"
        r="11"
      />

      <path
        className="aw6-sensor-beam aw6-sensor-beam-a"
        d="
          M 495 218
          L 300 135
        "
      />

      <path
        className="aw6-sensor-beam aw6-sensor-beam-b"
        d="
          M 505 218
          L 700 125
        "
      />

      <circle
        className="aw6-reading aw6-reading-a"
        cx="300"
        cy="135"
        r="34"
      />

      <circle
        className="aw6-reading aw6-reading-b"
        cx="700"
        cy="125"
        r="34"
      />

      <text
        className="aw6-reading-text"
        x="300"
        y="141"
      >
        14.2
      </text>

      <text
        className="aw6-reading-text"
        x="700"
        y="131"
      >
        16.1
      </text>

    </g>
  );
}


function FuelVisual() {
  return (
    <g className="aw6-viz-core">

      <rect
        className="aw6-fuel-tank"
        x="415"
        y="120"
        width="170"
        height="190"
        rx="48"
      />

      <rect
        className="aw6-fuel-level"
        x="433"
        y="235"
        width="134"
        height="57"
        rx="26"
      />

      <path
        className="aw6-engine"
        d="
          M 455 310
          L 480 355
          L 500 315
          L 520 355
          L 545 310
        "
      />

      <path
        className="aw6-thrust"
        d="
          M 475 356
          Q 485 395
          495 360
        "
      />

      <path
        className="aw6-thrust"
        d="
          M 505 360
          Q 518 400
          526 356
        "
      />

      <line
        className="aw6-gauge"
        x1="640"
        y1="150"
        x2="640"
        y2="315"
      />

      <line
        className="aw6-gauge-level"
        x1="640"
        y1="250"
        x2="640"
        y2="315"
      />

    </g>
  );
}


function StructureVisual() {
  return (
    <g className="aw6-viz-core">

      <rect
        className="aw6-lander-body"
        x="430"
        y="150"
        width="140"
        height="100"
        rx="26"
      />

      <line
        className="aw6-leg"
        x1="450"
        y1="245"
        x2="355"
        y2="345"
      />

      <line
        className="aw6-leg"
        x1="550"
        y1="245"
        x2="645"
        y2="345"
      />

      <line
        className="aw6-leg"
        x1="475"
        y1="245"
        x2="450"
        y2="355"
      />

      <line
        className="aw6-leg aw6-leg-alert"
        x1="525"
        y1="245"
        x2="550"
        y2="355"
      />

      <path
        className="aw6-vibration"
        d="
          M 570 250
          q 22 12
          0 24
          q -22 12
          0 24
          q 22 12
          0 24
        "
      />

    </g>
  );
}


function PowerVisual() {
  return (
    <g className="aw6-viz-core">

      <rect
        className="aw6-power-core"
        x="420"
        y="145"
        width="160"
        height="135"
        rx="30"
      />

      <rect
        className="aw6-power-fill"
        x="445"
        y="173"
        width="110"
        height="80"
        rx="17"
      />

      <path
        className="aw6-power-line"
        d="
          M 420 210
          L 270 135
        "
      />

      <path
        className="aw6-power-line"
        d="
          M 580 210
          L 730 135
        "
      />

      <path
        className="aw6-power-line"
        d="
          M 500 280
          L 500 360
        "
      />

      <circle
        className="aw6-subsystem"
        cx="255"
        cy="127"
        r="32"
      />

      <circle
        className="aw6-subsystem"
        cx="745"
        cy="127"
        r="32"
      />

      <circle
        className="aw6-subsystem"
        cx="500"
        cy="370"
        r="32"
      />

    </g>
  );
}


function LandingVisual() {
  return (
    <g className="aw6-viz-core">

      <path
        className="aw6-terrain-line"
        d="
          M 80 335
          L 180 300
          L 270 323
          L 360 270
          L 460 315
          L 560 250
          L 665 292
          L 760 240
          L 920 310
        "
      />

      <path
        className="aw6-route"
        d="
          M 165 320
          Q 390 190
          500 300
          T 820 275
        "
      />

      <circle
        className="aw6-site aw6-site-a"
        cx="270"
        cy="295"
        r="32"
      />

      <circle
        className="aw6-site aw6-site-b"
        cx="550"
        cy="270"
        r="32"
      />

      <circle
        className="aw6-site aw6-site-c"
        cx="790"
        cy="266"
        r="32"
      />

      <text
        className="aw6-site-label"
        x="270"
        y="301"
      >
        A
      </text>

      <text
        className="aw6-site-label"
        x="550"
        y="276"
      >
        B
      </text>

      <text
        className="aw6-site-label"
        x="790"
        y="272"
      >
        C
      </text>

    </g>
  );
}


function FaultVisual() {
  const boxes = [
    {
      x: 130,
      label:
        "SENSOR",
    },

    {
      x: 350,
      label:
        "CONTROL",
    },

    {
      x: 570,
      label:
        "DRIVE",
    },

    {
      x: 790,
      label:
        "WHEEL",
    },
  ];

  return (
    <g className="aw6-viz-core">

      {boxes.map(
        (
          box,
          index,
        ) => (
          <g
            key={
              box.label
            }
          >
            <rect
              className={[
                "aw6-fault-box",

                index === 3
                  ? "aw6-fault-box-alert"
                  : "",
              ].join(
                " ",
              )}
              x={
                box.x - 65
              }
              y="185"
              width="130"
              height="70"
              rx="18"
            />

            <text
              className="aw6-fault-label"
              x={box.x}
              y="226"
            >
              {box.label}
            </text>

            {index <
              boxes.length -
                1 && (
              <line
                className="aw6-fault-link"
                x1={
                  box.x +
                  65
                }
                y1="220"
                x2={
                  boxes[
                    index + 1
                  ].x -
                  65
                }
                y2="220"
              />
            )}
          </g>
        ),
      )}

    </g>
  );
}


function FinalVisual() {
  return (
    <g className="aw6-viz-core">

      <path
        className="aw6-priority-triangle"
        d="
          M 500 90
          L 260 330
          L 740 330
          Z
        "
      />

      <circle
        className="aw6-priority-node"
        cx="500"
        cy="90"
        r="45"
      />

      <circle
        className="aw6-priority-node"
        cx="260"
        cy="330"
        r="45"
      />

      <circle
        className="aw6-priority-node"
        cx="740"
        cy="330"
        r="45"
      />

      <text
        className="aw6-priority-text"
        x="500"
        y="96"
      >
        SAFETY
      </text>

      <text
        className="aw6-priority-text"
        x="260"
        y="336"
      >
        SCIENCE
      </text>

      <text
        className="aw6-priority-text"
        x="740"
        y="336"
      >
        LEARNING
      </text>

    </g>
  );
}


function SceneCore({
  sceneId,
}: {
  sceneId: string;
}) {

  switch (
    sceneId
  ) {

    case "entry-heat":
      return (
        <EntryVisual />
      );

    case "sensor-conflict":
      return (
        <SensorVisual />
      );

    case "fuel-margin":
      return (
        <FuelVisual />
      );

    case "structure-vibration":
      return (
        <StructureVisual />
      );

    case "power-shortage":
      return (
        <PowerVisual />
      );

    case "landing-site":
      return (
        <LandingVisual />
      );

    case "fault-isolation":
      return (
        <FaultVisual />
      );

    case "final-priority":
      return (
        <FinalVisual />
      );

    default:
      return (
        <EntryVisual />
      );
  }
}


function MissionVisual({
  sceneId,
  options,
  activeOptionId,
  selectedOptionId,
  onHover,
  onChoose,
}: MissionVisualProps) {

  const meta =
    SCENE_META[
      sceneId
    ] ??
    SCENE_META[
      "entry-heat"
    ];


  return (
    <section className="aw6-viz-shell">

      <header className="aw6-viz-header">

        <div>
          <span>
            INTERACTIVE MODEL
          </span>

          <strong>
            {meta.system}
          </strong>
        </div>

        <div className="aw6-viz-status">
          <i />
          {meta.status}
        </div>

      </header>


      <div className="aw6-viz-body">

        <aside className="aw6-viz-metrics">

          {meta.metrics.map(
            (
              metric,
            ) => (
              <div
                key={
                  metric.label
                }
                className={[
                  "aw6-viz-metric",

                  metric.tone
                    ? `aw6-viz-metric--${metric.tone}`
                    : "",
                ]
                  .filter(
                    Boolean,
                  )
                  .join(
                    " ",
                  )}
              >

                <span>
                  {
                    metric.label
                  }
                </span>

                <strong>
                  {
                    metric.value
                  }
                </strong>

              </div>
            ),
          )}

        </aside>


        <div className="aw6-viz-canvas">

          <svg
            viewBox="0 0 1000 420"
            role="img"
            aria-label="Interactive mission model"
          >

            <defs>

              <linearGradient
                id="aw6Mars"
                x1="0"
                x2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#8f3f35"
                />

                <stop
                  offset="55%"
                  stopColor="#df7550"
                />

                <stop
                  offset="100%"
                  stopColor="#6e2e33"
                />
              </linearGradient>


              <radialGradient
                id="aw6Heat"
              >
                <stop
                  offset="0%"
                  stopColor="#ffc857"
                  stopOpacity=".72"
                />

                <stop
                  offset="50%"
                  stopColor="#ff6b6b"
                  stopOpacity=".30"
                />

                <stop
                  offset="100%"
                  stopColor="#ff6b6b"
                  stopOpacity="0"
                />
              </radialGradient>

            </defs>


            <g className="aw6-viz-grid">

              {[100, 200, 300].map(
                (y) => (
                  <line
                    key={`h-${y}`}
                    x1="40"
                    y1={y}
                    x2="960"
                    y2={y}
                  />
                ),
              )}

              {[
                200,
                400,
                600,
                800,
              ].map(
                (x) => (
                  <line
                    key={`v-${x}`}
                    x1={x}
                    y1="30"
                    x2={x}
                    y2="390"
                  />
                ),
              )}

            </g>


            <SceneCore
              sceneId={
                sceneId
              }
            />


            <g className="aw6-viz-links">

              {options.map(
                (
                  option,
                  index,
                ) => {

                  const point =
                    NODE_POSITIONS[
                      index
                    ];

                  const active =
                    activeOptionId ===
                    option.id;

                  return (
                    <path
                      key={
                        option.id
                      }
                      className={
                        active
                          ? "is-active"
                          : ""
                      }
                      d={`
                        M 500 225
                        Q ${point.x}
                          ${point.y - 80}
                          ${point.x}
                          ${point.y}
                      `}
                    />
                  );
                },
              )}

            </g>


            {options.map(
              (
                option,
                index,
              ) => {

                const point =
                  NODE_POSITIONS[
                    index
                  ];

                const active =
                  activeOptionId ===
                  option.id;

                const selected =
                  selectedOptionId ===
                  option.id;


                return (
                  <g
                    key={
                      option.id
                    }
                    className={[
                      "aw6-viz-node",

                      active
                        ? "is-active"
                        : "",

                      selected
                        ? "is-selected"
                        : "",
                    ]
                      .filter(
                        Boolean,
                      )
                      .join(
                        " ",
                      )}
                    transform={`
                      translate(
                        ${point.x}
                        ${point.y}
                      )
                    `}
                    role="button"
                    tabIndex={
                      selectedOptionId
                        ? -1
                        : 0
                    }
                    aria-label={
                      `Choose ${option.title}`
                    }
                    onMouseEnter={() =>
                      onHover(
                        option.id,
                      )
                    }
                    onMouseLeave={() =>
                      onHover(
                        null,
                      )
                    }
                    onFocus={() =>
                      onHover(
                        option.id,
                      )
                    }
                    onBlur={() =>
                      onHover(
                        null,
                      )
                    }
                    onClick={() => {
                      if (
                        !selectedOptionId
                      ) {
                        onChoose(
                          option.id,
                        );
                      }
                    }}
                    onKeyDown={
                      (
                        event,
                      ) => {
                        if (
                          selectedOptionId
                        ) {
                          return;
                        }

                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            " "
                        ) {
                          event.preventDefault();

                          onChoose(
                            option.id,
                          );
                        }
                      }
                    }
                  >

                    <circle
                      className="aw6-viz-node-ring"
                      r="31"
                    />

                    <circle
                      className="aw6-viz-node-core"
                      r="9"
                    />

                    <text
                      className="aw6-viz-node-number"
                      x="0"
                      y="57"
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </text>

                  </g>
                );
              },
            )}

          </svg>

        </div>

      </div>


      <footer className="aw6-viz-footer">

        <span>
          Hover a decision to preview its path.
        </span>

        <strong>
          {selectedOptionId
            ? "DECISION LOCKED"
            : activeOptionId
              ? "PATH PREVIEW"
              : "AWAITING INPUT"}
        </strong>

      </footer>

    </section>
  );
}


export default MissionVisual;
