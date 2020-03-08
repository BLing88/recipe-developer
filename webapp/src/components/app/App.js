import React from "react";
import "./App.css";
import { LandingPage } from "../LandingPage";
import { AuthenticatedApp } from "../AuthenticatedApp";
import { GRAPHQL_URL } from "../../graphql-configs";

import { useAuth0 } from "../../react-auth0-spa";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const App = () => {
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    getTokenSilently,
  } = useAuth0();

  if (!user) {
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

  if (loading) {
    return <main>Redirecting...</main>;
  }

  if (isAuthenticated) {
    return (
      <ApolloProvider client={client}>
        <AuthenticatedApp />
      </ApolloProvider>
    );
  }
};

export default App;
export { App };
