import React from "react";
import PropTypes from "prop-types";

const Ingredients = ({ ingredients }) => (
  <div className="ingredients">
    <h2>Ingredients</h2>
    <ul className="ingredients-list">
      {ingredients.map(ingredient => (
        <li key={ingredient.id}>{ingredient.ingredient}</li>
      ))}
    </ul>
  </div>
);
Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Ingredients };
