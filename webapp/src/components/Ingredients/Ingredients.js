import React from "react";
import PropTypes from "prop-types";
import "./Ingredients.css";

import { idOfIngredient } from "../../utils/recipe";

const Ingredients = ({ ingredients, onClick }) => (
  <section className="ingredients">
    <h2>Ingredients</h2>
    <ul className="ingredients-list">
      {ingredients.map(ingredient => (
        <li onClick={onClick} key={idOfIngredient(ingredient)}>
          {ingredient.ingredient}
        </li>
      ))}
    </ul>
  </section>
);
Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired,
};

export { Ingredients };
