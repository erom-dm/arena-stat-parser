import {
  ArenaMatch,
  LineChartInputData,
  MatchSessions,
  RatingChangeDataset,
  RatingChangeObj,
} from "../../Types/ArenaTypes";

export function createMatchRatingChangeDataSet(
  data: ArenaMatch[]
): RatingChangeDataset {
  const dataset: RatingChangeDataset = [];
  data.forEach((match) => {
    fillRatingChangeArray(dataset, match);
  });

  return dataset;
}

export function createSessionRatingChangeDataSet(
  data: MatchSessions
): RatingChangeDataset {
  const relevantMatches: ArenaMatch[] = [];
  data.forEach((session) => {
    // start/end session variant
    // relevantMatches.push(session[0]);
    // session.length > 1 && relevantMatches.push(session[session.length - 1]);
    relevantMatches.push(session[session.length - 1]);
  });
  const dataset: RatingChangeDataset = [];
  relevantMatches.forEach((match) => {
    fillRatingChangeArray(dataset, match);
  });
  return dataset;
}

function fillRatingChangeArray(
  arr: RatingChangeDataset,
  match: ArenaMatch
): void {
  const { enteredTime: timestamp, myTeam, enemyTeam, win } = match;
  const { newTeamRating, teamMMR } = myTeam;

  const RatingChangeObject: RatingChangeObj = {
    timestamp,
    newTeamRating,
    teamMMR,
    win,
    enemyTeamComp: enemyTeam.teamCompString,
  };
  arr.push(RatingChangeObject);
}

export function getSessionChangeChartInputData(
  dataset: RatingChangeDataset
): LineChartInputData {
  return dataset
    .sort((a, b) => a.timestamp - b.timestamp)
    .reduce(
      (data, current, index) => {
        const { enemyTeamComp, newTeamRating, win } = current;

        data.teamRatingArr.push(newTeamRating);
        data.enemyTeamCompArr.push(enemyTeamComp);
        data.labelArr.push(String(index + 1));
        data.winArray.push(win);

        const teamMMR = dataset[index + 1]?.teamMMR;
        teamMMR && data.teamMMRArr.push(teamMMR);
        return data;
      },
      {
        teamRatingArr: [],
        teamMMRArr: [],
        enemyTeamCompArr: [],
        labelArr: [],
        winArray: [],
      } as LineChartInputData
    );
}
