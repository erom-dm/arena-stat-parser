import { classCompressionMapLC } from "../utils/constants";

export type ChartNamesAndRoutes = string[];

export enum CharClasses {
  Druid = "DRUID",
  Rogue = "ROGUE",
  Hunter = "HUNTER",
  Mage = "MAGE",
  Paladin = "PALADIN",
  Priest = "PRIEST",
  Shaman = "SHAMAN",
  Warlock = "WARLOCK",
  Warrior = "WARRIOR",
}
// disconnected = "!disconnected",

export type classCompressionMapType = {
  [Key in keyof typeof CharClasses]: string;
};

export type raceCompressionMapType = {
  [key in racesStringLiterals]: string;
};

export type keyOfCharClasses = keyof typeof CharClasses;

export type racesStringLiterals =
  | "Bloodelf"
  | "Draenei"
  | "Dwarf"
  | "Gnome"
  | "Human"
  | "Nightelf"
  | "Orc"
  | "Tauren"
  | "Troll"
  | "Undead";

// Arena match object from logs
export interface ArenaMatchRaw {
  class: string;
  classEnglish: string;
  enteredTime: number;
  faction: number;
  goldTeam: RawTeam;
  group: any;
  instanceID: number;
  instanceName: string;
  isPvp: boolean;
  leftMoney: number;
  leftTime: number;
  mobCount: number;
  mobCountFromKill: number;
  playerName: string;
  purpleTeam: RawTeam;
  rep: any;
  type: string;
  winningFaction: number;
}

export interface RawTeam {
  [key: string]: RawPlayer;
}

export interface RawPlayer {
  kb: number;
  class: string;
  race?: racesStringLiterals;
  teamMMR: number;
  teamName: string;
  faction: number;
  newTeamRating: number;
  healing: number;
  teamRating: number;
  damage: number;
}

// ArenaMatch for local storage
export interface ArenaMatchCompact {
  i: number; // matchID
  t: number; // enteredTime
  n: number; // instanceID
  w: boolean; // win
  m: TeamCompact; // myTeam
  e: TeamCompact; // enemyTeam
}

export type TeamCompact = {
  n: string; // name
  r: number; // teamRating
  e: number; // newTeamRating
  m: number; // teamMMR
  p: (PlayerCompact | null)[]; // players
};

export interface PlayerCompact {
  n: string; // name
  c: typeof classCompressionMapLC[keyof typeof classCompressionMapLC]; // class
  r: string | undefined; // race
  d: number; // damage
  h: number; // healing
}

// ArenaMatch for React state
export interface ArenaMatch {
  matchID: number;
  enteredTime: number;
  instanceID: number;
  win: boolean;
  myTeam: Team;
  enemyTeam: Team;
}

export interface Team {
  teamName: string;
  teamRating: number;
  newTeamRating: number;
  teamMMR: number;
  players: (Player | null)[];
  bracket: number;
  teamCompArray: teamCompArrayType;
  teamCompString: string;
  playerNamesArr: string[];
}

export interface Player {
  name: string;
  class: keyOfCharClasses;
  race: racesStringLiterals | undefined;
  damage: number;
  healing: number;
}
//

export type teamCompArrayType = (keyOfCharClasses | "disconnected")[];

export interface TeamCompDataset {
  [Key: string]: TeamcompDatasetObj;
}

export type ClassDistributionDataset = {
  [Key in keyOfCharClasses | "disconnected"]: {
    total: number;
    inMatches: number;
    raceDistribution: RaceDistributionObject;
  };
};

export type RaceDistributionObject = {
  [Key in racesStringLiterals]: number;
};

export interface MathupDataset {
  teamCompsDataset: TeamCompDataset;
  classDistributionDataset: ClassDistributionDataset;
}

export interface ClassDistributionChartInputData {
  labels: (string | string[])[];
  totalData: number[];
  inMatchesData: number[];
  raceDistributionData: RaceDistributionObject[];
  colorArray: string[];
}

export interface TeamCompsChartInputData {
  totalMatchNumber: number;
  totalWins: number;
  totalLosses?: number;
  totalWinrate?: string;
  labelArr: (string | string[])[];
  dataArr: number[];
  winsArr: number[];
  zoneStatsArr: ZoneStats[];
  performanceStatsArr: TeamPerformanceStats[];
  colorArray: string[];
}

export type RatingChangeDataset = RatingChangeObj[];

export type RatingChangeObj = {
  timestamp: number;
  newTeamRating: number;
  teamMMR: number;
  enemyTeamComp: string;
  win: boolean;
};

export type LineChartInputData = {
  teamRatingArr: number[];
  teamMMRArr: number[];
  enemyTeamCompArr: string[];
  labelArr: string[];
  winArray: boolean[];
};

export type TeamsDataset = { [Key: string]: TeamStatsObj };

export type TeamStatsObj = {
  teamName: string;
  enemyTeamComp: string;
  enemyPlayerNames: string[];
  teamMMR: DetailedTeamRatingObject;
  teamRating: DetailedTeamRatingObject;
  matchesPlayed: number;
  wins: number;
};

export type EnemyTeamData = {
  teamName: string;
  enemyTeamComp: string;
  enemyPlayerNames: string[];
  enemyTeamMMR: number;
  enemyTeamRating: number;
};

export type DetailedTeamRatingObject = {
  min: number;
  max: number;
  average: number;
  total: number;
  matchCount: number;
};

export interface TeamcompDatasetObj {
  matchCount: number;
  wins: number;
  zoneStats: ZoneStats;
  performanceStats: TeamPerformanceStats;
}

export interface SortableTeamCompObj extends TeamcompDatasetObj {
  teamComp: string;
}

export type ZoneStats = {
  [Key: number]: SingleZoneStats;
};

export type SingleZoneStats = {
  matches: number;
  wins: number;
};

export type TeamPerformanceStats = {
  [Key: string]: PlayerPerformanceStats;
};

export type PlayerPerformanceStats = {
  damage: number;
  healing: number;
};

export interface TeamCompData {
  labels: (string | string[])[];
  datasets: {
    label: string;
    data: number[];
    wins?: number[];
    zoneStats?: ZoneStats[];
    performanceStats?: TeamPerformanceStats[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    hoverOffset: number;
  }[];
}

export interface ClassDistributionData {
  labels: (string | string[])[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    hoverOffset: number;
  }[];
}

export interface MatchupData {
  labels: (string | string[])[];
  datasets: {
    label: string;
    data: number[];
    wins: number[];
    winrates: string[];
    losses: number[];
    allMatchupMatches: ArenaMatch[];
    backgroundColor: string[];
    borderColor: [];
    borderWidth: 1;
    hoverOffset: 6;
  }[];
}

export interface MatchupInputData {
  matchupLabels: string[];
  matchupTotalGames: number[];
  matchupWins: number[];
  matchupWinrate: string[];
  matchupLosses: number[];
  matchupColorArray: string[];
}

export interface RaceMatchupObject {
  [key: string]: {
    totalMatches: number;
    wins: number;
    losses: number;
    winrate: string;
  };
}

export type ColorRangeInfo = {
  colorStart: number;
  colorEnd: number;
  useEndAsStart?: boolean;
};

export type MatchSessions = Map<number, ArenaMatch[]>;

export type SessionSelectOption = {
  value: number;
  label: string;
};

export type TeamSelectOption = {
  value: string;
  label: string;
};

export type SplitNames = {
  names: string[];
  realm: string;
};

export type TeamRatingObject = {
  MMR: number;
  rating: number;
  newRating: number;
  ratingChange: number;
};

export enum MatchupChartTypes {
  teamComps = "Teams",
  classes = "Classes",
  matchup = "Matchup",
}

export enum LineChartTypes {
  perMatch = "Match view",
  perSession = "Session view",
}
