export type PrimaryWingId =
  | "gnc"
  | "avionics"
  | "structures"
  | "thermal"
  | "propulsion"
  | "mission-design";


export type ThinkingStyleId =
  | "systems"
  | "evidence"
  | "model"
  | "experiment"
  | "optimize"
  | "risk";


export type WingScores =
  Partial<
    Record<
      PrimaryWingId,
      number
    >
  >;


export type StyleScores =
  Partial<
    Record<
      ThinkingStyleId,
      number
    >
  >;


export type WingEvidence =
  Partial<
    Record<
      PrimaryWingId,
      number
    >
  >;


export interface V5Option {
  id: string;

  title: string;

  description: string;

  consequence: string;

  primaryWing:
    PrimaryWingId;

  wingWeights:
    WingScores;

  styleWeights:
    StyleScores;
}


export interface V5ChoiceMission {
  id: string;

  visualId: string;

  phase: string;

  situation: string;

  question: string;

  options:
    V5Option[];
}


export interface WingProfile {
  id: PrimaryWingId;

  name: string;

  shortName: string;

  simple: string;

  challenge: string;

  areas: string[];
}


export const WING_PROFILES:
  Record<
    PrimaryWingId,
    WingProfile
  > = {

  gnc: {
    id: "gnc",

    name:
      "Guidance, Navigation & Control",

    shortName:
      "GNC",

    simple:
      "You repeatedly paid attention to motion, position, prediction, and how a vehicle corrects itself.",

    challenge:
      "Tune a simple virtual lander and compare how different control settings change its motion.",

    areas: [
      "Aerospace",
      "Robotics",
      "Mechanical Engineering",
    ],
  },


  avionics: {
    id: "avionics",

    name:
      "Avionics",

    shortName:
      "AVIONICS",

    simple:
      "You repeatedly focused on sensors, signals, electronics, and the evidence a vehicle uses to understand what is happening.",

    challenge:
      "Create a small sensor detective that compares signals and flags suspicious data.",

    areas: [
      "Aerospace",
      "Electrical Engineering",
      "Computer Engineering",
    ],
  },


  structures: {
    id: "structures",

    name:
      "Aerospace Structures",

    shortName:
      "STRUCTURES",

    simple:
      "You repeatedly focused on forces, physical design, strength, and how to keep a vehicle lightweight.",

    challenge:
      "Compare two lightweight landing-leg designs and explain which one you would improve.",

    areas: [
      "Aerospace",
      "Mechanical Engineering",
      "Materials",
    ],
  },


  thermal: {
    id: "thermal",

    name:
      "Thermal Engineering",

    shortName:
      "THERMAL",

    simple:
      "You repeatedly paid attention to heat, temperature limits, energy flow, and thermal margin.",

    challenge:
      "Compare two simple spacecraft cooling strategies and see how each changes temperature.",

    areas: [
      "Aerospace",
      "Mechanical Engineering",
      "Energy",
    ],
  },


  propulsion: {
    id: "propulsion",

    name:
      "Propulsion",

    shortName:
      "PROPULSION",

    simple:
      "You repeatedly focused on energy, fuel, performance, and what it takes to move a spacecraft.",

    challenge:
      "Compare two virtual propulsion choices for the same mission and explain the tradeoff.",

    areas: [
      "Aerospace",
      "Mechanical Engineering",
      "Energy Systems",
    ],
  },


  "mission-design": {
    id:
      "mission-design",

    name:
      "Mission Design",

    shortName:
      "MISSION DESIGN",

    simple:
      "You repeatedly focused on the mission objective itself — what is worth doing and which tradeoffs best serve that goal.",

    challenge:
      "Design a tiny Mars mission with one goal and only three limited resources.",

    areas: [
      "Aerospace",
      "Space Science",
      "Systems",
    ],
  },
};


export const STYLE_NAMES:
  Record<
    ThinkingStyleId,
    string
  > = {

  systems:
    "Whole-System Thinker",

  evidence:
    "Evidence Seeker",

  model:
    "Model-Driven Thinker",

  experiment:
    "Experimenter",

  optimize:
    "Optimizer",

  risk:
    "Decisive Risk-Taker",
};


/*
 * V5 DESIGN PRINCIPLE
 *
 * The three options in each mission
 * should all be technically defensible.
 *
 * Students should NOT be able to
 * identify a socially desirable or
 * obviously "smart" response.
 *
 * Primary Wing scoring is separate
 * from Thinking Style scoring.
 *
 * These weights are PROVISIONAL.
 * AltWing must not call this a
 * scientifically validated assessment
 * until real pilot data are collected.
 */

export const V5_CHOICE_MISSIONS:
  V5ChoiceMission[] = [

  /*
   * MISSION 01
   *
   * All three choices ask for useful
   * information before landing.
   */

  {
    id:
      "landing-intelligence",

    visualId:
      "landing-choice",

    phase:
      "LANDING",

    situation:
      "You can request ONE more data product before choosing the landing site.",

    question:
      "Which information would you want?",

    options: [

      {
        id:
          "terrain-scan",

        title:
          "A closer terrain scan",

        description:
          "See slope, rocks, and surface shape in more detail.",

        consequence:
          "You requested more information about the physical landing surface.",

        primaryWing:
          "structures",

        wingWeights: {
          structures: 1.00,
          "mission-design": 0.17,
        },

        styleWeights: {
          evidence: 0.65,
          systems: 0.25,
        },
      },


      {
        id:
          "fuel-forecast",

        title:
          "A fuel-use forecast",

        description:
          "See how much maneuvering each site would require.",

        consequence:
          "You requested more information about energy and maneuver cost.",

        primaryWing:
          "propulsion",

        wingWeights: {
          propulsion: 1.00,
          structures: 0.17,
        },

        styleWeights: {
          model: 0.60,
          optimize: 0.40,
        },
      },


      {
        id:
          "science-map",

        title:
          "A science-value map",

        description:
          "See which site contains the most valuable target.",

        consequence:
          "You requested more information about the mission's scientific payoff.",

        primaryWing:
          "mission-design",

        wingWeights: {
          "mission-design": 1.00,
          propulsion: 0.17,
        },

        styleWeights: {
          systems: 0.35,
          risk: 0.30,
        },
      },
    ],
  },


  /*
   * MISSION 02
   */

  {
    id:
      "sensor-conflict",

    visualId:
      "sensor-problem",

    phase:
      "SENSORS",

    situation:
      "Two altitude estimates disagree and the landing burn is getting closer.",

    question:
      "Which approach would you use next?",

    options: [

      {
        id:
          "independent-reading",

        title:
          "Get an independent reading",

        description:
          "Use another sensor to check the disagreement.",

        consequence:
          "You gathered another independent signal before relying on either estimate.",

        primaryWing:
          "avionics",

        wingWeights: {
          avionics: 1.00,
          thermal: 0.17,
        },

        styleWeights: {
          evidence: 0.75,
          experiment: 0.20,
        },
      },


      {
        id:
          "motion-prediction",

        title:
          "Use the motion prediction",

        description:
          "Compare both readings against how the vehicle should be moving.",

        consequence:
          "You used a physical model of the vehicle to judge the conflicting measurements.",

        primaryWing:
          "gnc",

        wingWeights: {
          gnc: 1.00,
          avionics: 0.17,
        },

        styleWeights: {
          model: 0.78,
          evidence: 0.18,
        },
      },


      {
        id:
          "mission-context",

        title:
          "Check what the next maneuver needs",

        description:
          "Judge the disagreement based on what matters for the upcoming burn.",

        consequence:
          "You evaluated the sensor disagreement in the context of the mission objective.",

        primaryWing:
          "mission-design",

        wingWeights: {
          "mission-design": 1.00,
          propulsion: 0.17,
        },

        styleWeights: {
          systems: 0.62,
          risk: 0.18,
        },
      },
    ],
  },


  /*
   * MISSION 04
   */

  {
    id:
      "thermal-limits",

    visualId:
      "overheating-system",

    phase:
      "THERMAL",

    situation:
      "The spacecraft is hotter than expected. You can inspect ONE model before changing the plan.",

    question:
      "What would you inspect first?",

    options: [

      {
        id:
          "engine-margin",

        title:
          "Engine performance margin",

        description:
          "Check whether heat is reducing the propulsion system's usable performance.",

        consequence:
          "You focused on how temperature could affect propulsion performance.",

        primaryWing:
          "propulsion",

        wingWeights: {
          propulsion: 1.00,
          structures: 0.17,
        },

        styleWeights: {
          model: 0.45,
          risk: 0.25,
        },
      },


      {
        id:
          "electronics-margin",

        title:
          "Electronics temperature margin",

        description:
          "Check how close sensors and computers are to their limits.",

        consequence:
          "You focused on the temperature limits of the spacecraft electronics.",

        primaryWing:
          "avionics",

        wingWeights: {
          avionics: 1.00,
          "mission-design": 0.17,
        },

        styleWeights: {
          evidence: 0.45,
          systems: 0.35,
        },
      },


      {
        id:
          "heat-flow",

        title:
          "The spacecraft heat-flow map",

        description:
          "See where heat is entering, moving, and leaving the vehicle.",

        consequence:
          "You focused on understanding heat movement through the whole spacecraft.",

        primaryWing:
          "thermal",

        wingWeights: {
          thermal: 1.00,
          gnc: 0.17,
        },

        styleWeights: {
          systems: 0.58,
          optimize: 0.32,
        },
      },
    ],
  },


  /*
   * MISSION 05
   */

  {
    id:
      "landing-structure",

    visualId:
      "landing-leg",

    phase:
      "STRUCTURE",

    situation:
      "A landing leg is showing unexpected stress. You can inspect ONE additional data view.",

    question:
      "Which view would you request?",

    options: [

      {
        id:
          "strain-map",

        title:
          "A strain map",

        description:
          "See where the structure is deforming the most.",

        consequence:
          "You requested direct evidence about how the structure is carrying load.",

        primaryWing:
          "structures",

        wingWeights: {
          structures: 1.00,
          avionics: 0.17,
        },

        styleWeights: {
          evidence: 0.62,
          model: 0.22,
        },
      },


      {
        id:
          "touchdown-motion",

        title:
          "A touchdown-motion simulation",

        description:
          "See how vehicle motion changes the force on the leg.",

        consequence:
          "You connected vehicle motion to the structural load during touchdown.",

        primaryWing:
          "gnc",

        wingWeights: {
          gnc: 1.00,
          "mission-design": 0.17,
        },

        styleWeights: {
          model: 0.62,
          experiment: 0.20,
        },
      },


      {
        id:
          "temperature-map",

        title:
          "A temperature map",

        description:
          "See whether heating is changing material behavior.",

        consequence:
          "You investigated whether temperature could be changing structural performance.",

        primaryWing:
          "thermal",

        wingWeights: {
          thermal: 1.00,
          structures: 0.17,
        },

        styleWeights: {
          systems: 0.42,
          model: 0.38,
        },
      },
    ],
  },


  /*
   * MISSION 07
   */

  {
    id:
      "remaining-power",

    visualId:
      "power-budget",

    phase:
      "POWER",

    situation:
      "The rover has enough energy for ONE major activity before night.",

    question:
      "Which information would drive your decision?",

    options: [

      {
        id:
          "downlink-window",

        title:
          "The next communication window",

        description:
          "See when Earth can reliably receive the rover's data.",

        consequence:
          "You prioritized information about returning data through the communication system.",

        primaryWing:
          "avionics",

        wingWeights: {
          avionics: 1.00,
          propulsion: 0.17,
        },

        styleWeights: {
          systems: 0.48,
          evidence: 0.28,
        },
      },


      {
        id:
          "science-window",

        title:
          "The remaining science opportunity",

        description:
          "See what could still be learned before the mission pauses.",

        consequence:
          "You prioritized information about the value of the remaining mission opportunity.",

        primaryWing:
          "mission-design",

        wingWeights: {
          "mission-design": 1.00,
          propulsion: 0.17,
        },

        styleWeights: {
          risk: 0.55,
          systems: 0.22,
        },
      },


      {
        id:
          "energy-forecast",

        title:
          "The full energy forecast",

        description:
          "See how each possible activity changes the remaining power margin.",

        consequence:
          "You prioritized understanding the spacecraft's remaining energy budget.",

        primaryWing:
          "propulsion",

        wingWeights: {
          propulsion: 1.00,
          thermal: 0.17,
        },

        styleWeights: {
          optimize: 0.68,
          model: 0.24,
        },
      },
    ],
  },


  /*
   * MISSION 08
   */

  {
    id:
      "final-upgrade",

    visualId:
      "unstable-lander",

    phase:
      "FINAL APPROACH",

    situation:
      "Before the final descent you can improve ONE part of the vehicle.",

    question:
      "Which improvement would you choose?",

    options: [

      {
        id:
          "navigation-update",

        title:
          "Improve the navigation update",

        description:
          "Reduce uncertainty in where the vehicle thinks it is.",

        consequence:
          "You used the final improvement on navigation and vehicle-state accuracy.",

        primaryWing:
          "gnc",

        wingWeights: {
          gnc: 1.00,
          structures: 0.17,
        },

        styleWeights: {
          model: 0.58,
          evidence: 0.28,
        },
      },


      {
        id:
          "lighter-gear",

        title:
          "Improve the landing structure",

        description:
          "Reduce mass while keeping the landing gear strong.",

        consequence:
          "You used the final improvement on structural efficiency.",

        primaryWing:
          "structures",

        wingWeights: {
          structures: 1.00,
          propulsion: 0.17,
        },

        styleWeights: {
          optimize: 0.50,
          evidence: 0.28,
        },
      },


      {
        id:
          "thermal-buffer",

        title:
          "Increase the thermal buffer",

        description:
          "Give critical systems more temperature margin during descent.",

        consequence:
          "You used the final improvement on thermal protection and margin.",

        primaryWing:
          "thermal",

        wingWeights: {
          thermal: 1.00,
          "mission-design": 0.17,
        },

        styleWeights: {
          systems: 0.48,
          risk: 0.22,
        },
      },
    ],
  },
];


export function addWeights<
  T extends string
>(
  current:
    Partial<
      Record<T, number>
    >,

  incoming:
    Partial<
      Record<T, number>
    >,
) {
  const next = {
    ...current,
  };

  Object.entries(
    incoming,
  ).forEach(
    ([key, value]) => {

      if (
        typeof value !==
        "number"
      ) {
        return;
      }

      const id =
        key as T;

      next[id] =
        (
          next[id] ??
          0
        ) +
        value;
    },
  );

  return next;
}


export function rankScores<
  T extends string
>(
  scores:
    Partial<
      Record<T, number>
    >,
) {
  return Object.entries(
    scores,
  )
    .filter(
      (
        item,
      ): item is [
        T,
        number,
      ] =>
        typeof item[1] ===
        "number",
    )
    .sort(
      (
        a,
        b,
      ) =>
        b[1] -
        a[1],
    );
}
