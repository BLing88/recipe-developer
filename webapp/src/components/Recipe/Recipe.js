import React, { useReducer } from "react";
import PropTypes from "prop-types";
import "./Recipe.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { Notes } from "../Notes";
import {
  nameOfRecipe,
  buildIngredient,
  buildInstruction,
  getIngredientOf,
  idOfIngredient,
  getInstructionOf,
  idOfInstruction,
} from "../../utils/recipe";
import { InputForm } from "../InputForm";

const EDITING_NAME = "EDITING_NAME";
const UPDATE_RECIPE_NAME_INPUT = "UPDATE_RECIPE_NAME_INPUT";

const EDITING_INGREDIENTS = "EDITING_INGREDIENTS";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";

const EDITING_INSTRUCTIONS = "EDITING_INSTRUCTIONS";
const UPDATE_INSTRUCTIONS_INPUT = "UPDATE_INSTRUCTIONS_INPUT";
const ADD_INSTRUCTION = "ADD_INSTRUCTION";
const DELETE_INSTRUCTION = "DELETE_INSTRUCTION";
// const EDITING_NOTES = "EDITING_NOTES";

const initialState = recipe => {
  return {
    editName: false,
    recipeName: nameOfRecipe(recipe),
    editIngredients: false,
    ingredients: [...recipe.ingredients],
    editInstructions: false,
    instructions: [...recipe.instructions],
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
    case EDITING_INGREDIENTS:
      return {
        ...state,
        editIngredients: true,
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
        ingredients: [...state.ingredients, buildIngredient("")],
      };
    case DELETE_INGREDIENT:
      const numOfIngredients = state.ingredients.length;
      return {
        ...state,
        ingredients:
          numOfIngredients === 1
            ? [buildIngredient("")]
            : [
                ...state.ingredients.slice(0, action.targetIngredient),
                ...state.ingredients.slice(action.targetIngredient + 1),
              ],
      };
    case EDITING_INSTRUCTIONS:
      return {
        ...state,
        editInstructions: true,
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
        instructions: [...state.instructions, buildInstruction("")],
      };
    case DELETE_INSTRUCTION:
      const numOfInstructions = state.instructions.length;
      return {
        ...state,
        instructions:
          numOfInstructions === 1
            ? [buildInstruction("")]
            : [
                ...state.instructions.slice(0, action.targetInstruction),
                ...state.instructions.slice(action.targetInstruction + 1),
              ],
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

  const ingredientInputChangeHandler = (e, ingredient, index) => {
    e.preventDefault();
    const newIngredient = ingredient.ingredientId
      ? {
          ingredient: e.target.value,
          ingredientId: ingredient.ingredientId,
        }
      : buildIngredient(e.target.value);
    dispatch({
      type: UPDATE_INGREDIENTS_INPUT,
      ingredientNumber: index,
      ingredient: newIngredient,
    });
  };

  const instructionInputChangeHandler = (e, instruction, index) => {
    e.preventDefault();
    const newInstruction = idOfInstruction(instruction)
      ? {
          instruction: e.target.value,
          instructionId: idOfInstruction(instruction),
        }
      : buildIngredient(e.target.value);
    dispatch({
      type: UPDATE_INSTRUCTIONS_INPUT,
      instructionNumber: index,
      instruction: newInstruction,
    });
  };

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
      {!state.editIngredients ? (
        <Ingredients
          onClick={() => dispatch({ type: EDITING_INGREDIENTS })}
          ingredients={ingredients}
        />
      ) : (
        <InputForm
          title={"Ingredients"}
          objectName={"ingredient"}
          displayName={"ingredient"}
          objects={state.ingredients}
          getValueOfObject={getIngredientOf}
          getIdOfObject={idOfIngredient}
          inputChangeHandler={ingredientInputChangeHandler}
          addObjectHandler={e => {
            e.preventDefault();
            dispatch({ type: ADD_INGREDIENT });
          }}
          deleteObjectHandler={targetIndex => {
            dispatch({
              type: DELETE_INGREDIENT,
              targetIngredient: targetIndex,
            });
          }}
        />
      )}
      {!state.editInstructions ? (
        <Instructions
          onClick={() => dispatch({ type: EDITING_INSTRUCTIONS })}
          instructions={instructions}
        />
      ) : (
        <InputForm
          title={"Instructions"}
          objectName={"instruction"}
          displayName={"step"}
          objects={state.instructions}
          getValueOfObject={getInstructionOf}
          getIdOfObject={idOfInstruction}
          inputChangeHandler={instructionInputChangeHandler}
          addObjectHandler={e => {
            e.preventDefault();
            dispatch({ type: ADD_INSTRUCTION });
          }}
          deleteObjectHandler={targetIndex => {
            dispatch({
              type: DELETE_INSTRUCTION,
              targetInstruction: targetIndex,
            });
          }}
        />
      )}
      <Notes
        // onClick={() => setEditing(EDITING_NOTES)}
        notes={notes}
      />
    </article>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export { Recipe };
