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
        console.log(arrayBufferToString(binaryStr));
        setOutput(arrayBufferToString(binaryStr));
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  //
  // let testStr = "asdada -- [12] a;lk asld aklkl -- [1] asd -- [299] }}";

  let ast = parseData(output);
  // let ast = parseData(testStr);

  return (
    <div className="dashboard">
      <div {...getRootProps()} className={"dashboard__dropzone"}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className={"dashboard__output"}>{JSON.stringify(ast)}</div>
    </div>
  );

  return <div className="dashboard">Info goes here</div>;
};

export default Dashboard;
