export type ChartNamesAndRoutes = string[];

export enum CharClasses {
  druid = "DRUID",
  rogue = "ROGUE",
  hunter = "HUNTER",
  mage = "MAGE",
  paladin = "PALADIN",
  priest = "PRIEST",
  shaman = "SHAMAN",
  warlock = "WARLOCK",
  warrior = "WARRIOR",
  disconnected = "!disconnected",
}

export interface ArenaMatch {
  class: string;
  classEnglish: string;
  enteredTime: number;
  faction: number;
  goldTeam: ArenaTeam;
  group: any;
  instanceID: number;
  instanceName: string;
  isPvp: boolean;
  leftMoney: number;
  leftTime: number;
  mobCount: number;
  mobCountFromKill: number;
  playerName: string;
  purpleTeam: ArenaTeam;
  rep: any;
  type: string;
  winningFaction: number;
}

export interface ModdedArenaMatch {
  matchID: number;
  enteredTime: number;
  instanceID: number;
  instanceName: string;
  playerName: string;
  bracket: number;
  myTeam: ModdedArenaTeam;
  myTeamComp: string[];
  myTeamName: string;
  enemyTeam: ModdedArenaTeam;
  enemyTeamComp: CharClasses[];
  enemyTeamName: string;
  enemyPlayerNames: string[];
  enemyTeamMMR: number;
  enemyTeamRating: number;
  win: boolean;
}

export interface ArenaTeam {
  [key: string]: ArenaPlayer;
}

export type arenaPlayerKeys =
  | "player1"
  | "player2"
  | "player3"
  | "player4"
  | "player5";

export type ModdedArenaTeam = {
  [Key in arenaPlayerKeys]?: ModdedArenaPlayer | null;
};

export interface ArenaPlayer {
  kb: number;
  class: string;
  teamMMR: number;
  teamName: string;
  faction: number;
  newTeamRating: number;
  healing: number;
  teamRating: number;
  damage: number;
}

export interface ModdedArenaPlayer extends ArenaPlayer {
  name: string;
}

export interface TeamCompDataset {
  [Key: string]: TeamcompDatasetObj;
}

export type ClassDistributionDataset = {
  [Key in CharClasses]: { total: number; inMatches: number };
};

export interface MathupDataset {
  teamCompsDataset: TeamCompDataset;
  classDistributionDataset: ClassDistributionDataset;
}

export interface ClassDistributionChartInputData {
  labels: (string | string[])[];
  totalData: number[];
  inMatchesData: number[];
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

export type ColorRangeInfo = {
  colorStart: number;
  colorEnd: number;
  useEndAsStart?: boolean;
};

export type MatchSessions = Map<number, ModdedArenaMatch[]>;

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
  teamComps = "Team comps",
  classes = "Classes",
}
