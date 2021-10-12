import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseData } from "../utils/parseData";
import { arrayBufferToString } from "../utils/ArrayBuffer-StringHelper";

export type dashboardProps = {
  className?: string;
};

const Dashboard: React.FC<dashboardProps> = (props) => {
  let [output, setOutput] = useState("");

  // dropzone functionality
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      //TBD
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        // console.log(arrayBufferToString(binaryStr));
        setOutput(parseData(arrayBufferToString(binaryStr)));
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="dashboard">
      <div {...getRootProps()} className={"dashboard__dropzone"}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className={"dashboard__output"}>{JSON.stringify(output)}</div>
    </div>
  );

  return <div className="dashboard">Info goes here</div>;
};

export default Dashboard;
