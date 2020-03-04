import React from "react";
import PropTypes from "prop-types";
import "./Ingredients.css";

import { idOfIngredient } from "utils/recipe";

const Ingredients = ({ ingredients }) => (
  <section className="ingredients">
    <h2>Ingredients</h2>
    <ul className="ingredients-list">
      {ingredients.map(ingredient => (
        <li key={idOfIngredient(ingredient)}>{ingredient.ingredient}</li>
      ))}
    </ul>
  </section>
);
Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Ingredients };
