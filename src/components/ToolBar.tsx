import React, { useState } from "react";
import Drawer from "./Drawer";
import { CHART_ROUTES } from "../utils/dataSetHelpers";
import UploadArea from "./UploadArea";
import ButtonGroup from "./ButtonGroup";
import TeamSelect from "./TeamSelect";
import SessionSelect from "./SessionSelect";
import SettingsModal from "./SettingsModal";
import { MatchSessions } from "../Types/ArenaTypes";

export type toolbarProps = {
  myTeams: string[];
  sessionData: MatchSessions;
  setLocalStorageChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setMyTeamSelection: React.Dispatch<React.SetStateAction<string>>;
  setSessionSelection: React.Dispatch<React.SetStateAction<number[]>>;
};

export const SettingsModalContext = React.createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});

const ToolBar: React.FC<toolbarProps> = ({
  myTeams,
  sessionData,
  setLocalStorageChanged,
  setMyTeamSelection,
  setSessionSelection,
}) => {
  const [modalToggled, setModalToggled] = useState(false);
  return (
    <SettingsModalContext.Provider value={setModalToggled}>
      <div className="toolbar">
        <Drawer modalToggled={modalToggled}>
          <>
            <div className="drawer__filters-section">
              {myTeams && (
                <TeamSelect onChange={setMyTeamSelection} teams={myTeams} />
              )}
              <ButtonGroup buttonLabels={CHART_ROUTES} />
              {sessionData && (
                <SessionSelect
                  onChange={setSessionSelection}
                  sessionData={sessionData}
                />
              )}
            </div>
            <div className="drawer__top-btn-section">
              <SettingsModal localStoreChangeHandler={setLocalStorageChanged} />
              <UploadArea localStoreChangeHandler={setLocalStorageChanged} />
            </div>
          </>
        </Drawer>
        <div className="toolbar__filters">
          <ButtonGroup buttonLabels={CHART_ROUTES} />
          {myTeams && (
            <TeamSelect onChange={setMyTeamSelection} teams={myTeams} />
          )}
          {sessionData && (
            <SessionSelect
              onChange={setSessionSelection}
              sessionData={sessionData}
            />
          )}
        </div>
      </div>
    </SettingsModalContext.Provider>
  );
};

export default ToolBar;
