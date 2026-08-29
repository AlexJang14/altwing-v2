export type CollegeRegion =
  | "NORTHEAST"
  | "MIDWEST"
  | "SOUTH"
  | "WEST";

export interface CollegeExplorerMeta {
  region: CollegeRegion;
  specialContext?: string;
  dataCaution?: string;
}

export const collegeExplorerMeta:
  Record<string, CollegeExplorerMeta> = {
  gatech: {
    region: "SOUTH",
  },

  michigan: {
    region: "MIDWEST",
  },

  mit: {
    region: "NORTHEAST",
  },

  stanford: {
    region: "WEST",
  },

  purdue: {
    region: "MIDWEST",
  },

  uiuc: {
    region: "MIDWEST",
  },

  tamu: {
    region: "SOUTH",
  },

  erau: {
    region: "SOUTH",

    dataCaution:
      "Embry-Riddle Daytona Beach's latest Common Data Set currently published on its official institutional-research page is 2023–24. Treat these admissions numbers as older context rather than current-year data.",
  },
};
