import React from "react";
import "./App.css";
import { LandingPage } from "../LandingPage";
import { SplashPage } from "../SplashPage";
import { AuthenticatedApp } from "../AuthenticatedApp";
import { GRAPHQL_URL } from "../../graphql-configs";
import { BrowserRouter } from "react-router-dom";

import { useAuth0 } from "../../react-auth0-spa";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const App = () => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    getTokenSilently,
  } = useAuth0();

  if (loading) {
    return <SplashPage />;
  }

  if (!isAuthenticated) {
    return (
      <LandingPage
        loginWithRedirect={loginWithRedirect}
        signup={loginWithRedirect}
      />
    );
  }

  const client = new ApolloClient({
    uri: GRAPHQL_URL,
    request: async operation => {
      // Get token or get refreshed token
      const token = isAuthenticated ? await getTokenSilently() : null;

      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    },
  });

  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <AuthenticatedApp />
        </ApolloProvider>
      </BrowserRouter>
    );
  }
};

export default App;
export { App };
