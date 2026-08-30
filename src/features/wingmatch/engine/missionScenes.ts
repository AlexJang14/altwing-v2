import type {
  ControllerMissionScene,
  MissionScene,
} from "./types";

export const missionScenes: MissionScene[] = [
  {
    id: "atmospheric-entry",
    missionNumber: 1,
    totalMissions: 8,

    phase: "MARS ENTRY",
    timeRemaining: "T−15:02",
    altitude: "108 km",

    situation:
      "Peak heating in seconds. Heat is +8% and comms are fading.",

    question:
      "Heat spike. Your move?",

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

        title: "COOL DOWN",

        description:
          "Reduce heat. Lose trajectory margin.",

        consequence:
          "Heating drops, but the vehicle has less room to correct its path later.",

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

        title: "HOLD COURSE",

        description:
          "Protect the landing path. Accept more heat.",

        consequence:
          "The landing corridor stays predictable, but thermal exposure increases.",

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

        title: "CHECK SIGNALS",

        description:
          "Verify the warning. Lose 4 seconds.",

        consequence:
          "You spend time checking the data, but gain stronger evidence before changing the flight path.",

        telemetryChanges: [
          {
            label: "CONFIDENCE",
            value: "RISING",
            status: "nominal",
          },
          {
            label: "TIME",
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
    ],
  },

  {
    id: "sensor-disagreement",
    missionNumber: 2,
    totalMissions: 8,

    phase: "NAVIGATION",
    timeRemaining: "T−11:47",
    altitude: "15.2 km",

    situation:
      "Radar says 14.2 km. Inertial says 16.1 km. Burn window: 47 seconds.",

    question:
      "Altitude conflict. Your move?",

    telemetry: [
      {
        label: "RADAR",
        value: "14.2 km",
        status: "uncertain",
      },
      {
        label: "INERTIAL",
        value: "16.1 km",
        status: "uncertain",
      },
      {
        label: "GAP",
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

        title: "SCAN THIRD SENSOR",

        description:
          "Get one more reading. Costs time.",

        consequence:
          "Another signal improves confidence, but the burn window gets shorter.",

        telemetryChanges: [
          {
            label: "CONFIDENCE",
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

        title: "TRUST INERTIAL",

        description:
          "Act now on the dynamics model.",

        consequence:
          "Guidance stays continuous, but a model error could shift the landing burn.",

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
        id: "fuse-estimates",

        title: "FUSE BOTH",

        description:
          "Blend both estimates. Keep some uncertainty.",

        consequence:
          "The vehicle gets one blended altitude estimate without fully trusting either sensor.",

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

export const controlOscillationMission: ControllerMissionScene = {
  id: "control-oscillation",
  missionNumber: 3,
  totalMissions: 8,

  phase: "FLIGHT CONTROL",
  timeRemaining: "T−08:18",
  altitude: "8.6 km",

  situation:
    "Pitch keeps swinging past target. Every correction triggers another.",

  question:
    "Stop the oscillation.",

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

  options: [],

  interaction: "controller-tuning",

  controller: {
    parameterLabel: "Controller Gain",
    parameterShortLabel: "GAIN",

    min: 0.4,
    max: 1.4,
    step: 0.05,

    initialValue: 1.2,

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
