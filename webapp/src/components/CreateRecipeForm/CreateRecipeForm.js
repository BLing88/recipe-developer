import React, { useReducer } from "react";
import PropTypes from "prop-types";

const defaultState = {
  recipeName: "",
  ingredients: [""],
  instructions: [""],
  notes: [""],
  showMissingRecipeName: false,
};
const UPDATE_NAME_INPUT = "UPDATE_NAME_INPUT";
const SHOW_MISSING_RECIPE_NAME = "SHOW_MISSING_RECIPE_NAME";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";
const UPDATE_INSTRUCTIONS_INPUT = "UPDATE_INSTRUCTIONS_INPUT";
const ADD_INSTRUCTION = "ADD_INSTRUCTION";
const DELETE_INSTRUCTION = "DELETE_INSTRUCTION";
const UPDATE_NOTES_INPUT = "UPDATE_NOTES_INPUT";
const ADD_NOTE = "ADD_NOTE";
const DELETE_NOTE = "DELETE_NOTE";
const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_NAME_INPUT:
      return {
        ...state,
        recipeName: action.recipeName,
      };
    case SHOW_MISSING_RECIPE_NAME:
      return {
        ...state,
        showMissingRecipeName: true,
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
    case UPDATE_NOTES_INPUT:
      return {
        ...state,
        notes: [
          ...state.notes.slice(0, action.noteNumber),
          action.note,
          ...state.notes.slice(action.noteNumber + 1),
        ],
      };
    case ADD_NOTE:
      return {
        ...state,
        notes: [...state.notes, ""],
      };
    case DELETE_NOTE:
      const numOfNotes = state.notes.length;
      return {
        ...state,
        notes:
          numOfNotes === 1 ? [""] : [...state.notes.slice(0, numOfNotes - 1)],
      };
    default:
      return state;
  }
};
const CreateRecipeForm = ({ createRecipeHandler, error, loading }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <>
    <form data-testid="create-recipe-form">
      <label htmlFor="recipe-name">Recipe name</label>
      <input
        id="recipe-name"
        type="text"
        value={state.recipeName}
        onChange={e => {
          e.preventDefault();
          dispatch({ type: UPDATE_NAME_INPUT, recipeName: e.target.value });
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
              <textarea
                id={`recipe-instructions-${i + 1}`}
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

      <section>
        Notes
        <ul>
          {state.notes.map((note, i) => (
            <li key={i}>
              <label htmlFor={`recipe-notes-${i + 1}`}>note {i + 1}:</label>
              <textarea
                id={`recipe-notes-${i + 1}`}
                value={note}
                onChange={e => {
                  e.preventDefault();
                  dispatch({
                    type: UPDATE_NOTES_INPUT,
                    noteNumber: i,
                    note: e.target.value,
                  });
                }}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: ADD_NOTE });
          }}
        >
          Add note
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch({ type: DELETE_NOTE });
          }}
        >
          Delete note
        </button>
      </section>

      <button
        onClick={e => {
          e.preventDefault();
            if (!state.recipeName) {
              dispatch({ type: SHOW_MISSING_RECIPE_NAME });
            } else {
              createRecipeHandler({
                recipeName: state.recipeName,
                ingredients: state.ingredients,
                instructions: state.instructions,
                notes: state.notes,
              });
            }
        }}
        type="submit"
      >
        Create recipe
      </button>
        {state.showMissingRecipeName ? <div>Recipe name required</div> : null}
    </form>
    </>
  );
};
CreateRecipeForm.propTypes = {
  createRecipeHandler: PropTypes.func.isRequired,
};

export default CreateRecipeForm;
export { CreateRecipeForm };
