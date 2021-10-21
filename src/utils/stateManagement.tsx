import React from "react";
import { ModdedArenaMatch } from "../Types/ArenaTypes";

export const INSTANCE_DATA = "instanceData";

export function mergeState(filteredData: ModdedArenaMatch[]): void {
  const filterKey = "enteredTime";
  const state = window.localStorage.getItem(INSTANCE_DATA);

  if (!state) {
    localStorage.setItem(INSTANCE_DATA, JSON.stringify(filteredData));
    return;
  }
  const parsedState = JSON.parse(state);
  const mergedState = [...parsedState, ...filteredData];

  const filteredState = [
    ...new Map(mergedState.map((item) => [item[filterKey], item])).values(),
  ];

  localStorage.setItem(INSTANCE_DATA, JSON.stringify(filteredState));
}

export function localStorageToState(
  setReactState: React.Dispatch<React.SetStateAction<ModdedArenaMatch[]>>
): void {
  const currentState = window.localStorage.getItem(INSTANCE_DATA);
  currentState && setReactState(JSON.parse(currentState));
}
