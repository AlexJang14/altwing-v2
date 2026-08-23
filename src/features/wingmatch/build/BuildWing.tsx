import { useState } from "react";
import "./build-wing.css";

interface BuildWingProps {
  wingId: string;
  wingName: string;
  onBack: () => void;
}

interface EvidenceField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
}

interface BuildStep {
  id: string;
  week: number;
  phase: "EXPLORE" | "BUILD" | "LAUNCH";
  title: string;
  description: string;
  output: string;
  why: string;
  evidenceFields: EvidenceField[];
}

interface BuildPlan {
  project: string;
  question: string;
  finalArtifact: string;
  steps: BuildStep[];
}

type EvidenceRecord = Record<string, string>;
type EvidenceStore = Record<string, EvidenceRecord>;

function field(
  key: string,
  label: string,
  placeholder: string,
  multiline = false,
): EvidenceField {
  return {
    key,
    label,
    placeholder,
    multiline,
    required: true,
  };
}

/* =========================================================
   01 — SYSTEMS ENGINEERING
   ========================================================= */

const systemsPlan: BuildPlan = {
  project: "Mission Tradeoff Simulator",

  question:
    "How should a spacecraft distribute limited mass, power, thermal margin, and mission resources when improving one system creates a cost somewhere else?",

  finalArtifact:
    "Interactive mission simulator + constraint map + scenario comparison + V1 → V2 evidence + technical brief",

  steps: [
    {
      id: "systems-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the mission constraints",
      description:
        "Turn a spacecraft mission into a system with measurable limits and competing priorities.",
      output: "Mission constraint map",
      why:
        "Systems engineers cannot maximize everything. Real missions are shaped by limits, priorities, and tradeoffs.",
      evidenceFields: [
        field(
          "objective",
          "MISSION OBJECTIVE",
          "Example: Deliver a science payload to the lunar surface and operate for 24 hours.",
          true,
        ),
        field(
          "mass",
          "MASS LIMIT",
          "Example: Total spacecraft mass ≤ 180 kg",
        ),
        field(
          "power",
          "POWER LIMIT",
          "Example: Average electrical power ≤ 450 W",
        ),
        field(
          "thermal",
          "THERMAL CONSTRAINT",
          "Example: Battery must remain between 0°C and 40°C",
        ),
        field(
          "priority",
          "MISSION PRIORITY",
          "Example: Protect landing reliability before maximizing science return",
          true,
        ),
        field(
          "tradeoff",
          "TRADEOFF QUESTION",
          "What must you sacrifice if you improve another part of the mission?",
          true,
        ),
      ],
    },

    {
      id: "systems-02",
      week: 1,
      phase: "EXPLORE",
      title: "Create the tradeoff rules",
      description:
        "Define how changing one subsystem affects another so a perfect solution is impossible.",
      output: "Tradeoff model",
      why:
        "A systems model becomes meaningful when decisions create consequences elsewhere in the mission.",
      evidenceFields: [
        field(
          "variable",
          "VARIABLE",
          "Example: Battery capacity",
        ),
        field(
          "benefit",
          "WHAT DOES IT IMPROVE?",
          "Example: Mission operating time",
        ),
        field(
          "cost",
          "WHAT DOES IT COST?",
          "Example: Mass and thermal demand",
        ),
        field(
          "rule",
          "TRADEOFF RULE",
          "Example: Every +10 Wh adds 0.6 kg and increases thermal demand.",
          true,
        ),
      ],
    },

    {
      id: "systems-03",
      week: 2,
      phase: "BUILD",
      title: "Build simulator V1",
      description:
        "Create a working model that lets a user change mission decisions and see their consequences.",
      output: "Working simulator",
      why:
        "A model becomes useful when another person can interact with it and observe the result.",
      evidenceFields: [
        field(
          "tool",
          "BUILD TOOL",
          "JavaScript, Python, Excel, Google Sheets...",
        ),
        field(
          "inputs",
          "SIMULATOR INPUTS",
          "What can the user change?",
          true,
        ),
        field(
          "outputs",
          "SIMULATOR OUTPUTS",
          "What does your model calculate?",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub URL, Replit URL, filename...",
        ),
      ],
    },

    {
      id: "systems-04",
      week: 2,
      phase: "BUILD",
      title: "Run three mission scenarios",
      description:
        "Change mission priorities and determine how the recommended design responds.",
      output: "Scenario comparison",
      why:
        "One successful run proves little. Engineering confidence comes from comparison.",
      evidenceFields: [
        field(
          "scenario1",
          "SCENARIO 01 — SAFETY FIRST",
          "Inputs and result",
          true,
        ),
        field(
          "scenario2",
          "SCENARIO 02 — PERFORMANCE FIRST",
          "Inputs and result",
          true,
        ),
        field(
          "scenario3",
          "SCENARIO 03 — BALANCED",
          "Inputs and result",
          true,
        ),
        field(
          "finding",
          "KEY FINDING",
          "What changed across the scenarios?",
          true,
        ),
      ],
    },

    {
      id: "systems-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve one weak assumption",
      description:
        "Find something unrealistic in V1 and use evidence to make V2 stronger.",
      output: "V1 → V2 evidence",
      why:
        "Iteration shows that evidence changed your engineering thinking.",
      evidenceFields: [
        field(
          "weakness",
          "V1 WEAKNESS",
          "What was unrealistic?",
          true,
        ),
        field(
          "evidence",
          "EVIDENCE THAT EXPOSED IT",
          "Which test or result revealed the weakness?",
          true,
        ),
        field(
          "revision",
          "V2 REVISION",
          "What did you change?",
          true,
        ),
        field(
          "impact",
          "RESULT AFTER REVISION",
          "What improved?",
          true,
        ),
      ],
    },

    {
      id: "systems-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the engineering story",
      description:
        "Turn the project into evidence another person can understand and evaluate.",
      output: "GitHub + technical brief",
      why:
        "Engineering work becomes portfolio evidence when another person can understand the problem, method, evidence, and result.",
      evidenceFields: [
        field(
          "problem",
          "THE PROBLEM",
          "What engineering problem did you investigate?",
          true,
        ),
        field(
          "method",
          "WHAT YOU BUILT",
          "Explain your model or simulator.",
          true,
        ),
        field(
          "result",
          "WHAT YOU DISCOVERED",
          "What is your strongest result?",
          true,
        ),
        field(
          "limitation",
          "LIMITATION + NEXT STEP",
          "What can this project not yet do?",
          true,
        ),
        field(
          "portfolio",
          "PUBLISHED PROJECT LINK",
          "GitHub, portfolio, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   02 — GUIDANCE, NAVIGATION & CONTROL
   ========================================================= */

const gncPlan: BuildPlan = {
  project: "Lander Control Simulator",

  question:
    "How can a spacecraft correct its motion quickly without creating dangerous overshoot or oscillation?",

  finalArtifact:
    "Interactive lander controller + response plots + tuning experiments + V1 → V2 comparison + technical brief",

  steps: [
    {
      id: "gnc-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the control problem",
      description:
        "Choose one spacecraft motion variable and define the target state.",
      output: "Control problem definition",
      why:
        "A controller needs a measurable state, a target, and a definition of acceptable behavior.",
      evidenceFields: [
        field(
          "vehicle",
          "VEHICLE",
          "Example: Lunar lander",
        ),
        field(
          "state",
          "CONTROLLED STATE",
          "Example: Pitch angle",
        ),
        field(
          "target",
          "TARGET VALUE",
          "Example: 0° pitch",
        ),
        field(
          "disturbance",
          "DISTURBANCE",
          "What pushes the vehicle away from the target?",
          true,
        ),
      ],
    },

    {
      id: "gnc-02",
      week: 1,
      phase: "EXPLORE",
      title: "Define performance metrics",
      description:
        "Decide what makes one controller response better than another.",
      output: "Control performance rubric",
      why:
        "Fast response alone is not enough. Overshoot, settling time, error, and control effort can conflict.",
      evidenceFields: [
        field(
          "overshoot",
          "MAXIMUM OVERSHOOT",
          "Example: < 10%",
        ),
        field(
          "settling",
          "SETTLING TIME TARGET",
          "Example: < 5 seconds",
        ),
        field(
          "error",
          "STEADY-STATE ERROR",
          "Example: < 1°",
        ),
        field(
          "tradeoff",
          "CONTROL TRADEOFF",
          "What might improve speed but hurt stability?",
          true,
        ),
      ],
    },

    {
      id: "gnc-03",
      week: 2,
      phase: "BUILD",
      title: "Build controller V1",
      description:
        "Create a simplified feedback controller and visualize the vehicle response.",
      output: "Working controller simulation",
      why:
        "Simulation lets you observe behavior before testing a controller on real hardware.",
      evidenceFields: [
        field(
          "tool",
          "SIMULATION TOOL",
          "Python, JavaScript, MATLAB-style model...",
        ),
        field(
          "controller",
          "CONTROLLER LOGIC",
          "How does your controller respond to error?",
          true,
        ),
        field(
          "visual",
          "RESPONSE VISUALIZATION",
          "What graph will show vehicle response?",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub, Replit, filename...",
        ),
      ],
    },

    {
      id: "gnc-04",
      week: 2,
      phase: "BUILD",
      title: "Tune three controller settings",
      description:
        "Compare slow, balanced, and aggressive responses using the same starting condition.",
      output: "Controller response comparison",
      why:
        "Controller tuning is a tradeoff between response speed, stability, and control effort.",
      evidenceFields: [
        field(
          "slow",
          "SLOW RESPONSE TEST",
          "Gain + overshoot + settling time",
          true,
        ),
        field(
          "balanced",
          "BALANCED RESPONSE TEST",
          "Gain + overshoot + settling time",
          true,
        ),
        field(
          "aggressive",
          "AGGRESSIVE RESPONSE TEST",
          "Gain + overshoot + settling time",
          true,
        ),
        field(
          "choice",
          "BEST SETTING + WHY",
          "Which would you fly and why?",
          true,
        ),
      ],
    },

    {
      id: "gnc-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve controller V2",
      description:
        "Use test evidence to improve stability, response time, or robustness.",
      output: "V1 → V2 control evidence",
      why:
        "A controller is not successful because it works once. It should improve through testing.",
      evidenceFields: [
        field(
          "problem",
          "V1 CONTROL PROBLEM",
          "What behavior needs improvement?",
          true,
        ),
        field(
          "evidence",
          "TEST EVIDENCE",
          "Which result exposed the problem?",
          true,
        ),
        field(
          "change",
          "V2 CONTROL CHANGE",
          "What did you revise?",
          true,
        ),
        field(
          "result",
          "V2 RESULT",
          "How did the response change?",
          true,
        ),
      ],
    },

    {
      id: "gnc-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the control experiment",
      description:
        "Package your controller, tests, graphs, limitations, and next experiment.",
      output: "GNC portfolio project",
      why:
        "A strong GNC project shows not only code but reasoning about dynamic behavior.",
      evidenceFields: [
        field(
          "summary",
          "CONTROL PROBLEM",
          "Summarize the challenge.",
          true,
        ),
        field(
          "method",
          "CONTROLLER DESIGN",
          "What did you build?",
          true,
        ),
        field(
          "result",
          "STRONGEST RESULT",
          "What did tuning reveal?",
          true,
        ),
        field(
          "next",
          "NEXT TEST",
          "What disturbance or complexity would you add next?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "GitHub, demo, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   03 — STRUCTURES
   ========================================================= */

const structuresPlan: BuildPlan = {
  project: "Lightweight Lunar Landing Structure",

  question:
    "How can a landing structure survive touchdown loads while using as little structural mass as possible?",

  finalArtifact:
    "CAD structure + load assumptions + structural comparison + mass trade study + V1 → V2 design evidence",

  steps: [
    {
      id: "structures-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the landing load case",
      description:
        "Create a simplified scenario describing what your structure must survive.",
      output: "Structural requirement sheet",
      why:
        "Structural design begins with loads and constraints, not with drawing a shape.",
      evidenceFields: [
        field(
          "vehicleMass",
          "LANDER MASS",
          "Example: 150 kg",
        ),
        field(
          "velocity",
          "TOUCHDOWN VELOCITY",
          "Example: 2.0 m/s",
        ),
        field(
          "load",
          "DESIGN LOAD",
          "What force or load factor will you design for?",
        ),
        field(
          "massGoal",
          "STRUCTURAL MASS GOAL",
          "Example: landing structure < 12 kg",
        ),
      ],
    },

    {
      id: "structures-02",
      week: 1,
      phase: "EXPLORE",
      title: "Compare candidate structures",
      description:
        "Compare at least three structural concepts before choosing one.",
      output: "Concept selection matrix",
      why:
        "Engineering design is stronger when a chosen geometry beats plausible alternatives.",
      evidenceFields: [
        field(
          "conceptA",
          "CONCEPT A",
          "Describe structure A.",
          true,
        ),
        field(
          "conceptB",
          "CONCEPT B",
          "Describe structure B.",
          true,
        ),
        field(
          "conceptC",
          "CONCEPT C",
          "Describe structure C.",
          true,
        ),
        field(
          "choice",
          "SELECTED CONCEPT + WHY",
          "Which concept best balances strength, mass, and simplicity?",
          true,
        ),
      ],
    },

    {
      id: "structures-03",
      week: 2,
      phase: "BUILD",
      title: "Create CAD version 1",
      description:
        "Build the primary load path of your landing structure.",
      output: "CAD model V1",
      why:
        "A useful structural model makes the load path visible from touchdown point to vehicle body.",
      evidenceFields: [
        field(
          "cad",
          "CAD TOOL",
          "Onshape, Fusion, SolidWorks...",
        ),
        field(
          "loadPath",
          "PRIMARY LOAD PATH",
          "Where does touchdown force travel through the structure?",
          true,
        ),
        field(
          "critical",
          "LIKELY CRITICAL REGION",
          "Which joint or member concerns you most?",
          true,
        ),
        field(
          "link",
          "CAD LINK / FILE",
          "Project URL or filename",
        ),
      ],
    },

    {
      id: "structures-04",
      week: 2,
      phase: "BUILD",
      title: "Compare strength and mass",
      description:
        "Test multiple structural configurations using calculations, simulation, or a simplified scoring model.",
      output: "Structural trade study",
      why:
        "The strongest structure is not automatically the best spacecraft structure if it is unnecessarily heavy.",
      evidenceFields: [
        field(
          "testA",
          "CONFIGURATION A",
          "Mass + estimated strength/margin",
          true,
        ),
        field(
          "testB",
          "CONFIGURATION B",
          "Mass + estimated strength/margin",
          true,
        ),
        field(
          "testC",
          "CONFIGURATION C",
          "Mass + estimated strength/margin",
          true,
        ),
        field(
          "decision",
          "SELECTED CONFIGURATION",
          "Which configuration would you fly and why?",
          true,
        ),
      ],
    },

    {
      id: "structures-05",
      week: 3,
      phase: "LAUNCH",
      title: "Reinforce the right place",
      description:
        "Use structural evidence to strengthen one weak region without adding unnecessary mass everywhere.",
      output: "V1 → V2 structural evidence",
      why:
        "Good structural engineering places material where the load path needs it most.",
      evidenceFields: [
        field(
          "weakRegion",
          "WEAK REGION",
          "What region needs reinforcement?",
        ),
        field(
          "evidence",
          "WHY?",
          "What calculation, simulation, or reasoning supports that?",
          true,
        ),
        field(
          "change",
          "V2 REINFORCEMENT",
          "What geometry or material change did you make?",
          true,
        ),
        field(
          "massPenalty",
          "MASS PENALTY",
          "How much mass did the improvement add?",
        ),
      ],
    },

    {
      id: "structures-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the structural case",
      description:
        "Show the load problem, CAD design, trade study, revision, and limitation.",
      output: "Structures portfolio project",
      why:
        "A strong structures project communicates why the geometry exists, not just what it looks like.",
      evidenceFields: [
        field(
          "problem",
          "STRUCTURAL PROBLEM",
          "What did the structure need to survive?",
          true,
        ),
        field(
          "design",
          "FINAL DESIGN",
          "Describe the final load path.",
          true,
        ),
        field(
          "evidence",
          "STRONGEST EVIDENCE",
          "What supports your final design?",
          true,
        ),
        field(
          "limitation",
          "LIMITATION + NEXT STEP",
          "What would require higher-fidelity analysis?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "CAD, GitHub, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   04 — AVIONICS
   ========================================================= */

const avionicsPlan: BuildPlan = {
  project: "Spacecraft Fault Detection System",

  question:
    "How can onboard software detect a spacecraft sensor or subsystem failure before it causes a mission-level problem?",

  finalArtifact:
    "Telemetry dataset + fault-detection logic + diagnostic tests + false-alarm analysis + V1 → V2 avionics evidence",

  steps: [
    {
      id: "avionics-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the telemetry system",
      description:
        "Choose spacecraft signals your onboard computer will monitor.",
      output: "Telemetry map",
      why:
        "Fault detection depends on knowing what healthy spacecraft behavior looks like.",
      evidenceFields: [
        field(
          "signal1",
          "TELEMETRY SIGNAL 01",
          "Example: Battery voltage",
        ),
        field(
          "signal2",
          "TELEMETRY SIGNAL 02",
          "Example: IMU angular rate",
        ),
        field(
          "signal3",
          "TELEMETRY SIGNAL 03",
          "Example: Communication packet loss",
        ),
        field(
          "failure",
          "TARGET FAILURE",
          "What failure should your system detect?",
          true,
        ),
      ],
    },

    {
      id: "avionics-02",
      week: 1,
      phase: "EXPLORE",
      title: "Define healthy and faulty behavior",
      description:
        "Create rules describing when telemetry should be considered normal, suspicious, or failed.",
      output: "Fault logic table",
      why:
        "A diagnostic system needs explicit evidence thresholds rather than intuition.",
      evidenceFields: [
        field(
          "normal",
          "NORMAL CONDITION",
          "What values count as healthy?",
          true,
        ),
        field(
          "warning",
          "WARNING CONDITION",
          "What values suggest a possible problem?",
          true,
        ),
        field(
          "fault",
          "FAULT CONDITION",
          "What evidence triggers a fault?",
          true,
        ),
        field(
          "ambiguity",
          "AMBIGUOUS CASE",
          "When could the same symptom have multiple causes?",
          true,
        ),
      ],
    },

    {
      id: "avionics-03",
      week: 2,
      phase: "BUILD",
      title: "Build the diagnostic engine",
      description:
        "Create code that receives telemetry and produces a fault hypothesis.",
      output: "Working diagnostic tool",
      why:
        "Avionics software turns raw sensor data into decisions the spacecraft can act on.",
      evidenceFields: [
        field(
          "tool",
          "BUILD TOOL",
          "Python, JavaScript...",
        ),
        field(
          "inputs",
          "INPUT TELEMETRY",
          "What data does your algorithm receive?",
          true,
        ),
        field(
          "logic",
          "DIAGNOSTIC LOGIC",
          "How does it distinguish possible failures?",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub, Replit, filename...",
        ),
      ],
    },

    {
      id: "avionics-04",
      week: 2,
      phase: "BUILD",
      title: "Test multiple fault cases",
      description:
        "Feed healthy and faulty telemetry into your diagnostic system.",
      output: "Diagnostic test matrix",
      why:
        "A detector is useful only if it catches real faults without constantly generating false alarms.",
      evidenceFields: [
        field(
          "healthy",
          "HEALTHY CASE",
          "Input + diagnosis",
          true,
        ),
        field(
          "fault1",
          "FAULT CASE 01",
          "Input + diagnosis",
          true,
        ),
        field(
          "fault2",
          "FAULT CASE 02",
          "Input + diagnosis",
          true,
        ),
        field(
          "falseAlarm",
          "FALSE-ALARM OBSERVATION",
          "Where did the system become confused?",
          true,
        ),
      ],
    },

    {
      id: "avionics-05",
      week: 3,
      phase: "LAUNCH",
      title: "Reduce false diagnoses",
      description:
        "Use your test results to improve diagnostic confidence.",
      output: "V1 → V2 diagnostic evidence",
      why:
        "A spacecraft should not trigger a major response because of one noisy measurement.",
      evidenceFields: [
        field(
          "problem",
          "V1 DIAGNOSTIC WEAKNESS",
          "What case produced a bad diagnosis?",
          true,
        ),
        field(
          "cause",
          "WHY DID IT HAPPEN?",
          "Noise, threshold, missing evidence...",
          true,
        ),
        field(
          "revision",
          "V2 CHANGE",
          "What new logic did you add?",
          true,
        ),
        field(
          "result",
          "V2 TEST RESULT",
          "Did accuracy or confidence improve?",
          true,
        ),
      ],
    },

    {
      id: "avionics-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the avionics investigation",
      description:
        "Document telemetry, fault logic, test cases, revision, and next step.",
      output: "Avionics portfolio project",
      why:
        "The strongest avionics projects connect software behavior to real spacecraft consequences.",
      evidenceFields: [
        field(
          "problem",
          "FAULT-DETECTION PROBLEM",
          "What failure were you trying to identify?",
          true,
        ),
        field(
          "system",
          "WHAT YOU BUILT",
          "Explain your diagnostic system.",
          true,
        ),
        field(
          "result",
          "STRONGEST RESULT",
          "What did testing reveal?",
          true,
        ),
        field(
          "next",
          "NEXT STEP",
          "What additional sensor or failure would you test?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "GitHub, demo, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   05 — THERMAL ENGINEERING
   ========================================================= */

const thermalPlan: BuildPlan = {
  project: "Spacecraft Thermal Survival Model",

  question:
    "How should limited thermal-control resources be used to keep critical spacecraft components inside safe temperature limits?",

  finalArtifact:
    "Thermal model + component limits + cooling allocation experiment + thermal response comparison + V1 → V2 evidence",

  steps: [
    {
      id: "thermal-01",
      week: 1,
      phase: "EXPLORE",
      title: "Map the thermal environment",
      description:
        "Define the external heating and cooling conditions your spacecraft experiences.",
      output: "Thermal environment map",
      why:
        "Spacecraft thermal design begins with energy entering and leaving the vehicle.",
      evidenceFields: [
        field(
          "hot",
          "HOT CASE",
          "Example: Direct solar exposure",
          true,
        ),
        field(
          "cold",
          "COLD CASE",
          "Example: Lunar night or eclipse",
          true,
        ),
        field(
          "duration",
          "EXPOSURE DURATION",
          "How long must the vehicle survive?",
        ),
        field(
          "risk",
          "PRIMARY THERMAL RISK",
          "Which component is most vulnerable?",
          true,
        ),
      ],
    },

    {
      id: "thermal-02",
      week: 1,
      phase: "EXPLORE",
      title: "Define component temperature limits",
      description:
        "Choose critical components and establish acceptable temperature ranges.",
      output: "Thermal requirements table",
      why:
        "Different spacecraft components tolerate very different thermal environments.",
      evidenceFields: [
        field(
          "battery",
          "BATTERY RANGE",
          "Example: 0°C to 40°C",
        ),
        field(
          "computer",
          "FLIGHT COMPUTER RANGE",
          "Example: -20°C to 60°C",
        ),
        field(
          "sensor",
          "SENSOR RANGE",
          "Example: -10°C to 50°C",
        ),
        field(
          "priority",
          "THERMAL PRIORITY",
          "Which component should receive protection first and why?",
          true,
        ),
      ],
    },

    {
      id: "thermal-03",
      week: 2,
      phase: "BUILD",
      title: "Build thermal model V1",
      description:
        "Create a simplified model showing component temperature over time.",
      output: "Working thermal model",
      why:
        "Even a simplified transient model can reveal whether thermal risk grows over time.",
      evidenceFields: [
        field(
          "tool",
          "MODEL TOOL",
          "Python, JavaScript, spreadsheet...",
        ),
        field(
          "inputs",
          "MODEL INPUTS",
          "Heat input, cooling, time step...",
          true,
        ),
        field(
          "outputs",
          "MODEL OUTPUTS",
          "What temperatures or margins are displayed?",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub, Replit, filename...",
        ),
      ],
    },

    {
      id: "thermal-04",
      week: 2,
      phase: "BUILD",
      title: "Allocate limited cooling power",
      description:
        "Distribute a fixed cooling budget among competing spacecraft components.",
      output: "Cooling allocation experiment",
      why:
        "Thermal management becomes a systems problem when protecting one component consumes resources needed elsewhere.",
      evidenceFields: [
        field(
          "budget",
          "TOTAL COOLING BUDGET",
          "Example: 100 units",
        ),
        field(
          "allocationA",
          "ENGINE / PROPULSION ALLOCATION",
          "Amount + resulting temperature",
          true,
        ),
        field(
          "allocationB",
          "BATTERY ALLOCATION",
          "Amount + resulting temperature",
          true,
        ),
        field(
          "allocationC",
          "AVIONICS ALLOCATION",
          "Amount + resulting temperature",
          true,
        ),
        field(
          "decision",
          "WHY THIS ALLOCATION?",
          "Explain the tradeoff.",
          true,
        ),
      ],
    },

    {
      id: "thermal-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve thermal margin",
      description:
        "Use model evidence to improve one thermal-control decision.",
      output: "V1 → V2 thermal evidence",
      why:
        "Good thermal design protects critical margins without wasting mass or power.",
      evidenceFields: [
        field(
          "weakness",
          "V1 THERMAL WEAKNESS",
          "Which component approached or exceeded its limit?",
          true,
        ),
        field(
          "evidence",
          "THERMAL EVIDENCE",
          "What result exposed the weakness?",
          true,
        ),
        field(
          "change",
          "V2 CHANGE",
          "Reallocation, insulation, radiator, heater...",
          true,
        ),
        field(
          "result",
          "NEW THERMAL MARGIN",
          "What improved?",
          true,
        ),
      ],
    },

    {
      id: "thermal-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the thermal case",
      description:
        "Show the thermal environment, model, allocation decision, revision, and limitation.",
      output: "Thermal portfolio project",
      why:
        "A thermal engineering story is strongest when temperature behavior is connected to mission decisions.",
      evidenceFields: [
        field(
          "problem",
          "THERMAL PROBLEM",
          "What needed protection?",
          true,
        ),
        field(
          "model",
          "WHAT YOU MODELED",
          "Explain your thermal model.",
          true,
        ),
        field(
          "result",
          "STRONGEST RESULT",
          "What did the model reveal?",
          true,
        ),
        field(
          "limitation",
          "LIMITATION + NEXT STEP",
          "What physics would you add next?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "GitHub, model, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   06 — PROPULSION
   ========================================================= */

const propulsionPlan: BuildPlan = {
  project: "Mission ΔV & Propulsion Trade Study",

  question:
    "Which propulsion approach best satisfies a spacecraft mission when ΔV, propellant mass, thrust, and mission time compete?",

  finalArtifact:
    "ΔV budget + propulsion comparison + propellant model + mission scenarios + V1 → V2 propulsion trade study",

  steps: [
    {
      id: "propulsion-01",
      week: 1,
      phase: "EXPLORE",
      title: "Create the mission ΔV budget",
      description:
        "Break a spacecraft mission into maneuvers requiring velocity change.",
      output: "Mission ΔV map",
      why:
        "Propulsion requirements come from the mission trajectory, not from choosing an engine first.",
      evidenceFields: [
        field(
          "mission",
          "MISSION",
          "Example: Low Earth orbit → lunar orbit",
        ),
        field(
          "burn1",
          "MANEUVER 01 ΔV",
          "Example: Transfer burn — 3.2 km/s",
        ),
        field(
          "burn2",
          "MANEUVER 02 ΔV",
          "Example: Capture burn — 0.9 km/s",
        ),
        field(
          "reserve",
          "MISSION RESERVE",
          "What ΔV margin will you preserve?",
        ),
      ],
    },

    {
      id: "propulsion-02",
      week: 1,
      phase: "EXPLORE",
      title: "Compare propulsion candidates",
      description:
        "Compare at least three propulsion concepts using mission-relevant criteria.",
      output: "Propulsion selection matrix",
      why:
        "High thrust, high efficiency, low complexity, and low mass rarely come together in one propulsion system.",
      evidenceFields: [
        field(
          "optionA",
          "PROPULSION OPTION A",
          "Type + key advantage",
          true,
        ),
        field(
          "optionB",
          "PROPULSION OPTION B",
          "Type + key advantage",
          true,
        ),
        field(
          "optionC",
          "PROPULSION OPTION C",
          "Type + key advantage",
          true,
        ),
        field(
          "decision",
          "SELECTED OPTION + WHY",
          "Which best fits your mission?",
          true,
        ),
      ],
    },

    {
      id: "propulsion-03",
      week: 2,
      phase: "BUILD",
      title: "Build the propellant model",
      description:
        "Create a simplified rocket-equation calculator connecting ΔV, specific impulse, and mass.",
      output: "Working propulsion calculator",
      why:
        "The rocket equation makes the cost of ΔV visible in spacecraft mass.",
      evidenceFields: [
        field(
          "tool",
          "BUILD TOOL",
          "Python, JavaScript, spreadsheet...",
        ),
        field(
          "inputs",
          "MODEL INPUTS",
          "ΔV, Isp, dry mass...",
          true,
        ),
        field(
          "outputs",
          "MODEL OUTPUTS",
          "Propellant mass, mass fraction...",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub, Replit, filename...",
        ),
      ],
    },

    {
      id: "propulsion-04",
      week: 2,
      phase: "BUILD",
      title: "Run three propulsion scenarios",
      description:
        "Compare how mission performance changes when propulsion assumptions change.",
      output: "Propulsion scenario comparison",
      why:
        "A propulsion choice can change spacecraft mass, maneuver time, and the rest of the mission architecture.",
      evidenceFields: [
        field(
          "scenario1",
          "SCENARIO 01 — HIGH THRUST",
          "Inputs + propellant result",
          true,
        ),
        field(
          "scenario2",
          "SCENARIO 02 — HIGH EFFICIENCY",
          "Inputs + propellant result",
          true,
        ),
        field(
          "scenario3",
          "SCENARIO 03 — BALANCED",
          "Inputs + propellant result",
          true,
        ),
        field(
          "finding",
          "KEY PROPULSION FINDING",
          "What changed most?",
          true,
        ),
      ],
    },

    {
      id: "propulsion-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve the mission model",
      description:
        "Identify one unrealistic propulsion assumption and improve it.",
      output: "V1 → V2 propulsion evidence",
      why:
        "A simple rocket-equation model is valuable when its limitations are recognized and improved.",
      evidenceFields: [
        field(
          "weakness",
          "V1 ASSUMPTION",
          "What was oversimplified?",
          true,
        ),
        field(
          "evidence",
          "WHY IT MATTERS",
          "How could the assumption distort your result?",
          true,
        ),
        field(
          "change",
          "V2 CHANGE",
          "What additional factor did you include?",
          true,
        ),
        field(
          "result",
          "NEW RESULT",
          "How did the mission conclusion change?",
          true,
        ),
      ],
    },

    {
      id: "propulsion-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the propulsion trade study",
      description:
        "Package your ΔV budget, propulsion model, comparisons, and design decision.",
      output: "Propulsion portfolio project",
      why:
        "Strong propulsion work connects equations to mission architecture rather than treating engine performance in isolation.",
      evidenceFields: [
        field(
          "mission",
          "MISSION PROBLEM",
          "What propulsion requirement were you solving?",
          true,
        ),
        field(
          "analysis",
          "WHAT YOU ANALYZED",
          "Explain your model.",
          true,
        ),
        field(
          "decision",
          "FINAL PROPULSION DECISION",
          "What would you choose and why?",
          true,
        ),
        field(
          "limitation",
          "LIMITATION + NEXT STEP",
          "What would require higher-fidelity analysis?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "GitHub, calculator, technical brief...",
        ),
      ],
    },
  ],
};

/* =========================================================
   07 — MISSION DESIGN
   ========================================================= */

const missionDesignPlan: BuildPlan = {
  project: "Lunar Mission Architecture",

  question:
    "How should a mission balance science return, safety, cost, vehicle capability, and operational complexity?",

  finalArtifact:
    "Mission architecture + requirement hierarchy + architecture comparison + mission timeline + V1 → V2 mission design",

  steps: [
    {
      id: "mission-design-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define mission success",
      description:
        "Turn a broad lunar mission idea into measurable objectives.",
      output: "Mission success criteria",
      why:
        "Mission design begins by defining what success means before selecting vehicles or trajectories.",
      evidenceFields: [
        field(
          "goal",
          "PRIMARY MISSION GOAL",
          "What must the mission accomplish?",
          true,
        ),
        field(
          "science",
          "SCIENCE OBJECTIVE",
          "What knowledge or measurement should the mission produce?",
          true,
        ),
        field(
          "duration",
          "MISSION DURATION",
          "How long should the mission operate?",
        ),
        field(
          "success",
          "SUCCESS CRITERIA",
          "What measurable outcome means the mission succeeded?",
          true,
        ),
      ],
    },

    {
      id: "mission-design-02",
      week: 1,
      phase: "EXPLORE",
      title: "Define mission constraints",
      description:
        "Identify the strongest limits shaping the architecture.",
      output: "Mission constraint hierarchy",
      why:
        "Architecture is the art of satisfying mission objectives inside real constraints.",
      evidenceFields: [
        field(
          "mass",
          "MASS CONSTRAINT",
          "Payload or launch mass limit",
        ),
        field(
          "power",
          "POWER CONSTRAINT",
          "Available spacecraft power",
        ),
        field(
          "time",
          "TIME CONSTRAINT",
          "Launch window, mission duration...",
        ),
        field(
          "risk",
          "RISK CONSTRAINT",
          "What failure must the architecture minimize?",
          true,
        ),
      ],
    },

    {
      id: "mission-design-03",
      week: 2,
      phase: "BUILD",
      title: "Create three mission architectures",
      description:
        "Design three substantially different ways to accomplish the same mission.",
      output: "Architecture alternatives",
      why:
        "Mission design is a decision process. One architecture alone provides no basis for comparison.",
      evidenceFields: [
        field(
          "architectureA",
          "ARCHITECTURE A",
          "Describe concept A.",
          true,
        ),
        field(
          "architectureB",
          "ARCHITECTURE B",
          "Describe concept B.",
          true,
        ),
        field(
          "architectureC",
          "ARCHITECTURE C",
          "Describe concept C.",
          true,
        ),
        field(
          "differences",
          "MAJOR DIFFERENCES",
          "What makes these architectures genuinely different?",
          true,
        ),
      ],
    },

    {
      id: "mission-design-04",
      week: 2,
      phase: "BUILD",
      title: "Compare the architectures",
      description:
        "Score the alternatives across mission value, safety, cost, complexity, and feasibility.",
      output: "Architecture decision matrix",
      why:
        "A mission architecture should be selected using explicit tradeoffs rather than preference.",
      evidenceFields: [
        field(
          "criteria",
          "DECISION CRITERIA",
          "List your scoring criteria and weights.",
          true,
        ),
        field(
          "scoreA",
          "ARCHITECTURE A SCORE",
          "Score + explanation",
          true,
        ),
        field(
          "scoreB",
          "ARCHITECTURE B SCORE",
          "Score + explanation",
          true,
        ),
        field(
          "scoreC",
          "ARCHITECTURE C SCORE",
          "Score + explanation",
          true,
        ),
        field(
          "selection",
          "SELECTED ARCHITECTURE",
          "Which wins and why?",
          true,
        ),
      ],
    },

    {
      id: "mission-design-05",
      week: 3,
      phase: "LAUNCH",
      title: "Stress-test the architecture",
      description:
        "Change one mission assumption and determine whether your architecture still wins.",
      output: "V1 → V2 mission evidence",
      why:
        "A strong mission architecture remains defensible when assumptions change—or clearly reveals when it should change.",
      evidenceFields: [
        field(
          "assumption",
          "CHANGED ASSUMPTION",
          "What mission assumption will you change?",
          true,
        ),
        field(
          "impact",
          "SYSTEM IMPACT",
          "What parts of the architecture are affected?",
          true,
        ),
        field(
          "decision",
          "DOES YOUR WINNER CHANGE?",
          "Explain why or why not.",
          true,
        ),
        field(
          "revision",
          "V2 ARCHITECTURE CHANGE",
          "What would you revise?",
          true,
        ),
      ],
    },

    {
      id: "mission-design-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the mission proposal",
      description:
        "Turn the architecture into a concise engineering mission proposal.",
      output: "Mission design portfolio project",
      why:
        "Mission design integrates technical decisions into one coherent story about why a mission should work.",
      evidenceFields: [
        field(
          "objective",
          "MISSION OBJECTIVE",
          "Summarize the mission.",
          true,
        ),
        field(
          "architecture",
          "SELECTED ARCHITECTURE",
          "Describe the final architecture.",
          true,
        ),
        field(
          "tradeoff",
          "KEY TRADEOFF",
          "What difficult decision shaped the mission?",
          true,
        ),
        field(
          "next",
          "NEXT ANALYSIS",
          "What needs to be modeled at higher fidelity?",
          true,
        ),
        field(
          "link",
          "PUBLISHED PROJECT LINK",
          "Portfolio, technical brief, GitHub...",
        ),
      ],
    },
  ],
};

/* =========================================================
   FALLBACK
   ========================================================= */

const genericPlan: BuildPlan = {
  project: "Aerospace Engineering Investigation",

  question:
    "Can you turn one aerospace question into something measurable, testable, and worth improving?",

  finalArtifact:
    "Working engineering artifact + test evidence + iteration + portfolio-ready technical story",

  steps: [
    {
      id: "generic-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the engineering problem",
      description:
        "Choose one focused aerospace problem.",
      output: "Engineering problem statement",
      why:
        "Strong engineering projects begin with a specific question.",
      evidenceFields: [
        field(
          "problem",
          "ENGINEERING QUESTION",
          "What exactly are you trying to determine?",
          true,
        ),
        field(
          "importance",
          "WHY IT MATTERS",
          "Why is this worth investigating?",
          true,
        ),
        field(
          "success",
          "SUCCESS CRITERIA",
          "How will you know whether it worked?",
          true,
        ),
      ],
    },

    {
      id: "generic-02",
      week: 1,
      phase: "EXPLORE",
      title: "Map variables and constraints",
      description:
        "Identify what can change, what you will measure, and what limits the system.",
      output: "Variable map",
      why:
        "Variables turn an idea into something testable.",
      evidenceFields: [
        field(
          "inputs",
          "INPUT VARIABLES",
          "What can you change?",
          true,
        ),
        field(
          "outputs",
          "OUTPUT METRICS",
          "What will you measure?",
          true,
        ),
        field(
          "constraints",
          "CONSTRAINTS",
          "What limits the design?",
          true,
        ),
      ],
    },

    {
      id: "generic-03",
      week: 2,
      phase: "BUILD",
      title: "Build version 1",
      description:
        "Create the smallest working model, simulation, CAD design, or analysis.",
      output: "Working V1",
      why:
        "A small working model produces more evidence than a large unfinished idea.",
      evidenceFields: [
        field(
          "tool",
          "BUILD TOOL",
          "Python, CAD, JavaScript...",
        ),
        field(
          "build",
          "WHAT WORKS IN V1?",
          "Describe your current version.",
          true,
        ),
        field(
          "link",
          "PROJECT LOCATION",
          "GitHub, filename, Drive...",
        ),
      ],
    },

    {
      id: "generic-04",
      week: 2,
      phase: "BUILD",
      title: "Test the design",
      description:
        "Run multiple conditions and record what happens.",
      output: "Test evidence",
      why:
        "Engineering claims need evidence.",
      evidenceFields: [
        field(
          "test1",
          "TEST 01",
          "Condition + result",
          true,
        ),
        field(
          "test2",
          "TEST 02",
          "Condition + result",
          true,
        ),
        field(
          "finding",
          "KEY FINDING",
          "What did the tests reveal?",
          true,
        ),
      ],
    },

    {
      id: "generic-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve version 2",
      description:
        "Use evidence to make one meaningful revision.",
      output: "V1 → V2 evidence",
      why:
        "Iteration demonstrates engineering judgment.",
      evidenceFields: [
        field(
          "weakness",
          "V1 WEAKNESS",
          "What needed improvement?",
          true,
        ),
        field(
          "change",
          "V2 CHANGE",
          "What did you change?",
          true,
        ),
        field(
          "result",
          "NEW RESULT",
          "What improved?",
          true,
        ),
      ],
    },

    {
      id: "generic-06",
      week: 3,
      phase: "LAUNCH",
      title: "Package the project",
      description:
        "Turn the project into something another person can evaluate.",
      output: "Portfolio-ready project",
      why:
        "Documentation turns private work into visible evidence.",
      evidenceFields: [
        field(
          "summary",
          "PROJECT SUMMARY",
          "Problem → method → result",
          true,
        ),
        field(
          "limitation",
          "LIMITATION",
          "What does your project not yet prove?",
          true,
        ),
        field(
          "next",
          "NEXT STEP",
          "What would you test next?",
          true,
        ),
        field(
          "link",
          "PUBLISHED LINK",
          "GitHub, portfolio, brief...",
        ),
      ],
    },
  ],
};

const plans: Record<string, BuildPlan> = {
  systems: systemsPlan,
  gnc: gncPlan,
  structures: structuresPlan,
  avionics: avionicsPlan,
  thermal: thermalPlan,
  propulsion: propulsionPlan,
  "mission-design": missionDesignPlan,
};

/* =========================================================
   COMPONENT
   ========================================================= */

function BuildWing({
  wingId,
  wingName,
  onBack,
}: BuildWingProps) {
  const plan =
    plans[wingId] ?? genericPlan;

  const storageKey =
    `altwing-evidence-v1-${wingId}`;

  const [evidence, setEvidence] =
    useState<EvidenceStore>(() => {
      try {
        const saved =
          localStorage.getItem(storageKey);

        if (!saved) {
          return {};
        }

        const parsed = JSON.parse(saved);

        return parsed &&
          typeof parsed === "object"
          ? parsed
          : {};
      } catch {
        return {};
      }
    });

  const [activeStepId, setActiveStepId] =
    useState(plan.steps[0].id);

  const [draft, setDraft] =
    useState<EvidenceRecord>(() => {
      return (
        evidence[plan.steps[0].id] ??
        {}
      );
    });

  const activeStep =
    plan.steps.find(
      (step) =>
        step.id === activeStepId,
    ) ?? plan.steps[0];

  const completedCount =
    plan.steps.filter(
      (step) =>
        evidence[step.id] &&
        Object.keys(
          evidence[step.id],
        ).length > 0,
    ).length;

  const progress = Math.round(
    (completedCount /
      plan.steps.length) *
      100,
  );

  const requiredFields =
    activeStep.evidenceFields.filter(
      (evidenceField) =>
        evidenceField.required !== false,
    );

  const canSave =
    requiredFields.every(
      (evidenceField) =>
        Boolean(
          draft[
            evidenceField.key
          ]?.trim(),
        ),
    );

  const isSaved =
    Boolean(
      evidence[activeStep.id],
    );

  function openStep(
    step: BuildStep,
  ) {
    setActiveStepId(step.id);

    setDraft(
      evidence[step.id] ?? {},
    );

    window.setTimeout(() => {
      document
        .getElementById(
          "evidence-workspace",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  function updateField(
    key: string,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveEvidence() {
    if (!canSave) {
      return;
    }

    const next: EvidenceStore = {
      ...evidence,
      [activeStep.id]: draft,
    };

    setEvidence(next);

    localStorage.setItem(
      storageKey,
      JSON.stringify(next),
    );
  }

  function resetEvidence() {
    const confirmed =
      window.confirm(
        "Reset all saved Build My Wing evidence for this Wing?",
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      storageKey,
    );

    setEvidence({});

    setActiveStepId(
      plan.steps[0].id,
    );

    setDraft({});
  }

  return (
    <main className="build-wing">
      <header className="build-wing-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back to WingMatch
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="build-wing-hero">
        <span className="build-kicker">
          PUT ON YOUR WING
        </span>

        <h1>{wingName}</h1>

        <p>
          You discovered how you
          engineer. Now turn that
          signal into evidence.
        </p>

        <div className="build-project-card">
          <div>
            <span>
              YOUR 3-WEEK BUILD
            </span>

            <h2>
              {plan.project}
            </h2>

            <p>
              {plan.question}
            </p>
          </div>

          <div className="build-progress">
            <strong>
              {progress}%
            </strong>

            <span>
              {completedCount} /{" "}
              {plan.steps.length}{" "}
              evidence checkpoints
            </span>

            <div>
              <i
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="build-workbench">
        <aside className="build-checkpoints">
          <div className="build-section-heading">
            <span>
              01 / BUILD PATH
            </span>

            <h2>
              Your three-week flight
              plan
            </h2>

            <p>
              A checkpoint only counts
              after evidence is saved.
            </p>
          </div>

          <div className="build-step-list">
            {plan.steps.map(
              (step, index) => {
                const done =
                  Boolean(
                    evidence[
                      step.id
                    ],
                  );

                const active =
                  step.id ===
                  activeStep.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={[
                      "build-step",
                      done
                        ? "build-step--done"
                        : "",
                      active
                        ? "build-step--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      openStep(step)
                    }
                  >
                    <div className="build-step-number">
                      {done
                        ? "✓"
                        : String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                    </div>

                    <div className="build-step-main">
                      <span>
                        WEEK{" "}
                        {String(
                          step.week,
                        ).padStart(
                          2,
                          "0",
                        )}{" "}
                        / {step.phase}
                      </span>

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                      <strong>
                        OUTPUT →{" "}
                        {step.output}
                      </strong>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </aside>

        <section
          className="evidence-workspace"
          id="evidence-workspace"
        >
          <div className="evidence-topline">
            <div>
              <span>
                CHECKPOINT{" "}
                {String(
                  plan.steps.findIndex(
                    (step) =>
                      step.id ===
                      activeStep.id,
                  ) + 1,
                ).padStart(
                  2,
                  "0",
                )}
              </span>

              <strong>
                {isSaved
                  ? "EVIDENCE SAVED"
                  : "IN PROGRESS"}
              </strong>
            </div>
          </div>

          <div className="evidence-heading">
            <span>
              {activeStep.phase} /
              ENGINEERING EVIDENCE
            </span>

            <h2>
              {activeStep.title}
            </h2>

            <p>
              {activeStep.description}
            </p>
          </div>

          <div className="evidence-why">
            <span>
              WHY THIS MATTERS
            </span>

            <p>
              {activeStep.why}
            </p>
          </div>

          <div className="evidence-form">
            {activeStep.evidenceFields.map(
              (evidenceField) => (
                <label
                  key={
                    evidenceField.key
                  }
                  className="evidence-field"
                >
                  <span>
                    {
                      evidenceField.label
                    }

                    {evidenceField.required !==
                      false && (
                      <b>*</b>
                    )}
                  </span>

                  {evidenceField.multiline ? (
                    <textarea
                      value={
                        draft[
                          evidenceField
                            .key
                        ] ?? ""
                      }
                      placeholder={
                        evidenceField
                          .placeholder
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          evidenceField.key,
                          event.target
                            .value,
                        )
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        draft[
                          evidenceField
                            .key
                        ] ?? ""
                      }
                      placeholder={
                        evidenceField
                          .placeholder
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          evidenceField.key,
                          event.target
                            .value,
                        )
                      }
                    />
                  )}
                </label>
              ),
            )}
          </div>

          <div className="evidence-save-area">
            <div>
              <span>
                REQUIRED EVIDENCE
              </span>

              <p>
                Complete every
                required field before
                this checkpoint can
                count.
              </p>
            </div>

            <button
              type="button"
              disabled={!canSave}
              onClick={saveEvidence}
            >
              {isSaved
                ? "Update evidence"
                : "Save evidence"}
            </button>
          </div>

          {isSaved && (
            <div className="evidence-saved">
              <span>✓</span>

              <div>
                <strong>
                  Checkpoint evidence
                  saved
                </strong>

                <p>
                  This work now counts
                  toward your Build My
                  Wing progress.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      <section className="build-finish">
        <span>
          WHAT YOU LEAVE WITH
        </span>

        <h2>
          Don't finish with a badge.
          Finish with evidence.
        </h2>

        <div className="build-evidence-grid">
          <article>
            <span>01</span>

            <strong>
              Working artifact
            </strong>

            <p>
              A simulation, model,
              CAD design, prototype,
              or analysis you can
              demonstrate.
            </p>
          </article>

          <article>
            <span>02</span>

            <strong>
              Test evidence
            </strong>

            <p>
              Data, graphs,
              screenshots, and
              comparisons showing
              what you investigated.
            </p>
          </article>

          <article>
            <span>03</span>

            <strong>
              Engineering iteration
            </strong>

            <p>
              Proof that testing
              changed the design from
              V1 to V2.
            </p>
          </article>

          <article>
            <span>04</span>

            <strong>
              Extracurricular
              evidence
            </strong>

            <p>
              Work that can grow into
              a portfolio, TSA,
              competition, research,
              or independent project.
            </p>
          </article>
        </div>

        <div className="build-final-artifact">
          <span>
            FINAL ARTIFACT
          </span>

          <strong>
            {plan.finalArtifact}
          </strong>
        </div>

        <div className="build-flow">
          BUILD
          <b>→</b>
          TEST
          <b>→</b>
          ITERATE
          <b>→</b>
          DOCUMENT
          <b>→</b>
          SHARE
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            className="build-reset"
            onClick={resetEvidence}
          >
            Reset project evidence
          </button>
        )}
      </section>
    </main>
  );
}

export default BuildWing;