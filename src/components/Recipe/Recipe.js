import React from "react";
import PropTypes from "prop-types";
import "./Recipe.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { Notes } from "../Notes";

const Recipe = ({ recipe }) => {
  const { name, ingredients, instructions, notes } = recipe;
  return (
    <article className="recipe">
      <h1 className="recipe-name">{name}</h1>
      <picture className="recipe-image">
        <img src={require("../../assets/gimbap-mobile.png")} alt="gimbap" />
      </picture>
      {/* abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz */}
      <Ingredients ingredients={ingredients} />
      <Instructions instructions={instructions.map(i => i.instruction)} />
      <Notes notes={notes.map(n => n.note)} />
    </article>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export { Recipe };
