import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { BeginnerApp } from "./BeginnerApp.jsx";
import "./styles.css";

const experience = new URLSearchParams(window.location.search).get("mode");
const ActiveApp = experience === "full" ? App : BeginnerApp;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ActiveApp />
  </React.StrictMode>,
);
