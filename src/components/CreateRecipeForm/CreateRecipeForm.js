import React, { useReducer } from "react";
import PropTypes from "prop-types";

import { buildRecipe } from "../../utils/recipe";

const defaultState = {
  name: "",
  ingredients: [""],
  instructions: [""],
  notes: [""],
};
const UPDATE_NAME_INPUT = "UPDATE_NAME_INPUT";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";
const UPDATE_INSTRUCTIONS_INPUT = "UPDATE_INSTRUCTIONS_INPUT";
const ADD_INSTRUCTION = "ADD_INSTRUCTION";
const DELETE_INSTRUCTION = "DELETE_INSTRUCTION";
const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_NAME_INPUT:
      return {
        ...state,
        name: action.name,
      };
    case UPDATE_INGREDIENTS_INPUT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, action.ingredientNumber),
          action.ingredient,
          ...state.ingredients.slice(action.ingredientNumber + 1),
        ],
      };
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, ""],
      };
    case DELETE_INGREDIENT:
      const numOfIngredients = state.ingredients.length;
      return {
        ...state,
        ingredients:
          numOfIngredients === 1
            ? [""]
            : [...state.ingredients.slice(0, numOfIngredients - 1)],
      };
    case UPDATE_INSTRUCTIONS_INPUT:
      return {
        ...state,
        instructions: [
          ...state.instructions.slice(0, action.instructionNumber),
          action.instruction,
          ...state.instructions.slice(action.instructionNumber + 1),
        ],
      };
    case ADD_INSTRUCTION:
      return {
        ...state,
        instructions: [...state.instructions, ""],
      };
    case DELETE_INSTRUCTION:
      const numOfInstructions = state.instructions.length;
      return {
        ...state,
        instructions:
          numOfInstructions === 1
            ? [""]
            : [...state.instructions.slice(0, numOfInstructions - 1)],
      };
    default:
      return state;
  }
};
const CreateRecipeForm = ({ createRecipeHandler }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <form data-testid="create-recipe-form">
      <label htmlFor="recipe-name">Name</label>
      <input
        id="recipe-name"
        type="text"
        value={state.name}
        onChange={e => {
          e.preventDefault();
          dispatch({ type: UPDATE_NAME_INPUT, name: e.target.value });
        }}
        required
      />
      <section>
        Ingredients
        <ul>
          {state.ingredients.map((ingredient, i) => (
            <li key={i}>
              <label htmlFor={`recipe-ingredients-${i + 1}`}>
                ingredient {i + 1}:
              </label>
              <input
                id={`recipe-ingredients-${i + 1}`}
                type="text"
                value={ingredient}
                onChange={e => {
                  e.preventDefault();
                  dispatch({
                    type: UPDATE_INGREDIENTS_INPUT,
                    ingredientNumber: i,
                    ingredient: e.target.value,
                  });
                }}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: ADD_INGREDIENT });
          }}
        >
          Add ingredient
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: DELETE_INGREDIENT });
          }}
        >
          Delete ingredient
        </button>
      </section>

      <section>
        Instructions
        <ul>
          {state.instructions.map((instruction, i) => (
            <li key={i}>
              <label htmlFor={`recipe-instructions-${i + 1}`}>
                step {i + 1}:
              </label>
              <input
                id={`recipe-instructions-${i + 1}`}
                type="text"
                value={instruction}
                onChange={e => {
                  e.preventDefault();
                  dispatch({
                    type: UPDATE_INSTRUCTIONS_INPUT,
                    instructionNumber: i,
                    instruction: e.target.value,
                  });
                }}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: ADD_INSTRUCTION });
          }}
        >
          Add instruction
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: DELETE_INSTRUCTION });
          }}
        >
          Delete instruction
        </button>
      </section>

      <button
        onClick={e => {
          e.preventDefault();
          createRecipeHandler({ ...state });
        }}
        type="submit"
      >
        Create recipe
      </button>
    </form>
  );
};
CreateRecipeForm.propTypes = {
  createRecipeHandler: PropTypes.func.isRequired,
};

export default CreateRecipeForm;
export { CreateRecipeForm };
