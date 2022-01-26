import {
  classCompressionMapType,
  raceCompressionMapType,
} from "../Types/ArenaTypes";
import { isMobile } from "react-device-detect";

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

// Matchup chart constants
const chartVars = {
  tickSize: isMobile ? 12 : 15,
  maxTicksLimitY: isMobile ? 8 : 15,
  maxTicksLimitX: isMobile ? 10 : 20,
};
export const tooltipFontConf = {
  titleFont: {
    size: 18,
    family: "'Roboto', sans-serif",
  },
  bodyFont: {
    size: 14,
    family: "'Roboto Mono', monospace",
  },
};
export const ticksConf = {
  color: "#292F36",
  font: { size: chartVars.tickSize, family: "'Roboto', sans-serif" },
  stepSize: 1,
  beginAtZero: true,
};
