import React from "react";
import { ModdedArenaMatch } from "../Types/ArenaTypes";
import { sampleData } from "../testData";

export const INSTANCE_DATA = "instanceData";

export function consolidateState(filteredData: ModdedArenaMatch[]): void {
  const filterKey = "matchID";
  const state = window.localStorage.getItem(INSTANCE_DATA);

  if (!state) {
    setLocalStorageField(INSTANCE_DATA, filteredData);
    return;
  }
  const parsedState = JSON.parse(state);
  const mergedState = [...parsedState, ...filteredData];

  const filteredState = [
    ...new Map(mergedState.map((item) => [item[filterKey], item])).values(),
  ];

  setLocalStorageField(INSTANCE_DATA, filteredState);
}

export function localStorageToState(
  key: string,
  setReactState: React.Dispatch<React.SetStateAction<any>>
): void {
  const currentState = window.localStorage.getItem(key);
  currentState && setReactState(JSON.parse(currentState));
}

export function clearLocalStorage(): void {
  window.localStorage.clear();
}

export function setLocalStorageField(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function sampleDataToLocalStorage(
  setLsChanged: React.Dispatch<React.SetStateAction<boolean>>
): void {
  setLocalStorageField(INSTANCE_DATA, sampleData);
  setLsChanged((prevState) => !prevState);
}
