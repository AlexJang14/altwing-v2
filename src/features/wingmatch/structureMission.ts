import type { MissionScene } from "./types";

export const structureMission: MissionScene = {
  id: "structural-load-path",

  missionNumber: 6,
  totalMissions: 8,

  phase: "STRUCTURAL LOAD PATH",

  timeRemaining: "T−00:42",

  altitude: "68 m",

  situation:
    "Touchdown is approaching. One landing leg is carrying an asymmetric compression load, and the vehicle can add only a small amount of reinforcement mass before landing.",

  question:
    "Inspect the load path and decide where reinforcement matters most.",

  telemetry: [
    {
      label: "ALTITUDE",
      value: "68 m",
      status: "warning",
    },

    {
      label: "VERTICAL SPEED",
      value: "−3.8 m/s",
      status: "warning",
    },

    {
      label: "LEG LOAD",
      value: "+24%",
      status: "warning",
    },

    {
      label: "MASS MARGIN",
      value: "3.0 kg",
      status: "nominal",
    },
  ],

  /*
    Mission 06 uses StructureScanPanel.
  */
  options: [],
};