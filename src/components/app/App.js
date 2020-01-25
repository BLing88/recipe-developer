import React, { useState } from "react";
import "./App.css";
import { Recipe } from "../Recipe";
import { EditRecipeForm } from "../EditRecipeForm";
import { testRecipe } from "../../static-recipe";

const App = () => {
  const [recipe, setRecipe] = useState(testRecipe);

  return (
    <div className="app">
      <Recipe recipe={recipe} />
      <EditRecipeForm />
    </div>
  );
};

export { App };
