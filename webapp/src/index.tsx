import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { RedirectLoginResult } from "@auth0/auth0-spa-js";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";

interface TargetUrl {
  targetUrl: string;
}

function isTargetUrl(x: RedirectLoginResult | TargetUrl): x is TargetUrl {
  return (
    x &&
    (x as TargetUrl).targetUrl !== null &&
    (x as TargetUrl).targetUrl !== undefined
  );
}

const onRedirectCallback = (appState: RedirectLoginResult | TargetUrl) => {
  if (isTargetUrl(appState)) {
    history.push(appState.targetUrl);
  } else {
    history.push(window.location.pathname);
  }
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    audience={config.audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
