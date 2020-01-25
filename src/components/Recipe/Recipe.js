import React from "react";
import PropTypes from "prop-types";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";

const Recipe = ({ recipe }) => {
  const { name, ingredients, instructions } = recipe;
  return (
    <div className="recipe">
      <h1 className="recipe-name">{name}</h1>
      <Ingredients ingredients={ingredients} />
      <Instructions instructions={instructions} />
    </div>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired
};

export { Recipe };
