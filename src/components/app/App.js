import React from "react";
import "./App.css";
import { testRecipe } from "../../static-recipe";

const App = () => {
  // const [recipe, setRecipe] = useState({});

  return (
    <div className="app">
      <div className="recipe-title">{testRecipe.title}</div>
    </div>
  );
};

export { App };
