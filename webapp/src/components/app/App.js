import React from "react";
import "./App.css";
import { LandingPage } from "../LandingPage";
import { AuthenticatedApp } from "../AuthenticatedApp";

import { useAuth0 } from "../../react-auth0-spa";

const App = () => {
  const { loading, user, isAuthenticated, loginWithRedirect } = useAuth0();

  if (!user) {
    return (
      <LandingPage
        loginWithRedirect={loginWithRedirect}
        signup={loginWithRedirect}
      />
    );
  } else if (loading) {
    return <main>Redirecting...</main>;
  }

  if (isAuthenticated) {
    console.log(user);
    return <AuthenticatedApp />;
  }
};

export default App;
export { App };
