import type { MissionScene } from "./types";

export const finalMission: MissionScene = {
  id: "mission-command",

  missionNumber: 8,
  totalMissions: 8,

  phase: "MISSION COMMAND",

  timeRemaining: "T+01:12",

  altitude: "0 m",

  situation:
    "The vehicle is safely on the surface, but the mission is not finished. Communications remain degraded, system margins are limited, the science window is closing, and several measurements still need verification. You control the final 100 mission points.",

  question:
    "How will you allocate the remaining mission resources?",

  telemetry: [
    {
      label: "COMM LINK",
      value: "DEGRADED",
      status: "warning",
    },

    {
      label: "VEHICLE",
      value: "STABLE",
      status: "nominal",
    },

    {
      label: "SCIENCE WINDOW",
      value: "LIMITED",
      status: "warning",
    },

    {
      label: "MISSION POINTS",
      value: "100",
      status: "nominal",
    },
  ],

  /*
    Mission 08 uses FinalMissionPanel.
    It is the final systems-level prioritization task.
  */
  options: [],
};