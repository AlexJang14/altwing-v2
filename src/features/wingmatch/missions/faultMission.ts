import type { MissionScene } from "../engine/types";

export const faultIsolationMission: MissionScene = {
  id: "avionics-fault-isolation",

  missionNumber: 7,
  totalMissions: 8,

  phase: "AVIONICS FAULT ISOLATION",

  timeRemaining: "T+00:31",

  altitude: "0 m",

  situation:
    "Touchdown is complete, but the communication link has become intermittent. The flight computer remains online and vehicle power appears stable. You have time to run only three diagnostic tests before the next communication window.",

  question:
    "Which evidence will you collect, and where do you think the fault is?",

  telemetry: [
    {
      label: "POWER BUS",
      value: "NOMINAL",
      status: "nominal",
    },

    {
      label: "FLIGHT COMPUTER",
      value: "ONLINE",
      status: "nominal",
    },

    {
      label: "COMM LINK",
      value: "LOST",
      status: "warning",
    },

    {
      label: "NEXT WINDOW",
      value: "31 sec",
      status: "warning",
    },
  ],

  /*
    Mission 07 uses FaultIsolationPanel.
  */
  options: [],
};