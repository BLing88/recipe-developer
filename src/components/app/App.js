import React from "react";
import "./App.css";
import { Ingredients } from "../../components/Ingredients";
import { testRecipe } from "../../static-recipe";

const App = () => {
  // const [recipe, setRecipe] = useState({});

  return (
    <div className="app">
      <div className="recipe-title">{testRecipe.title}</div>
      <Ingredients ingredients={testRecipe.ingredients} />
    </div>
  );
};

export { App };
