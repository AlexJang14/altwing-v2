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
      "The latest official Daytona Beach Common Data Set currently used here is 2023–24. Treat its score data as older context rather than a current admissions target.",
  },

  caltech: {
    region: "WEST",

    specialContext:
      "Caltech does not offer a standalone undergraduate Aerospace Engineering BS. Students complete another undergraduate option and may add the Aerospace minor. Fall 2027 testing is evaluated by section-level score buckets.",
  },

  utaustin: {
    region: "SOUTH",

    specialContext:
      "For Summer/Fall 2027, eligible Texas applicants in the top 5% qualify for automatic admission to UT Austin. Admission to Cockrell Engineering and to Aerospace Engineering is still a separate competitive decision. Cockrell applicants must also demonstrate calculus readiness.",
  },

  ucf: {
    region: "SOUTH",
  },

  cuboulder: {
    region: "WEST",

    dataCaution:
      "The SAT/ACT range shown is an institution-level admitted-student profile for students who chose to have test scores considered. CU Boulder is test optional for 2027 applicants.",
  },

  calpoly: {
    region: "WEST",

    specialContext:
      "Cal Poly admits by intended major. SAT and ACT are not used in admission selection. Aerospace Engineering students choose an Aeronautics or Astronautics concentration.",
  },
};
