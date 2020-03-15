import React, { useReducer } from "react";
import PropTypes from "prop-types";
import styles from "./CreateRecipeForm.module.css";
import { LoadingSpinner } from "../LoadingSpinner";

import { InputForm } from "../InputForm";
import {
  buildIngredient,
  buildInstruction,
  getIngredientOf,
  idOfIngredient,
  getInstructionOf,
  idOfInstruction,
  getNoteOf,
  idOfNote,
  buildNote,
} from "../../utils/recipe";

const defaultState = {
  recipeName: "",
  ingredients: [buildIngredient("")],
  instructions: [buildInstruction("")],
  notes: [buildNote("")],
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
        notes: [...state.notes, buildNote("")],
      };
    case DELETE_NOTE:
      const numOfNotes = state.notes.length;
      return {
        ...state,
        notes:
          numOfNotes === 1
            ? [buildNote("")]
            : [
                ...state.notes.slice(0, action.targetNote),
                ...state.notes.slice(action.targetNote + 1),
              ],
      };
    default:
      return state;
  }
};

const CreateRecipeForm = ({ createRecipeHandler, error, loading }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

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
      : buildInstruction(e.target.value);
    dispatch({
      type: UPDATE_INSTRUCTIONS_INPUT,
      instructionNumber: index,
      instruction: newInstruction,
    });
  };

  const noteInputChangeHandler = (e, note, index) => {
    e.preventDefault();
    const newNote = idOfNote(note)
      ? {
          note: e.target.value,
          noteId: idOfNote(note),
        }
      : buildNote(e.target.value);
    dispatch({
      type: UPDATE_NOTES_INPUT,
      noteNumber: index,
      note: newNote,
    });
  };

  return (
    <>
      <form
        className={styles.createRecipeForm}
        data-testid="create-recipe-form"
      >
        <section className={styles.recipeNameAndInput}>
          <label htmlFor="recipe-name">
            <h1 className={styles.recipeName}>Recipe name:</h1>
          </label>
          <input
            className={styles.recipeNameInput}
            id="recipe-name"
            type="text"
            value={state.recipeName}
            onChange={e => {
              e.preventDefault();
              dispatch({ type: UPDATE_NAME_INPUT, recipeName: e.target.value });
            }}
            required
          />
        </section>

        <div className={styles.ingredients}>
          <InputForm
            title={"Ingredients"}
            objectName={"ingredient"}
            displayName={"ingredient"}
            displayType={"textarea"}
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
        </div>

        <div className={styles.instructions}>
          <InputForm
            title={"Instructions"}
            objectName={"instruction"}
            displayType={"textarea"}
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
        </div>

        <div className={styles.notes}>
          <InputForm
            title={"Notes"}
            objectName={"note"}
            displayName={"note"}
            displayType={"textarea"}
            objects={state.notes}
            getValueOfObject={getNoteOf}
            getIdOfObject={idOfNote}
            inputChangeHandler={noteInputChangeHandler}
            addObjectHandler={e => {
              e.preventDefault();
              dispatch({ type: ADD_NOTE });
            }}
            deleteObjectHandler={targetIndex => {
              dispatch({
                type: DELETE_NOTE,
                targetNote: targetIndex,
              });
            }}
          />
        </div>

        {state.showMissingRecipeName ? (
          <section className={styles.nameRequiredMsg}>
            <p>Recipe name required</p>
          </section>
        ) : null}
        {loading ? (
          <section className={styles.loadingMsg}>
            <p>Creating recipe&hellip;</p>
            <LoadingSpinner size={"SMALL"} />
          </section>
        ) : null}
        {error ? (
          <section className={styles.errorMsg}>
            <p>Error creating recipe. Try again.</p>
          </section>
        ) : null}
        <button
          className={styles.createRecipeBtn}
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
      </form>
    </>
  );
};
CreateRecipeForm.propTypes = {
  createRecipeHandler: PropTypes.func.isRequired,
};

export default CreateRecipeForm;
export { CreateRecipeForm };
