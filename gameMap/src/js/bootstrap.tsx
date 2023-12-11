import { createRoot } from "react-dom/client";
import { App } from "./App";

window.addEventListener("DOMContentLoaded", () => {
  console.log("bootstrap");
  const rootNode = document.createElement("div");
  document.body.appendChild(rootNode);
  const root = createRoot(rootNode);
  root.render(<App />);
});
