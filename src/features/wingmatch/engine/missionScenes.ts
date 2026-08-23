import type {
  ControllerMissionScene,
  MissionScene,
} from "./types";

export const missionScenes: MissionScene[] = [
  {
    id: "atmospheric-entry",
    missionNumber: 1,
    totalMissions: 8,

    phase: "ATMOSPHERIC ENTRY",
    timeRemaining: "T−15:02",
    altitude: "108 km",

    situation:
      "The lander is entering Mars at 5.4 km/s. Heating is running 8% above the model while communications are degrading.",

    question:
      "Peak heating arrives in seconds. What do you protect first?",

    telemetry: [
      {
        label: "ALTITUDE",
        value: "108 km",
        status: "nominal",
      },
      {
        label: "VELOCITY",
        value: "5.4 km/s",
        status: "nominal",
      },
      {
        label: "THERMAL",
        value: "+8% MODEL",
        status: "warning",
      },
      {
        label: "COMMS",
        value: "DEGRADING",
        status: "uncertain",
      },
    ],

    options: [
      {
        id: "thermal-margin",

        title: "Protect thermal margin",

        description:
          "Reduce heating. Accept less trajectory margin.",

        consequence:
          "Peak heating falls, but guidance has less room to correct the trajectory later.",

        telemetryChanges: [
          {
            label: "THERMAL",
            value: "STABILIZING",
            status: "nominal",
          },
          {
            label: "TRAJECTORY",
            value: "MARGIN ↓",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            thermal: 3,
            gnc: 1,
            systems: 1,
          },

          reasoning: {
            "thermal-reasoning": 3,
            "risk-tolerance": 1,
            "systems-integration": 1,
          },
        },
      },

      {
        id: "hold-corridor",

        title: "Hold the corridor",

        description:
          "Preserve the planned path. Accept more thermal exposure.",

        consequence:
          "The trajectory stays predictable, but the vehicle carries more thermal uncertainty.",

        telemetryChanges: [
          {
            label: "TRAJECTORY",
            value: "ON CORRIDOR",
            status: "nominal",
          },
          {
            label: "THERMAL",
            value: "+9% MODEL",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            gnc: 2,
            "mission-design": 2,
            systems: 1,
          },

          reasoning: {
            "mission-tradeoffs": 2,
            "quantitative-reasoning": 2,
            "risk-tolerance": 2,
          },
        },
      },

      {
        id: "verify-model",

        title: "Verify the signals",

        description:
          "Cross-check sensor evidence. Spend time before acting.",

        consequence:
          "You lose several seconds, but gain stronger evidence about whether the thermal warning is real.",

        telemetryChanges: [
          {
            label: "SENSOR CONFIDENCE",
            value: "RISING",
            status: "nominal",
          },
          {
            label: "DECISION TIME",
            value: "−4 sec",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            avionics: 3,
            systems: 2,
            thermal: 1,
          },

          reasoning: {
            "evidence-first": 3,
            iteration: 2,
            "systems-integration": 2,
          },
        },
      },

      {
        id: "optimize-entry",

        title: "Reoptimize entry",

        description:
          "Balance heating, range, and landing accuracy.",

        consequence:
          "The vehicle adopts a compromise trajectory instead of protecting any single subsystem.",

        telemetryChanges: [
          {
            label: "THERMAL",
            value: "MARGIN +3%",
            status: "nominal",
          },
          {
            label: "LANDING ERROR",
            value: "+0.7 km",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            "mission-design": 3,
            gnc: 2,
            systems: 2,
          },

          reasoning: {
            optimization: 3,
            "mission-tradeoffs": 3,
            "quantitative-reasoning": 2,
          },
        },
      },
    ],
  },

  {
    id: "sensor-disagreement",
    missionNumber: 2,
    totalMissions: 8,

    phase: "SENSOR DISAGREEMENT",
    timeRemaining: "T−11:47",
    altitude: "15.2 km",

    situation:
      "The vehicle has cleared peak heating. Radar altitude reads 14.2 km, but the inertial navigation solution estimates 16.1 km. The landing burn depends on knowing which estimate is closer to reality.",

    question:
      "Two systems disagree. What do you trust next?",

    telemetry: [
      {
        label: "RADAR ALT",
        value: "14.2 km",
        status: "uncertain",
      },
      {
        label: "INERTIAL ALT",
        value: "16.1 km",
        status: "uncertain",
      },
      {
        label: "DISAGREEMENT",
        value: "1.9 km",
        status: "warning",
      },
      {
        label: "BURN WINDOW",
        value: "47 sec",
        status: "warning",
      },
    ],

    options: [
      {
        id: "independent-check",

        title: "Find independent evidence",

        description:
          "Check a third signal before trusting either estimate.",

        consequence:
          "Confidence improves, but several seconds of the burn-planning window are consumed.",

        telemetryChanges: [
          {
            label: "STATE CONFIDENCE",
            value: "RISING",
            status: "nominal",
          },
          {
            label: "BURN WINDOW",
            value: "41 sec",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            avionics: 3,
            systems: 2,
            gnc: 1,
          },

          reasoning: {
            "evidence-first": 3,
            "systems-integration": 2,
            iteration: 1,
          },
        },
      },

      {
        id: "trust-inertial",

        title: "Trust the inertial solution",

        description:
          "Use the vehicle dynamics model. Treat radar as suspect.",

        consequence:
          "The guidance solution stays continuous, but a modeling error could shift the burn timing.",

        telemetryChanges: [
          {
            label: "GUIDANCE",
            value: "CONTINUOUS",
            status: "nominal",
          },
          {
            label: "MODEL RISK",
            value: "ELEVATED",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            gnc: 3,
            "mission-design": 1,
            systems: 1,
          },

          reasoning: {
            "physical-modeling": 3,
            "feedback-control": 2,
            "risk-tolerance": 2,
          },
        },
      },

      {
        id: "isolate-radar",

        title: "Isolate the radar fault",

        description:
          "Test whether the radar stream shows a sensor-specific failure.",

        consequence:
          "Fault isolation may identify a bad sensor, but diagnosis costs valuable descent time.",

        telemetryChanges: [
          {
            label: "RADAR HEALTH",
            value: "TESTING",
            status: "uncertain",
          },
          {
            label: "DECISION TIME",
            value: "−6 sec",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            avionics: 3,
            systems: 1,
          },

          reasoning: {
            "evidence-first": 2,
            iteration: 3,
            "quantitative-reasoning": 1,
          },
        },
      },

      {
        id: "fuse-estimates",

        title: "Fuse all available estimates",

        description:
          "Combine the signals instead of choosing a single winner.",

        consequence:
          "The vehicle gains a blended state estimate, but the result depends on how each sensor is weighted.",

        telemetryChanges: [
          {
            label: "FUSED ALT",
            value: "15.4 km",
            status: "nominal",
          },
          {
            label: "UNCERTAINTY",
            value: "±0.6 km",
            status: "warning",
          },
        ],

        scores: {
          wings: {
            gnc: 3,
            avionics: 2,
            systems: 2,
          },

          reasoning: {
            optimization: 2,
            "quantitative-reasoning": 3,
            "systems-integration": 3,
          },
        },
      },
    ],
  },
];

/*
  Mission 03 is intentionally NOT inside missionScenes yet.

  We are designing its controller-tuning interaction first so the
  current Mission 01 → Mission 02 experience stays fully working.
*/

export const controlOscillationMission: ControllerMissionScene = {
  id: "control-oscillation",
  missionNumber: 3,
  totalMissions: 8,

  phase: "CONTROL OSCILLATION",
  timeRemaining: "T−08:18",
  altitude: "8.6 km",

  situation:
    "The landing burn has started, but the vehicle keeps overshooting its commanded pitch angle. Each correction triggers another correction in the opposite direction.",

  question:
    "Tune the controller so the lander responds quickly without feeding the oscillation.",

  telemetry: [
    {
      label: "PITCH RATE",
      value: "±8.4°/s",
      status: "warning",
    },
    {
      label: "OVERSHOOT",
      value: "28%",
      status: "warning",
    },
    {
      label: "SETTLING TIME",
      value: ">12 sec",
      status: "warning",
    },
    {
      label: "FUEL",
      value: "31%",
      status: "nominal",
    },
  ],

  /*
    Mission 03 will not use normal answer cards.
    The slider interaction will replace these options.
  */
  options: [],

  interaction: "controller-tuning",

  controller: {
    parameterLabel: "Controller Gain",
    parameterShortLabel: "GAIN",

    min: 0.4,
    max: 1.4,
    step: 0.05,

    initialValue: 1.2,

    /*
      Internal simulator range.
      We will NOT display this as "the correct answer."
    */
    stableRange: {
      min: 0.7,
      max: 0.9,
    },

    labels: {
      low: "SLOW RESPONSE",
      high: "AGGRESSIVE RESPONSE",
    },
  },
};
export const activeMissionScenes: MissionScene[] = [
  ...missionScenes,
  controlOscillationMission,
];