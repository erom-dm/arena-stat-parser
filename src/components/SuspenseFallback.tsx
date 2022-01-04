import React, { useEffect, useState } from "react";

const SuspenseFallback: React.FC = () => {
  const [ellipsis, setEllipsis] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      if (ellipsis.length === 3) {
        setEllipsis("");
      } else setEllipsis((current) => ".".repeat(current.length + 1));
    }, 500);
    return () => clearInterval(interval);
  }, [ellipsis]);

  return (
    <div className={"suspense-fallback"}>
      <div className={"suspense-fallback__text"}>{"Loading" + ellipsis}</div>
    </div>
  );
};

export default SuspenseFallback;
