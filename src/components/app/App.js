import React from "react";
import "./App.css";
import { Ingredients } from "../../components/Ingredients";
import { testRecipe } from "../../static-recipe";

const App = () => {
  // const [recipe, setRecipe] = useState({});

  return (
    <div className="app">
      <h1 className="recipe-title">{testRecipe.title}</h1>
      <Ingredients ingredients={testRecipe.ingredients} />
      <ol className="recipe-instructions">
        {testRecipe.instructions.map(instruction => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>
    </div>
  );
};

export { App };
