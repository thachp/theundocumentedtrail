import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { BeginnerApp } from "./BeginnerApp.jsx";
import "./styles.css";
import { CambodiaApp } from "./CambodiaApp.jsx";
import { cambodiaStoryEnabled } from "./cambodiaState.js";

const experience = new URLSearchParams(window.location.search).get("mode");
const isCambodia = cambodiaStoryEnabled(import.meta.env) && new URLSearchParams(window.location.search).get("story") === "cambodia-1979";
const ActiveApp = isCambodia ? CambodiaApp : experience === "full" ? App : BeginnerApp;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ActiveApp />
  </React.StrictMode>,
);
