import React, { useEffect, useState } from "react";

export type localStorageStatusDisplayProps = {};

const LocalStorageStatusDisplay: React.FC<localStorageStatusDisplayProps> =
  () => {
    const fullSize = 5120; // 5mb local storage for most browsers
    const [lsSize, setLsSize] = useState<string>("");
    useEffect(() => {
      let lsTotal = 0;
      let xLen;
      let x;

      for (x in localStorage) {
        if (!localStorage.hasOwnProperty(x)) {
          continue;
        }
        xLen = (localStorage[x].length + x.length) * 2;
        lsTotal += xLen;
      }
      setLsSize((lsTotal / 1024).toFixed(2));
    }, []);

    const fractionOfFull = ((Number(lsSize) / fullSize) * 100).toFixed(0);

    if (Number(fractionOfFull) > 100) {
      return (
        <div className="local-storage-status-display__info local-storage-status-display__info--no-bar">
          Seems like your browser supports more than 5mb of local storage.
          Status bar is off. Make sure to check after each log parse if new data
          is actually stored.
        </div>
      );
    }

    return (
      <div className={"local-storage-status-display"}>
        <div className="local-storage-status-display__bar">
          <div className={"local-storage-status-display__outer-bar"} />
          <div
            className={"local-storage-status-display__inner-bar"}
            style={{ width: `${fractionOfFull}%` }}
          />
        </div>
        <div className="local-storage-status-display__info">
          <div>Local storage status:</div>
          <div className="local-storage-status-display__percentage">
            {fractionOfFull + "% filled,"}
          </div>
          <div className="local-storage-status-display__value">
            {lsSize + " KB"}
          </div>
        </div>
      </div>
    );
  };

export default LocalStorageStatusDisplay;
