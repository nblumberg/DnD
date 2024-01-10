import { createRoot } from "react-dom/client";
import { App } from "./App";

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  const reactRoot = createRoot(rootElement, { identifierPrefix: "combat-tracker" });
  reactRoot.render(<App />);
});
