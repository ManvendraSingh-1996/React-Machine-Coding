import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RemoteTodoStats from "./RemoteTodoStats";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="remote-page">
      <RemoteTodoStats />
    </div>
  </StrictMode>,
);
