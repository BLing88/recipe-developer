import React from "react";
import PropTypes from "prop-types";
import "./Ingredients.css";

const Ingredients = ({ ingredients }) => (
  <section className="ingredients">
    <h2>Ingredients</h2>
    <ul className="ingredients-list">
      {ingredients.map(ingredient => (
        <li key={ingredient.id}>{ingredient.ingredient}</li>
      ))}
    </ul>
  </section>
);
Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Ingredients };
