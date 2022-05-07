import {
  ArenaMatch,
  DetailedTeamRatingObject,
  EnemyTeamData,
  TeamsDataset,
} from "../../types/ArenaTypes";

export function createTeamsDataSet(data: ArenaMatch[]): TeamsDataset {
  const dataset: TeamsDataset = {};
  data.forEach((match) => {
    const {
      win,
      enemyTeam: {
        teamName,
        teamCompString: enemyTeamComp,
        playerNamesArr: enemyPlayerNames,
        teamMMR: enemyTeamMMR,
        teamRating: enemyTeamRating,
      },
    } = match;
    const enemyTeamData: EnemyTeamData = {
      teamName,
      enemyTeamComp,
      enemyPlayerNames,
      enemyTeamMMR,
      enemyTeamRating,
    };

    if (dataset[enemyTeamData.teamName]) {
      const teamEntry = dataset[enemyTeamData.teamName];
      dataset[enemyTeamData.teamName] = {
        teamName: teamEntry.teamName,
        enemyTeamComp: teamEntry.enemyTeamComp,
        enemyPlayerNames: Array.from(
          new Set([
            ...teamEntry.enemyPlayerNames,
            ...enemyTeamData.enemyPlayerNames,
          ])
        ),
        teamMMR: fillDetailedTeamRatingObject(
          enemyTeamData.enemyTeamMMR,
          teamEntry.teamMMR
        ),
        teamRating: fillDetailedTeamRatingObject(
          enemyTeamData.enemyTeamRating,
          teamEntry.teamRating
        ),
        matchesPlayed: teamEntry.matchesPlayed + 1,
        wins: teamEntry.wins + Number(win),
      };
    } else {
      const teamMMR = fillDetailedTeamRatingObject(enemyTeamData.enemyTeamMMR);
      const teamRating = fillDetailedTeamRatingObject(
        enemyTeamData.enemyTeamRating
      );
      dataset[enemyTeamData.teamName] = {
        teamName: enemyTeamData.teamName,
        enemyTeamComp: enemyTeamData.enemyTeamComp,
        enemyPlayerNames: enemyTeamData.enemyPlayerNames,
        teamMMR: teamMMR,
        teamRating: teamRating,
        matchesPlayed: 1,
        wins: Number(win),
      };
    }
  });
  return dataset;
}

function fillDetailedTeamRatingObject(
  rating: number,
  prevRatingObj?: DetailedTeamRatingObject
): DetailedTeamRatingObject {
  const obj: DetailedTeamRatingObject = {
    min: 0,
    max: 0,
    average: 0,
    total: 0,
    matchCount: 0,
  };
  if (!prevRatingObj) {
    obj.min = rating;
    obj.average = rating;
    obj.max = rating;
    obj.total = rating;
    obj.matchCount = 1;
  } else {
    obj.matchCount = prevRatingObj.matchCount + 1;
    obj.min = Math.min(prevRatingObj.min, rating);
    obj.max = Math.max(prevRatingObj.max, rating);
    obj.average = Number(
      (rating / obj.matchCount + prevRatingObj.total / obj.matchCount).toFixed(
        0
      )
    );
    obj.total = prevRatingObj.total + rating;
  }
  return obj;
}
