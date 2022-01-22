import {
  classCompressionMapType,
  raceCompressionMapType,
} from "../Types/ArenaTypes";

// export const ARENA_INSTANCE_KEYS = ["572", "562", "559"];
export const ARENA_INSTANCE_IDS = {
  [572 as number]: "Ruins of Lordaeron",
  [562 as number]: "Blade's Edge Arena",
  [559 as number]: "Nagrand Arena",
};
export const CHART_ROUTES = [
  ["Matches", "/matches"],
  ["Team comps", "/team-comps"],
  ["Rating change", "/rating-change"],
  ["Teams", "/teams"],
];
export const DC_TEAM_NAME = "~DC~";
export const INSTANCE_DATA = "instanceData";
export const PLAYER_DC_STRING = "DC";
export const classCompressionMapLC: classCompressionMapType = {
  Druid: "d",
  Rogue: "r",
  Hunter: "h",
  Mage: "m",
  Paladin: "p",
  Priest: "i",
  Shaman: "s",
  Warlock: "l",
  Warrior: "w",
};
export const raceCompressionMap: raceCompressionMapType = {
  Undead: "u",
  Orc: "o",
  Troll: "t",
  Tauren: "c",
  Bloodelf: "b",
  Human: "h",
  Dwarf: "d",
  Nightelf: "n",
  Draenei: "g",
  Gnome: "m",
};
export const classColorMap = {
  Druid: "#FF7C0A",
  Rogue: "#FFF468",
  Hunter: "#aad372",
  Mage: "#3FC7EB",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B6D",
};
