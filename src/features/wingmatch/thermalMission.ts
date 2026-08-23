import type { MissionScene } from "./types";

export const thermalManagementMission: MissionScene = {
  id: "thermal-management",
  missionNumber: 4,
  totalMissions: 8,

  phase: "THERMAL MANAGEMENT",
  timeRemaining: "T−05:42",
  altitude: "4.1 km",

  situation:
    "The landing burn is stable, but heat is building inside the vehicle. Cooling power is limited, and protecting one subsystem leaves less margin for the others.",

  question:
    "Distribute the vehicle's cooling power while preserving enough reserve for the rest of the descent.",

  telemetry: [
    {
      label: "ENGINE TEMP",
      value: "112%",
      status: "warning",
    },
    {
      label: "BATTERY",
      value: "RISING",
      status: "warning",
    },
    {
      label: "AVIONICS",
      value: "LOW MARGIN",
      status: "warning",
    },
    {
      label: "COOLING POWER",
      value: "100",
      status: "nominal",
    },
  ],

  /*
    Mission 04 does not use normal choice cards.

    ThermalAllocationPanel will replace the options
    when we connect this scene to the mission engine.
  */
  options: [],
};