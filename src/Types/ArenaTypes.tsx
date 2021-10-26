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
  enteredTime: number;
  instanceID: number;
  instanceName: string;
  playerName: string;
  bracket: number;
  myTeam: ModdedArenaTeam;
  myTeamComp: string[];
  enemyTeam: ModdedArenaTeam;
  enemyTeamComp: string[];
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
  [Key: string]: TeamCompObj;
}

export interface TeamCompObj {
  matchCount: number;
  wins: number;
}

export interface SortableTeamCompObj extends TeamCompObj {
  teamComp: string;
}

export interface ChartDataSet {
  labels: (string | string[])[];
  datasets: {
    label: string;
    data: number[];
    wins?: number[];
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

export type CharnameFormData = {
  charName: string;
};

export type MatchSessions = {
  [Key: number]: ArenaMatch[];
};
