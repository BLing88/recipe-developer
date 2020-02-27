import React, { useState } from "react";
import "./App.css";
import { Recipe } from "../Recipe";
// import { EditRecipeForm } from "../EditRecipeForm";
import { testRecipe } from "../../static-recipe";

import { NavBar } from "../NavBar/NavBar";
import { useAuth0 } from "../../react-auth0-spa";

const App = () => {
  // eslint-disable-next-line
  const [recipe, setRecipe] = useState(testRecipe);
  const { loading } = useAuth0();
  // const updateRecipeHandler = event => {
  //   event.preventDefault();
  //   // TODO
  //   // make API call to update recipe
  //   // and get updated recipe
  //   // setRecipe(updatedRecipe)
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <nav className="app-header">
        <NavBar />
        <button>My recipes</button>
        <button>Create recipe</button>
        <button>My profile</button>
      </nav>
      <Recipe recipe={recipe} />
      {/* <EditRecipeForm updateRecipeHandler={updateRecipeHandler} /> */}
    </div>
  );
};

export { App };
