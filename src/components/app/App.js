import React, { useState } from "react";
import "./App.css";
import { Recipe } from "../Recipe";
import { EditRecipeForm } from "../EditRecipeForm";
import { testRecipe } from "../../static-recipe";

const App = () => {
  const [recipe, setRecipe] = useState(testRecipe);
  const updateRecipeHandler = event => {
    event.preventDefault();
    // TODO
    // make API call to update recipe
    // and get updated recipe
    // setRecipe(updatedRecipe)
  };
  return (
    <div className="app">
      <Recipe recipe={recipe} />
      <EditRecipeForm updateRecipeHandler={updateRecipeHandler} />
    </div>
  );
};

export { App };
