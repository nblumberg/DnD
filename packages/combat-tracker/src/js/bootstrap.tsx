import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { StateProvider } from "./app/store";
import { ErrorPage } from "./modules/pages/ErrorPage";

const googleClientId =
  "569216772010-aajsfq84c2vko1iv60c0uscm4gef3m8f.apps.googleusercontent.com";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
  ]);

  const reactRoot = createRoot(rootElement, {
    identifierPrefix: "combat-tracker",
  });
  reactRoot.render(
    <GoogleOAuthProvider clientId={googleClientId}>
      <React.StrictMode>
        <StateProvider>
          <RouterProvider router={router} />
        </StateProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
});
