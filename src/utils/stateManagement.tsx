import React from "react";
import { ArenaMatch } from "../Types/ArenaTypes";

export const INSTANCE_DATA = "instanceData";
export const MY_CHAR_NAME = "myCharName";

export function mergeState(filteredData: ArenaMatch[]): void {
  const filterKey = "enteredTime";
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

export function setLocalStorageField(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
