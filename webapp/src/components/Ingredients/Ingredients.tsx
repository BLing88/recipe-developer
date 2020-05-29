import React from "react";
import "./Ingredients.css";

import { idOfIngredient } from "../../utils/recipe";

const Ingredients = ({
  ingredients,
  onClick,
}: {
  ingredients: Recipe.Ingredient[];
  onClick: () => void;
}) => (
  <section className="ingredients">
    <h2 onClick={onClick}>Ingredients</h2>
    <ul className="ingredients-list">
      {ingredients.map((ingredient) => (
        <li onClick={onClick} key={idOfIngredient(ingredient)}>
          {ingredient.ingredient}
        </li>
      ))}
    </ul>
  </section>
);

export { Ingredients };
