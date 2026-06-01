import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.addEventListener("DOMContentLoaded", () => {
  const root = window.document.createElement("main");
  window.document.body.append(root);
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
