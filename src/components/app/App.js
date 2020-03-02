import React, { useState } from "react";
import "./App.css";
import { LandingPage } from "../LandingPage";
import { AuthenticatedApp } from "../AuthenticatedApp";
// import { EditRecipeForm } from "../EditRecipeForm";
import { testRecipe } from "../../static-recipe";

import { useAuth0 } from "../../react-auth0-spa";

const App = () => {
  // eslint-disable-next-line
  const [recipe, setRecipe] = useState(testRecipe);
  const { loading, user, isAuthenticated, loginWithRedirect } = useAuth0();
  // const updateRecipeHandler = event => {
  //   event.preventDefault();
  //   // TODO
  //   // make API call to update recipe
  //   // and get updated recipe
  //   // setRecipe(updatedRecipe)
  // };

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
