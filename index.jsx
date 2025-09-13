import React from "react";
import { createRoot } from "react-dom/client";
import IGCardGenerator from "./IGCardGenerator";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(<IGCardGenerator />);