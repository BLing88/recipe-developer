import React from "react";
import PropTypes from "prop-types";

const Ingredients = ({ ingredients }) => (
  <div className="ingredients">
    <h2>Ingredients</h2>
    <ol className="ingredients-list">
      {ingredients.map(ingredient => (
        <li key={ingredient.name}>
          {ingredient.name} - {ingredient.quantity}
        </li>
      ))}
    </ol>
  </div>
);
Ingredients.propTypes = {
  ingredients: PropTypes.array.isRequired
};

export { Ingredients };
