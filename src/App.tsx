import React from "react";
import "./App.css";
import UploadArea from "./components/UploadArea";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="main-wrap">
      <Dashboard />
      <UploadArea />
    </div>
  );
}

export default App;
