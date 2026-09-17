export type WingId =
  | "propulsion"
  | "gnc"
  | "structures"
  | "thermal"
  | "avionics"
  | "mission-design"
  | "aerodynamics"
  | "orbital-mechanics"
  | "robotics-autonomy";


export type WingRelease =
  | "core"
  | "expansion";


export interface EngineeringSource {
  organization: string;
  title: string;
  url: string;

  purpose: string;
}


export interface WingBuildSpec {
  wingId: WingId;

  release: WingRelease;

  wingName: string;

  buildTitle: string;

  mission: string;

  beginnerQuestion: string;

  concepts: string[];

  actions: string[];

  proofOfFlight: string[];

  modelDisclosure: string;

  sources: EngineeringSource[];
}


export const WING_BUILD_CATALOG:
  Record<
    WingId,
    WingBuildSpec
  > = {


  /* =======================================================
     CORE 01 — PROPULSION
     ======================================================= */

  propulsion: {
    wingId:
      "propulsion",

    release:
      "core",

    wingName:
      "Propulsion",

    buildTitle:
      "Engine Tradeoff",

    mission:
      "Choose an engine for an ARES spacecraft maneuver.",

    beginnerQuestion:
      "Would you rather have a stronger push or use the same propellant more efficiently?",

    concepts: [
      "thrust",
      "specific impulse",
      "propellant mass",
      "mass ratio",
      "delta-v",
    ],

    actions: [
      "Choose between two fictional engine concepts",
      "Change spacecraft payload",
      "Run the propulsion model",
      "Compare delta-v and burn time",
      "Revise the design",
      "Defend the final engine choice",
    ],

    proofOfFlight: [
      "initial engine choice",
      "simulation result",
      "design revision",
      "final engine choice",
      "engineering reasoning",
    ],

    modelDisclosure:
      "Engine parameters are fictional learning cases. The physics relationships are grounded in NASA propulsion references.",

    sources: [
      {
        organization:
          "NASA Small Spacecraft Systems Virtual Institute",

        title:
          "4.0 In-Space Propulsion",

        url:
          "https://www.nasa.gov/smallsat-institute/sst-soa/in-space_propulsion/",

        purpose:
          "Spacecraft propulsion systems and technology tradeoffs",
      },

      {
        organization:
          "NASA Glenn Research Center",

        title:
          "Ideal Rocket Equation",

        url:
          "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/",

        purpose:
          "Delta-v, specific impulse, and mass-ratio relationship",
      },

      {
        organization:
          "NASA Glenn Research Center",

        title:
          "Specific Impulse",

        url:
          "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/specific-impulse/",

        purpose:
          "Propulsion efficiency and propellant-flow concepts",
      },
    ],
  },


  /* =======================================================
     CORE 02 — GNC
     ======================================================= */

  gnc: {
    wingId:
      "gnc",

    release:
      "core",

    wingName:
      "Guidance, Navigation & Control",

    buildTitle:
      "Lost Sensor",

    mission:
      "Keep a Mars lander on course when its navigation sensors disagree.",

    beginnerQuestion:
      "What should a spacecraft trust when two sensors disagree?",

    concepts: [
      "guidance",
      "navigation",
      "control",
      "state estimation",
      "sensor uncertainty",
      "trajectory correction",
    ],

    actions: [
      "Inspect conflicting sensor readings",
      "Compare them with predicted vehicle motion",
      "Estimate the vehicle state",
      "Choose a correction",
      "Observe landing error",
      "Revise the correction",
    ],

    proofOfFlight: [
      "initial trust decision",
      "navigation estimate",
      "correction command",
      "trajectory result",
      "final reasoning",
    ],

    modelDisclosure:
      "The navigation simulation is simplified for learning. NASA references provide the underlying spacecraft GN&C concepts.",

    sources: [
      {
        organization:
          "NASA Small Spacecraft Systems Virtual Institute",

        title:
          "5.0 Guidance, Navigation, and Control",

        url:
          "https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/",

        purpose:
          "Spacecraft guidance, navigation, attitude determination, and control",
      },
    ],
  },


  /* =======================================================
     CORE 03 — STRUCTURES
     ======================================================= */

  structures: {
    wingId:
      "structures",

    release:
      "core",

    wingName:
      "Structures",

    buildTitle:
      "Survive Touchdown",

    mission:
      "Make a Mars landing structure lighter without making touchdown unsafe.",

    beginnerQuestion:
      "How much material can you remove before the structure becomes too weak?",

    concepts: [
      "load",
      "stress",
      "strength",
      "structural mass",
      "safety margin",
    ],

    actions: [
      "Choose a landing-leg design",
      "Change structural area",
      "Change landing load",
      "Compare stress with the design limit",
      "Reduce mass",
      "Defend the final structure",
    ],

    proofOfFlight: [
      "initial structure",
      "calculated stress",
      "safety result",
      "mass change",
      "final design reasoning",
    ],

    modelDisclosure:
      "The structural analysis is a simplified learning model, not a flight-certified structural analysis.",

    sources: [
      {
        organization:
          "NASA Small Spacecraft Systems Virtual Institute",

        title:
          "6.0 Structures, Materials, and Mechanisms",

        url:
          "https://www.nasa.gov/smallsat-institute/sst-soa/structures-materials-and-mechanisms/",

        purpose:
          "Spacecraft structures, materials, mechanisms, and design considerations",
      },
    ],
  },


  /* =======================================================
     CORE 04 — THERMAL
     ======================================================= */

  thermal: {
    wingId:
      "thermal",

    release:
      "core",

    wingName:
      "Thermal Engineering",

    buildTitle:
      "Keep It Alive",

    mission:
      "Keep a small spacecraft within its safe temperature range through sunlight and eclipse.",

    beginnerQuestion:
      "Would you change the surface, add insulation, or spend limited electrical power on heaters?",

    concepts: [
      "heat balance",
      "absorptivity",
      "emissivity",
      "radiation",
      "insulation",
      "heater power",
    ],

    actions: [
      "Choose spacecraft surface properties",
      "Choose insulation",
      "Allocate heater power",
      "Run hot and cold cases",
      "Observe spacecraft temperatures",
      "Revise the thermal strategy",
    ],

    proofOfFlight: [
      "thermal configuration",
      "hot-case result",
      "cold-case result",
      "power used",
      "final strategy",
    ],

    modelDisclosure:
      "The thermal model simplifies real spacecraft heat-transfer analysis while retaining NASA thermal-control concepts.",

    sources: [
      {
        organization:
          "NASA Small Spacecraft Systems Virtual Institute",

        title:
          "7.0 Thermal Control",

        url:
          "https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/",

        purpose:
          "Spacecraft passive and active thermal-control systems",
      },
    ],
  },


  /* =======================================================
     CORE 05 — AVIONICS
     ======================================================= */

  avionics: {
    wingId:
      "avionics",

    release:
      "core",

    wingName:
      "Avionics",

    buildTitle:
      "Find the Fault",

    mission:
      "A Mars rover receives a wheel command but does not move. Find where the command chain failed.",

    beginnerQuestion:
      "What should you test first when a spacecraft command appears to fail?",

    concepts: [
      "sensors",
      "telemetry",
      "onboard computing",
      "flight software",
      "command and data handling",
      "fault isolation",
    ],

    actions: [
      "Inspect spacecraft telemetry",
      "Trace the command path",
      "Choose diagnostic tests",
      "Eliminate possible causes",
      "Identify the likely failure",
      "Defend the diagnosis",
    ],

    proofOfFlight: [
      "first hypothesis",
      "diagnostic tests",
      "evidence collected",
      "fault isolated",
      "final reasoning",
    ],

    modelDisclosure:
      "The failure is fictional. The spacecraft avionics architecture is based on NASA avionics concepts.",

    sources: [
      {
        organization:
          "NASA Small Spacecraft Systems Virtual Institute",

        title:
          "8.0 Small Spacecraft Avionics",

        url:
          "https://www.nasa.gov/smallsat-institute/sst-soa/small-spacecraft-avionics/",

        purpose:
          "Spacecraft computing, interfaces, software, and avionics architecture",
      },
    ],
  },


  /* =======================================================
     CORE 06 — MISSION DESIGN
     ======================================================= */

  "mission-design": {
    wingId:
      "mission-design",

    release:
      "core",

    wingName:
      "Mission Design",

    buildTitle:
      "Build a Mars Mission",

    mission:
      "Design a Mars mission when mass, power, science, risk, cost, and schedule cannot all be maximized.",

    beginnerQuestion:
      "What do you protect when every good mission choice costs something else?",

    concepts: [
      "requirements",
      "constraints",
      "decision criteria",
      "alternatives",
      "trade studies",
      "risk",
      "mission success",
    ],

    actions: [
      "Choose the mission objective",
      "Choose decision criteria",
      "Compare mission architectures",
      "Change criterion importance",
      "Review the trade matrix",
      "Defend the final recommendation",
    ],

    proofOfFlight: [
      "mission objective",
      "criteria",
      "alternatives",
      "trade-study result",
      "final recommendation",
      "decision rationale",
    ],

    modelDisclosure:
      "The mission trade study is simplified from NASA systems-engineering decision-analysis practices.",

    sources: [
      {
        organization:
          "NASA",

        title:
          "Systems Engineering Handbook",

        url:
          "https://www.nasa.gov/reference/systems-engineering-handbook/",

        purpose:
          "NASA systems-engineering framework",
      },

      {
        organization:
          "NASA",

        title:
          "6.8 Decision Analysis",

        url:
          "https://www.nasa.gov/reference/6-8-decision-analysis/",

        purpose:
          "Decision criteria, alternatives, uncertainty, trade studies, and documented rationale",
      },
    ],
  },


  /* =======================================================
     EXPANSION 01 — AERODYNAMICS
     ======================================================= */

  aerodynamics: {
    wingId:
      "aerodynamics",

    release:
      "expansion",

    wingName:
      "Aerodynamics",

    buildTitle:
      "Design for the Atmosphere",

    mission:
      "Choose an aerodynamic configuration that balances lift, drag, stability, and mission goals.",

    beginnerQuestion:
      "How do you get enough lift without creating too much drag?",

    concepts: [
      "lift",
      "drag",
      "dynamic pressure",
      "lift coefficient",
      "drag coefficient",
      "lift-to-drag ratio",
    ],

    actions: [
      "Change wing area",
      "Change aerodynamic coefficients",
      "Change flight speed",
      "Observe lift and drag",
      "Compare lift-to-drag ratio",
      "Defend the final configuration",
    ],

    proofOfFlight: [
      "initial configuration",
      "lift result",
      "drag result",
      "design revision",
      "final configuration",
    ],

    modelDisclosure:
      "The aerodynamic model uses simplified coefficient-based equations for learning.",

    sources: [
      {
        organization:
          "NASA Glenn Research Center",

        title:
          "Guide to Aerodynamics",

        url:
          "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/learn-about-aerodynamics/",

        purpose:
          "Fundamental aerodynamic concepts",
      },

      {
        organization:
          "NASA Glenn Research Center",

        title:
          "Lift to Drag Ratio",

        url:
          "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-to-drag-ratio/",

        purpose:
          "Aerodynamic efficiency and lift/drag tradeoffs",
      },

      {
        organization:
          "NASA Glenn Research Center",

        title:
          "Drag Equation",

        url:
          "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",

        purpose:
          "Coefficient-based drag relationship",
      },
    ],
  },


  /* =======================================================
     EXPANSION 02 — ORBITAL MECHANICS
     ======================================================= */

  "orbital-mechanics": {
    wingId:
      "orbital-mechanics",

    release:
      "expansion",

    wingName:
      "Orbital Mechanics",

    buildTitle:
      "Reach Mars",

    mission:
      "Choose an interplanetary trajectory that balances travel time and propellant.",

    beginnerQuestion:
      "Would you take the fuel-efficient route or spend more energy to arrive sooner?",

    concepts: [
      "orbit",
      "periapsis",
      "apoapsis",
      "transfer orbit",
      "Hohmann transfer",
      "trajectory",
      "delta-v",
    ],

    actions: [
      "Choose a transfer strategy",
      "Compare travel time",
      "Compare maneuver cost",
      "Change departure conditions",
      "Observe the trajectory",
      "Defend the final route",
    ],

    proofOfFlight: [
      "initial trajectory",
      "travel-time result",
      "maneuver requirement",
      "trajectory revision",
      "final reasoning",
    ],

    modelDisclosure:
      "The trajectory model is a simplified educational representation of orbital transfer concepts.",

    sources: [
      {
        organization:
          "NASA Science",

        title:
          "Basics of Space Flight — Chapter 4: Trajectories",

        url:
          "https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/",

        purpose:
          "Interplanetary trajectories and Hohmann-transfer concepts",
      },

      {
        organization:
          "NASA Science",

        title:
          "Basics of Space Flight — Chapter 5: Planetary Orbits",

        url:
          "https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/",

        purpose:
          "Orbital parameters and planetary-orbit concepts",
      },
    ],
  },


  /* =======================================================
     EXPANSION 03 — ROBOTICS / AUTONOMY
     ======================================================= */

  "robotics-autonomy": {
    wingId:
      "robotics-autonomy",

    release:
      "expansion",

    wingName:
      "Robotics & Autonomy",

    buildTitle:
      "Rover Without Earth",

    mission:
      "Give a planetary rover enough autonomy to reach a target when Earth cannot control every move.",

    beginnerQuestion:
      "What should a rover decide for itself when communication is delayed?",

    concepts: [
      "autonomy",
      "perception",
      "planning",
      "obstacle avoidance",
      "decision making",
      "robot safety",
    ],

    actions: [
      "Inspect rover sensor data",
      "Choose autonomy rules",
      "Plan a route",
      "Respond to unexpected obstacles",
      "Compare safety and efficiency",
      "Revise the autonomous behavior",
    ],

    proofOfFlight: [
      "initial autonomy strategy",
      "route plan",
      "obstacle decisions",
      "mission result",
      "final autonomy rules",
    ],

    modelDisclosure:
      "The autonomy environment is fictional and simplified. NASA sources provide the robotics and autonomous-systems foundation.",

    sources: [
      {
        organization:
          "NASA Ames Research Center",

        title:
          "Autonomous Systems & Robotics",

        url:
          "https://www.nasa.gov/intelligent-systems-division/autonomous-systems-and-robotics/",

        purpose:
          "NASA autonomy, planning, robotics, decision support, and intelligent systems",
      },

      {
        organization:
          "NASA",

        title:
          "Robotics",

        url:
          "https://www.nasa.gov/robotics/",

        purpose:
          "NASA planetary robotics and autonomous exploration",
      },
    ],
  },
};


export const CORE_WINGS =
  Object.values(
    WING_BUILD_CATALOG,
  ).filter(
    build =>
      build.release ===
      "core",
  );


export const EXPANSION_WINGS =
  Object.values(
    WING_BUILD_CATALOG,
  ).filter(
    build =>
      build.release ===
      "expansion",
  );


export function getWingBuild(
  wingId: WingId,
) {
  return WING_BUILD_CATALOG[
    wingId
  ];
}
