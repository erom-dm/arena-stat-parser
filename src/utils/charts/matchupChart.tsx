import {
  ArenaMatch,
  MatchupInputData,
  RaceMatchupObject,
} from "../../Types/ArenaTypes";
import generateChartColors from "../colorGeneration";
import { interpolateGreys } from "d3-scale-chromatic";
import { colorRangeInfoGreys } from "../constants";
import { calcWinrate } from "../miscHelperFunctions";

export function generateMatchupRaceData(
  data: ArenaMatch[],
  teamComp: string,
  labelArray: (string | string[])[],
  categoryColorArray: string[]
): [MatchupInputData, ArenaMatch[]] {
  const filteredData = data.filter(
    (match) => match.enemyTeam.teamCompString === teamComp
  );
  let totalWins = 0;

  const teamCompStrings = teamComp.split(" \\ ");
  // !RmuObjectEntries sorting later in this function directly relies on string separator set here!
  const teamCompFormatted = `[ ${teamCompStrings.join(" ] [ ")} ]`;

  // Get matchup race data
  const RmuObject = filteredData.reduce((targetObj, match) => {
    const {
      win,
      enemyTeam: { players },
    } = match;
    if (win) {
      totalWins++;
    }

    const teamSize = players.length;
    const RmuPaddedStrings = players.map((player, idx) => {
      if (player && player?.race) {
        const padding = teamCompStrings[idx].length + 3;
        if (idx === 0) {
          return player.race.padStart(padding, " ");
        } else if (idx === teamSize - 1) {
          return player.race.padEnd(padding, " ");
        } else {
          const paddingDiff = padding - player.race.length;
          if (padding % 2 === 0) {
            return player.race
              .padStart(padding - paddingDiff / 2)
              .padEnd(padding + paddingDiff / 2);
          } else {
            return player.race
              .padStart(padding - (paddingDiff - 1) / 2)
              .padEnd(padding + (paddingDiff + 1) / 2);
          }
        }
      }
      return "";
    });
    const RmuString = RmuPaddedStrings.join(" | ");

    if (RmuString.length > 3) {
      if (targetObj[RmuString]) {
        targetObj[RmuString].totalMatches++;
        win && targetObj[RmuString].wins++;
      } else {
        targetObj[RmuString] = {
          totalMatches: 1,
          wins: Number(win),
          losses: 0,
          winrate: "",
        };
      }
    }
    return targetObj;
  }, {} as RaceMatchupObject);
  // Calc winrate and losses
  for (let i of Object.keys(RmuObject)) {
    const { totalMatches, wins } = RmuObject[i];
    RmuObject[i].losses = totalMatches - wins;
    RmuObject[i].winrate = calcWinrate(totalMatches, wins);
  }

  // Add field with teamcomp (total matches);
  RmuObject[teamCompFormatted] = {
    totalMatches: filteredData.length,
    wins: totalWins,
    losses: filteredData.length - totalWins,
    winrate: calcWinrate(filteredData.length, totalWins),
  };

  const sortedRmuObjectEntries = Object.entries(RmuObject).sort((a, b) => {
    const aIsCategory = +a[0].includes("] [");
    const bIsCategory = +b[0].includes("] [");
    return bIsCategory - aIsCategory || b[1].totalMatches - a[1].totalMatches;
  });
  // Transform data into set of arrays
  const MatchupInputData = sortedRmuObjectEntries.reduce(
    (matchupData, [key, { totalMatches, wins, winrate, losses }]) => {
      matchupData.matchupLabels.push(key);
      matchupData.matchupTotalGames.push(totalMatches);
      matchupData.matchupWins.push(wins);
      matchupData.matchupWinrate.push(winrate);
      matchupData.matchupLosses.push(losses);
      return matchupData;
    },
    {
      matchupLabels: [],
      matchupTotalGames: [],
      matchupWins: [],
      matchupWinrate: [],
      matchupLosses: [],
      matchupColorArray: [],
    } as MatchupInputData
  );

  const colorArray = [];
  const teamCompIndex = labelArray.flat().indexOf(teamComp);
  colorArray.push(categoryColorArray[teamCompIndex]);
  generateChartColors(
    sortedRmuObjectEntries.length - 1,
    interpolateGreys,
    colorRangeInfoGreys,
    colorArray
  );

  MatchupInputData.matchupColorArray = colorArray;

  // In case RMU data is too short, pad chart area with empty categories
  if (sortedRmuObjectEntries.length < 7) {
    const paddingNum = 7 - sortedRmuObjectEntries.length;
    for (let i = 0; i < paddingNum; i++)
      MatchupInputData.matchupLabels.push(" ");
    MatchupInputData.matchupTotalGames.push(0);
    MatchupInputData.matchupWins.push(0);
    MatchupInputData.matchupLosses.push(0);
    MatchupInputData.matchupWinrate.push(" ");
  }

  return [MatchupInputData, filteredData];
}

export function formatMatchupChartTooltip(tooltip: any): string[] {
  const index = tooltip.dataIndex;
  const losses = tooltip.dataset.losses[index];
  const wins = tooltip.dataset.wins[index];
  const winrate = tooltip.dataset.winrates[index];
  return [`Wins: ${wins}, Losses: ${losses}`, `Winrate: ${winrate}%`];
}
