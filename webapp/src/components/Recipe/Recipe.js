import React, { useReducer } from "react";
import PropTypes from "prop-types";
import styles from "./Recipe.module.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { Notes } from "../Notes";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  nameOfRecipe,
  buildIngredient,
  buildInstruction,
  getIngredientOf,
  idOfIngredient,
  getInstructionOf,
  instructionsOfRecipe,
  idOfInstruction,
  getNoteOf,
  idOfNote,
  buildNote,
  authorOfRecipe,
  idOfRecipe,
  ingredientsOfRecipe,
  notesOfRecipe,
} from "../../utils/recipe";
import { InputForm } from "../InputForm";

const EDITING_NAME = "EDITING_NAME";
const UPDATE_RECIPE_NAME_INPUT = "UPDATE_RECIPE_NAME_INPUT";
const SHOW_MISSING_RECIPE_NAME = "SHOW_MISSING_RECIPE_NAME";

const EDITING_INGREDIENTS = "EDITING_INGREDIENTS";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";

const EDITING_INSTRUCTIONS = "EDITING_INSTRUCTIONS";
const UPDATE_INSTRUCTIONS_INPUT = "UPDATE_INSTRUCTIONS_INPUT";
const ADD_INSTRUCTION = "ADD_INSTRUCTION";
const DELETE_INSTRUCTION = "DELETE_INSTRUCTION";

const EDITING_NOTES = "EDITING_NOTES";
const UPDATE_NOTES_INPUT = "UPDATE_NOTES_INPUT";
const ADD_NOTE = "ADD_NOTE";
const DELETE_NOTE = "DELETE_NOTE";

const SHOW_EMPTY_INPUTS_MESSAGE = "SHOW_EMPTY_INPUTS_MESSAGE";
const HIDE_EMPTY_INPUTS_MESSAGE = "HIDE_EMPTY_INPUTS_MESSAGE";
const haveEmptyInputs = (a, b, c) => {
  return (
    a.filter(a => a !== "").length === 0 &&
    b.filter(b => b !== "").length === 0 &&
    c.filter(c => c !== "").length === 0
  );
};
const initialState = recipe => {
  return {
    editName: false,
    recipeName: nameOfRecipe(recipe),
    editIngredients: false,
    ingredients: [...ingredientsOfRecipe(recipe)],
    editInstructions: false,
    instructions: [...instructionsOfRecipe(recipe)],
    editNotes: false,
    notes: [...notesOfRecipe(recipe)],
    missingRecipeName: false,
    showEmptyInputsMessage: false,
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
    case EDITING_NOTES:
      return {
        ...state,
        editNotes: true,
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
    case SHOW_MISSING_RECIPE_NAME:
      return {
        ...state,
        missingRecipeName: true,
      };
    case SHOW_EMPTY_INPUTS_MESSAGE:
      return {
        ...state,
        showEmptyInputsMessage: true,
      };
    case HIDE_EMPTY_INPUTS_MESSAGE:
      return {
        ...state,
        showEmptyInputsMessage: false,
      };
    default:
      return {
        ...state,
      };
  }
};

const Recipe = ({
  recipe,
  updateHandler,
  updateRecipeError,
  updateRecipeLoading,
  deleteHandler,
  deleteRecipeError,
  deleteRecipeLoading,
}) => {
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

  const submitHandler = async e => {
    e.preventDefault();
    if (!state.recipeName) {
      dispatch({ type: SHOW_MISSING_RECIPE_NAME });
      if (
        haveEmptyInputs(
          state.ingredients.map(getIngredientOf),
          state.instructions.map(getInstructionOf),
          state.notes.map(getNoteOf)
        )
      ) {
        dispatch({ type: SHOW_EMPTY_INPUTS_MESSAGE });
      } else {
        dispatch({ type: HIDE_EMPTY_INPUTS_MESSAGE });
      }
    } else {
      const updatedRecipe = {
        authorId: authorOfRecipe(recipe),
        recipeId: idOfRecipe(recipe),
        recipeName: state.recipeName,
        ingredients: state.ingredients.filter(
          ingredient => getIngredientOf(ingredient) !== ""
        ),
        instructions: state.instructions.filter(
          instruction => getInstructionOf(instruction) !== ""
        ),
        notes: state.notes.filter(note => getNoteOf(note) !== ""),
      };
      updateHandler(recipe, updatedRecipe);
    }
  };

  return (
    <article className={styles.recipe}>
      {!state.editName ? (
        <h1
          onClick={() => dispatch({ type: EDITING_NAME })}
          className={styles.recipeName}
        >
          {recipeName}
        </h1>
      ) : (
        <>
          <label htmlFor="recipe-name">Recipe name:</label>
          <input
            className={styles.recipeNameInput}
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
      )}

      {!state.editNotes ? (
        <Notes
          onClick={() => dispatch({ type: EDITING_NOTES })}
          notes={notes}
        />
      ) : (
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
      )}

      {state.missingRecipeName ? (
        <section className={styles.nameRequiredMsg}>
          <p>Recipe name required</p>
        </section>
      ) : null}
      {state.showEmptyInputsMessage ? (
        <section className={styles.emptyRecipeMsg}>
          <p>Recipe cannot be empty</p>
        </section>
      ) : null}
      {updateRecipeError ? (
        <section className={styles.errorMsg}>
          <p>Error updating recipe. Try again.</p>
        </section>
      ) : null}
      {updateRecipeLoading ? (
        <section className={styles.updatingRecipeMsg}>
          <p>Updating recipe&hellip;</p>
          <LoadingSpinner size="SMALL" />
        </section>
      ) : null}

      {deleteRecipeError ? (
        <section className={styles.errorMsg}>
          <p>Error deleting recipe. Try again.</p>
        </section>
      ) : null}
      {deleteRecipeLoading ? (
        <section className={styles.deletingRecipeMsg}>
          <p>Deleting recipe&hellip;</p>
          <LoadingSpinner size="SMALL" />
        </section>
      ) : null}

      {state.editNotes ||
      state.editIngredients ||
      state.editInstructions ||
      state.editName ? (
        <button className={styles.updateRecipeBtn} onClick={submitHandler}>
          Update recipe
        </button>
      ) : null}

      <button
        onClick={e => {
          e.preventDefault();
          const confirmDelete = window.prompt(
            `Enter "Delete ${nameOfRecipe(recipe)}"`
          );
          if (confirmDelete === `Delete ${nameOfRecipe(recipe)}`) {
            deleteHandler(recipe);
          }
        }}
        className={styles.deleteRecipeBtn}
      >
        Delete recipe
      </button>
    </article>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  updateHandler: PropTypes.func.isRequired,
  updateRecipeError: PropTypes.object,
  updateRecipeLoading: PropTypes.bool.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  deleteRecipeError: PropTypes.object,
  deleteRecipeLoading: PropTypes.bool.isRequired,
};

export { Recipe };
