import type {
  MissionScene,
} from "./types";


export const beginnerMissions:
  MissionScene[] = [

  {
    id: "landing-choice",

    missionNumber: 1,
    totalMissions: 6,

    phase: "LANDING",
    timeRemaining: "MISSION 01",
    altitude: "2.8 km",

    situation:
      "Your Mars lander is approaching three possible landing zones.",

    question:
      "Where would you land?",

    telemetry: [],

    options: [
      {
        id: "landing-safe",

        title: "Choose the safest area",

        description:
          "Flat ground, but less interesting science.",

        consequence:
          "You protected the vehicle first, even if it meant giving up some science.",

        telemetryChanges: [],

        scores: {
          wings: {
            systems: 2,
            gnc: 2,
            "mission-design": 1,
          },

          reasoning: {
            "risk-tolerance": 1,
            "mission-tradeoffs": 2,
          },
        },
      },

      {
        id: "landing-balanced",

        title: "Choose the balanced area",

        description:
          "Moderate risk with a strong science opportunity.",

        consequence:
          "You balanced safety and mission value instead of maximizing either one.",

        telemetryChanges: [],

        scores: {
          wings: {
            systems: 3,
            "mission-design": 2,
            gnc: 1,
          },

          reasoning: {
            "systems-integration": 3,
            "mission-tradeoffs": 3,
            optimization: 2,
          },
        },
      },

      {
        id: "landing-science",

        title: "Go for the science",

        description:
          "Rockier ground, but the most exciting target.",

        consequence:
          "You accepted more landing risk for a bigger possible scientific payoff.",

        telemetryChanges: [],

        scores: {
          wings: {
            "mission-design": 3,
            gnc: 1,
          },

          reasoning: {
            "risk-tolerance": 3,
            "mission-tradeoffs": 2,
          },
        },
      },
    ],
  },


  {
    id: "sensor-problem",

    missionNumber: 2,
    totalMissions: 6,

    phase: "SENSORS",
    timeRemaining: "MISSION 02",
    altitude: "15 km",

    situation:
      "Two sensors give different altitude readings.",

    question:
      "What would you do first?",

    telemetry: [],

    options: [
      {
        id: "sensor-check",

        title: "Check one more source",

        description:
          "Get another measurement before deciding.",

        consequence:
          "You spent extra time gathering evidence before committing.",

        telemetryChanges: [],

        scores: {
          wings: {
            avionics: 3,
            systems: 2,
          },

          reasoning: {
            "evidence-first": 3,
            iteration: 2,
          },
        },
      },

      {
        id: "sensor-model",

        title: "Trust the motion model",

        description:
          "Use what the vehicle's movement predicts.",

        consequence:
          "You trusted the physical model and kept the vehicle moving.",

        telemetryChanges: [],

        scores: {
          wings: {
            gnc: 3,
            systems: 1,
          },

          reasoning: {
            "physical-modeling": 3,
            "feedback-control": 2,
          },
        },
      },

      {
        id: "sensor-combine",

        title: "Combine both readings",

        description:
          "Use both signals instead of choosing only one.",

        consequence:
          "You combined imperfect information into one working estimate.",

        telemetryChanges: [],

        scores: {
          wings: {
            gnc: 2,
            avionics: 2,
            systems: 3,
          },

          reasoning: {
            "systems-integration": 3,
            optimization: 2,
            "quantitative-reasoning": 2,
          },
        },
      },
    ],
  },


  {
    id: "unstable-lander",

    missionNumber: 3,
    totalMissions: 6,

    phase: "CONTROL",
    timeRemaining: "MISSION 03",
    altitude: "8 km",

    situation:
      "The lander keeps tilting too far every time it tries to correct itself.",

    question:
      "How would you fix it?",

    telemetry: [],

    options: [
      {
        id: "control-small",

        title: "Make smaller corrections",

        description:
          "Reduce how strongly the lander reacts.",

        consequence:
          "You chose a calmer response to avoid making the oscillation worse.",

        telemetryChanges: [],

        scores: {
          wings: {
            gnc: 3,
            systems: 1,
          },

          reasoning: {
            "feedback-control": 3,
            "risk-tolerance": 1,
          },
        },
      },

      {
        id: "control-test",

        title: "Test a few settings",

        description:
          "Adjust, observe, and keep improving.",

        consequence:
          "You treated the problem as something to learn through repeated testing.",

        telemetryChanges: [],

        scores: {
          wings: {
            gnc: 3,
            systems: 2,
          },

          reasoning: {
            iteration: 3,
            "feedback-control": 3,
            optimization: 2,
          },
        },
      },

      {
        id: "control-fast",

        title: "Correct it quickly",

        description:
          "Use a stronger response to reach the target faster.",

        consequence:
          "You prioritized speed even though the stronger correction could overshoot.",

        telemetryChanges: [],

        scores: {
          wings: {
            gnc: 2,
            propulsion: 1,
          },

          reasoning: {
            "risk-tolerance": 3,
            "feedback-control": 1,
          },
        },
      },
    ],
  },


  {
    id: "overheating-system",

    missionNumber: 4,
    totalMissions: 6,

    phase: "HEAT",
    timeRemaining: "MISSION 04",
    altitude: "4 km",

    situation:
      "The spacecraft is getting too hot, but cooling power is limited.",

    question:
      "Where would you use the cooling?",

    telemetry: [],

    options: [
      {
        id: "heat-engine",

        title: "Protect the engine",

        description:
          "Keep propulsion available for the landing.",

        consequence:
          "You protected the system that keeps the vehicle moving.",

        telemetryChanges: [],

        scores: {
          wings: {
            propulsion: 3,
            thermal: 2,
          },

          reasoning: {
            "thermal-reasoning": 2,
            "mission-tradeoffs": 2,
          },
        },
      },

      {
        id: "heat-computer",

        title: "Protect the computers",

        description:
          "Keep sensors and flight electronics healthy.",

        consequence:
          "You prioritized the electronics the vehicle needs to sense and decide.",

        telemetryChanges: [],

        scores: {
          wings: {
            avionics: 3,
            thermal: 2,
            systems: 1,
          },

          reasoning: {
            "thermal-reasoning": 2,
            "systems-integration": 2,
          },
        },
      },

      {
        id: "heat-balance",

        title: "Spread the cooling",

        description:
          "Protect several systems instead of only one.",

        consequence:
          "You distributed limited resources across the whole vehicle.",

        telemetryChanges: [],

        scores: {
          wings: {
            thermal: 3,
            systems: 3,
          },

          reasoning: {
            "thermal-reasoning": 3,
            "systems-integration": 3,
            "mission-tradeoffs": 3,
          },
        },
      },
    ],
  },


  {
    id: "landing-leg",

    missionNumber: 5,
    totalMissions: 6,

    phase: "STRUCTURE",
    timeRemaining: "MISSION 05",
    altitude: "1 km",

    situation:
      "One landing leg may be carrying too much force.",

    question:
      "What would you do?",

    telemetry: [],

    options: [
      {
        id: "structure-strong",

        title: "Strengthen the main leg",

        description:
          "Add material where the force looks highest.",

        consequence:
          "You protected the strongest load path even though it added weight.",

        telemetryChanges: [],

        scores: {
          wings: {
            structures: 3,
            systems: 1,
          },

          reasoning: {
            "quantitative-reasoning": 2,
            "mission-tradeoffs": 2,
          },
        },
      },

      {
        id: "structure-inspect",

        title: "Inspect before changing it",

        description:
          "Find the weak point before adding material.",

        consequence:
          "You gathered more evidence before changing the structure.",

        telemetryChanges: [],

        scores: {
          wings: {
            structures: 3,
            systems: 2,
          },

          reasoning: {
            "evidence-first": 3,
            iteration: 2,
          },
        },
      },

      {
        id: "structure-light",

        title: "Keep it lightweight",

        description:
          "Use the smallest reinforcement you think will work.",

        consequence:
          "You tried to protect structural strength without giving up too much mass.",

        telemetryChanges: [],

        scores: {
          wings: {
            structures: 3,
            "mission-design": 1,
          },

          reasoning: {
            optimization: 3,
            "mission-tradeoffs": 3,
          },
        },
      },
    ],
  },


  {
    id: "power-budget",

    missionNumber: 6,
    totalMissions: 6,

    phase: "FINAL MISSION",
    timeRemaining: "MISSION 06",
    altitude: "LANDED",

    situation:
      "The rover has only 20% power left for its final day on Mars.",

    question:
      "What matters most now?",

    telemetry: [],

    options: [
      {
        id: "power-home",

        title: "Send the data home",

        description:
          "Use power for communications before anything else.",

        consequence:
          "You protected the mission's ability to return what it learned.",

        telemetryChanges: [],

        scores: {
          wings: {
            avionics: 2,
            systems: 2,
            "mission-design": 2,
          },

          reasoning: {
            "mission-tradeoffs": 3,
            "systems-integration": 2,
          },
        },
      },

      {
        id: "power-science",

        title: "Do one last experiment",

        description:
          "Use the remaining energy for science.",

        consequence:
          "You prioritized the mission objective even with little power remaining.",

        telemetryChanges: [],

        scores: {
          wings: {
            "mission-design": 3,
            propulsion: 1,
          },

          reasoning: {
            "risk-tolerance": 3,
            "mission-tradeoffs": 2,
          },
        },
      },

      {
        id: "power-balance",

        title: "Save enough for both",

        description:
          "Split power between science and communication.",

        consequence:
          "You built a balanced plan instead of maximizing one objective.",

        telemetryChanges: [],

        scores: {
          wings: {
            systems: 3,
            "mission-design": 2,
            propulsion: 2,
          },

          reasoning: {
            "systems-integration": 3,
            optimization: 3,
            "mission-tradeoffs": 3,
          },
        },
      },
    ],
  },
];


export default beginnerMissions;
