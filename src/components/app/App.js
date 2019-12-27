import React from "react";
import "./App.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { testRecipe } from "../../static-recipe";

const App = () => {
  // const [recipe, setRecipe] = useState({});

  return (
    <div className="app">
      <h1 className="recipe-title">{testRecipe.title}</h1>
      <Ingredients ingredients={testRecipe.ingredients} />
      <Instructions instructions={testRecipe.instructions} />
    </div>
  );
};

export { App };
