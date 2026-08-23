import type { MissionScene } from "./types";

export const missionScenes: MissionScene[] = [
  {
    id: "atmospheric-entry",
    missionNumber: 1,
    totalMissions: 8,

    phase: "ATMOSPHERIC ENTRY",
    timeRemaining: "T−15:02",
    altitude: "108 km",

    situation:
      "The cargo lander has entered the Martian atmosphere. Plasma is building around the vehicle, communications are becoming unreliable, and heating is running slightly above the predicted model.",

    question:
      "You have only seconds before the vehicle reaches peak heating. What do you prioritize first?",

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

        title: "Protect the thermal margin",

        description:
          "Adjust the entry attitude slightly to reduce heating, even if the trajectory moves closer to the edge of the landing corridor.",

        consequence:
          "Peak heating decreases, but the guidance system now has less trajectory margin to work with.",

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

        title: "Hold the planned corridor",

        description:
          "Keep the current entry attitude while monitoring whether the temperature increase remains within the vehicle's certified margin.",

        consequence:
          "The trajectory remains highly predictable, but the vehicle accepts additional thermal uncertainty.",

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

        title: "Verify before changing course",

        description:
          "Compare multiple temperature sensors and the predicted heating curve before commanding a trajectory change.",

        consequence:
          "You spend precious seconds diagnosing the discrepancy, but gain stronger evidence about whether the warning is real.",

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

        title: "Recalculate the best tradeoff",

        description:
          "Use the updated thermal data to compute a new entry attitude that balances heating, range, and landing accuracy.",

        consequence:
          "The vehicle adopts a new compromise trajectory instead of optimizing a single subsystem.",

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
];