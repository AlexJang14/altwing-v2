import type { MissionScene } from "../engine/types";

export const landingSiteMission: MissionScene = {
  id: "landing-site-selection",

  missionNumber: 5,
  totalMissions: 8,

  phase: "LANDING SITE SELECTION",

  timeRemaining: "T−03:16",

  altitude: "2.3 km",

  situation:
    "The lander is approaching the final descent corridor. Three reachable sites remain, but none is best on every measure. Terrain safety, science value, and fuel reserve now compete directly.",

  question:
    "Where would you commit the landing?",

  telemetry: [
    {
      label: "ALTITUDE",
      value: "2.3 km",
      status: "nominal",
    },

    {
      label: "FUEL",
      value: "24%",
      status: "warning",
    },

    {
      label: "SITES",
      value: "3",
      status: "nominal",
    },

    {
      label: "DIVERT WINDOW",
      value: "38 sec",
      status: "warning",
    },
  ],

  /*
    Mission 05 uses LandingSitePanel,
    not normal answer cards.
  */
  options: [],
};