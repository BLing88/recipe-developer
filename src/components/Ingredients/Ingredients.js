import React from "react";
import PropTypes from "prop-types";

const Ingredients = ({ ingredients }) => (
  <ol className="ingredients-list">
    {ingredients.map(ingredient => (
      <li key={ingredient.name}>
        {ingredient.name} - {ingredient.quantity}
      </li>
    ))}
  </ol>
);
Ingredients.propTypes = {
  ingredients: PropTypes.array.isRequired
};

export { Ingredients };
