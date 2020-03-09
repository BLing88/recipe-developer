import React, { useReducer } from "react";
import PropTypes from "prop-types";
import "./Recipe.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { Notes } from "../Notes";
import { nameOfRecipe } from "../../utils/recipe";

const EDITING_NAME = "EDITING_NAME";
const UPDATE_RECIPE_NAME_INPUT = "UPDATE_RECIPE_NAME_INPUT";
const initialState = recipe => {
  return {
    editName: false,
    recipeName: nameOfRecipe(recipe),
  };
};
const recipeReducer = (state, action) => {
  switch (action.type) {
    case EDITING_NAME:
      return {
        ...state,
        editName: true,
      };
    case UPDATE_RECIPE_NAME_INPUT:
      return {
        ...state,
        recipeName: action.recipeName,
      };
    default:
      return {
        ...state,
      };
  }
};

const Recipe = ({ recipe, updateHandler }) => {
  const { recipeName, ingredients, instructions, notes } = recipe;
  const [state, dispatch] = useReducer(recipeReducer, recipe, initialState);

  return (
    <article className="recipe">
      {!state.editName ? (
        <h1
          onClick={() => dispatch({ type: EDITING_NAME })}
          className="recipe-name"
        >
          {recipeName}
        </h1>
      ) : (
        <>
          <label htmlFor="recipe-name">Recipe name</label>
          <input
            id="recipe-name"
            type="text"
            value={state.recipeName}
            onChange={e => {
              e.preventDefault();
              dispatch({
                type: UPDATE_RECIPE_NAME_INPUT,
                recipeName: e.target.value,
              });
            }}
            required
          />
        </>
      )}
      {/* <picture className="recipe-image">
        <img src={require("../../assets/gimbap-mobile.png")} alt="gimbap" />
      </picture> */}
      {/* abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz */}
      <Ingredients ingredients={ingredients} />
      <Instructions instructions={instructions} />
      <Notes notes={notes} />
    </article>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export { Recipe };
