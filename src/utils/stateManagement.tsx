import React from "react";

export const INSTANCE_DATA = "instanceData";

interface instanceEntry {
  enteredTime: number;
  [key: string]: any;
}

export function mergeState(parsedFileData: instanceEntry[]): void {
  const filterKey = "enteredTime";
  const state = window.localStorage.getItem(INSTANCE_DATA);

  if (!state) {
    localStorage.setItem(INSTANCE_DATA, JSON.stringify(parsedFileData));
    return;
  }
  const parsedState = JSON.parse(state);
  const mergedState = [...parsedState, ...parsedFileData];

  const filteredState = [
    ...new Map(mergedState.map((item) => [item[filterKey], item])).values(),
  ];

  localStorage.setItem(INSTANCE_DATA, JSON.stringify(filteredState));
}

export function localStorageToState(
  setReactState: React.Dispatch<React.SetStateAction<null>>
): void {
  const currentState = window.localStorage.getItem(INSTANCE_DATA);
  currentState && setReactState(JSON.parse(currentState));
}
