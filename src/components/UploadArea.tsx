import React from "react";

export type landingProps = {
  className?: string;
};

const UploadArea: React.FC<landingProps> = (props) => {
  return (
    <div className="upload-area">
      <h2>Upload file here</h2>
    </div>
  );
};

export default UploadArea;
