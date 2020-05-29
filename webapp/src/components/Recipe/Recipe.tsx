import React, { useReducer } from "react";
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
import { arraysHaveSameElementsInOrder } from "../../utils/arraysHaveSameElementsInOrder";
import { InputForm } from "../InputForm";
import { ApolloError } from "apollo-boost";

const EDITING_NAME = "EDITING_NAME";
const CANCEL_EDITING_NAME = "CANCEL_EDITING_NAME";
const UPDATE_RECIPE_NAME_INPUT = "UPDATE_RECIPE_NAME_INPUT";
const SHOW_MISSING_RECIPE_NAME = "SHOW_MISSING_RECIPE_NAME";

const EDITING_INGREDIENTS = "EDITING_INGREDIENTS";
const CANCEL_EDITING_INGREDIENTS = "CANCEL_EDITING_INGREDIENTS";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";

const EDITING_INSTRUCTIONS = "EDITING_INSTRUCTIONS";
const CANCEL_EDITING_INSTRUCTIONS = "CANCEL_EDITING_INSTRUCTIONS";
const UPDATE_INSTRUCTIONS_INPUT = "UPDATE_INSTRUCTIONS_INPUT";
const ADD_INSTRUCTION = "ADD_INSTRUCTION";
const DELETE_INSTRUCTION = "DELETE_INSTRUCTION";

const EDITING_NOTES = "EDITING_NOTES";
const CANCEL_EDITING_NOTES = "CANCEL_EDITING_NOTES";
const UPDATE_NOTES_INPUT = "UPDATE_NOTES_INPUT";
const ADD_NOTE = "ADD_NOTE";
const DELETE_NOTE = "DELETE_NOTE";

const SHOW_NO_NEW_UPDATES_MESSAGE = "SHOW_NO_NEW_UPDATES_MESSAGE";

const SHOW_EMPTY_INPUTS_MESSAGE = "SHOW_EMPTY_INPUTS_MESSAGE";
const HIDE_EMPTY_INPUTS_MESSAGE = "HIDE_EMPTY_INPUTS_MESSAGE";
const haveEmptyInputs = (a: string[], b: string[], c: string[]) => {
  return (
    a.filter((a) => a !== "").length === 0 &&
    b.filter((b) => b !== "").length === 0 &&
    c.filter((c) => c !== "").length === 0
  );
};

interface DisplayRecipe {
  recipeName: string;
  ingredients: Recipes.Ingredient[];
  instructions: Recipes.Instruction[];
  notes: Recipes.Note[];
  editName: boolean;
  editIngredients: boolean;
  editInstructions: boolean;
  editNotes: boolean;
  showEmptyInputsMessage: boolean;
  showNoNewUpdatesMessage: boolean;
  missingRecipeName: boolean;
}

const initialState = (recipe: Recipes.Recipe): DisplayRecipe => {
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
    showNoNewUpdatesMessage: false,
  };
};

interface RecipeReducerAction {
  type: string;
  recipeName?: string;
  ingredient?: Recipes.Ingredient;
  ingredients?: Recipes.Ingredient[];
  instruction?: Recipes.Instruction;
  instructions?: Recipes.Instruction[];
  note?: Recipes.Note;
  notes?: Recipes.Note[];
  ingredientNumber?: number;
  instructionNumber?: number;
  noteNumber?: number;
  targetIngredient?: number;
  targetInstruction?: number;
  targetNote?: number;
}

const recipeReducer = (
  state: DisplayRecipe,
  action: RecipeReducerAction
): DisplayRecipe => {
  switch (action.type) {
    case EDITING_NAME:
      return {
        ...state,
        editName: true,
      };
    case CANCEL_EDITING_NAME:
      return {
        ...state,
        editName: false,
        recipeName: action.recipeName!,
        showNoNewUpdatesMessage:
          state.showNoNewUpdatesMessage &&
          (state.editInstructions || state.editNotes || state.editIngredients),
      };
    case UPDATE_RECIPE_NAME_INPUT:
      return {
        ...state,
        recipeName: action.recipeName!,
      };
    case EDITING_INGREDIENTS:
      return {
        ...state,
        editIngredients: true,
      };
    case CANCEL_EDITING_INGREDIENTS:
      return {
        ...state,
        ingredients: action.ingredients!,
        editIngredients: false,
        showNoNewUpdatesMessage:
          state.showNoNewUpdatesMessage &&
          (state.editInstructions || state.editNotes || state.editName),
      };
    case UPDATE_INGREDIENTS_INPUT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, action.ingredientNumber),
          action.ingredient!,
          ...state.ingredients.slice(action.ingredientNumber! + 1),
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
                ...state.ingredients.slice(action.targetIngredient! + 1),
              ],
      };
    case EDITING_INSTRUCTIONS:
      return {
        ...state,
        editInstructions: true,
      };
    case CANCEL_EDITING_INSTRUCTIONS:
      return {
        ...state,
        editInstructions: false,
        instructions: action.instructions!,
        showNoNewUpdatesMessage:
          state.showNoNewUpdatesMessage &&
          (state.editIngredients || state.editNotes || state.editName),
      };
    case UPDATE_INSTRUCTIONS_INPUT:
      return {
        ...state,
        instructions: [
          ...state.instructions.slice(0, action.instructionNumber),
          action.instruction!,
          ...state.instructions.slice(action.instructionNumber! + 1),
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
                ...state.instructions.slice(action.targetInstruction! + 1),
              ],
      };
    case EDITING_NOTES:
      return {
        ...state,
        editNotes: true,
      };
    case CANCEL_EDITING_NOTES:
      return {
        ...state,
        editNotes: false,
        notes: action.notes!,
        showNoNewUpdatesMessage:
          state.showNoNewUpdatesMessage &&
          (state.editInstructions || state.editName || state.editIngredients),
      };
    case UPDATE_NOTES_INPUT:
      return {
        ...state,
        notes: [
          ...state.notes.slice(0, action.noteNumber),
          action.note!,
          ...state.notes.slice(action.noteNumber! + 1),
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
                ...state.notes.slice(action.targetNote! + 1),
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
    case SHOW_NO_NEW_UPDATES_MESSAGE:
      return {
        ...state,
        showNoNewUpdatesMessage: true,
      };
    default:
      return {
        ...state,
      };
  }
};

interface UpdatedRecipe {
  authorId: string;
  recipeId: string;
  recipeName: string | null;
  ingredients: Recipes.Ingredient[] | null;
  instructions: Recipes.Instruction[] | null;
  notes: Recipes.Note[] | null;
}

interface RecipeProps {
  recipe: Recipes.Recipe;
  updateHandler: (recipe: Recipes.Recipe, newRecipe: UpdatedRecipe) => void;
  updateRecipeError: ApolloError | undefined;
  updateRecipeLoading: boolean;
  deleteHandler: (recipe: Recipes.Recipe) => void;
  deleteRecipeError: ApolloError | undefined;
  deleteRecipeLoading: boolean;
}

const Recipe = ({
  recipe,
  updateHandler,
  updateRecipeError,
  updateRecipeLoading,
  deleteHandler,
  deleteRecipeError,
  deleteRecipeLoading,
}: RecipeProps) => {
  const { recipeName, ingredients, instructions, notes } = recipe;
  const [state, dispatch] = useReducer(recipeReducer, recipe, initialState);

  const ingredientInputChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    ingredient: Recipes.Ingredient,
    index: number
  ) => {
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

  const instructionInputChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    instruction: Recipes.Instruction,
    index: number
  ) => {
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

  const noteInputChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    note: Recipes.Note,
    index: number
  ) => {
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

  const submitHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
      const oldRecipeName = nameOfRecipe(recipe);
      const newRecipeName = state.recipeName;
      const oldIngredients = ingredientsOfRecipe(recipe);
      const newIngredients = state.ingredients.filter(
        (ingredient) => getIngredientOf(ingredient) !== ""
      );
      const oldInstructions = instructionsOfRecipe(recipe);
      const newInstructions = state.instructions.filter(
        (instruction) => getInstructionOf(instruction) !== ""
      );
      const oldNotes = notesOfRecipe(recipe);
      const newNotes = state.notes.filter((note) => getNoteOf(note) !== "");

      const recipeName = newRecipeName !== oldRecipeName ? newRecipeName : null;
      const ingredients = !arraysHaveSameElementsInOrder(
        oldIngredients.map(getIngredientOf),
        newIngredients.map(getIngredientOf)
      )
        ? newIngredients
        : null;
      const instructions = !arraysHaveSameElementsInOrder(
        oldInstructions.map(getInstructionOf),
        newInstructions.map(getInstructionOf)
      )
        ? newInstructions
        : null;
      const notes = !arraysHaveSameElementsInOrder(
        oldNotes.map(getNoteOf),
        newNotes.map(getNoteOf)
      )
        ? newNotes
        : null;

      if (
        ingredients === null &&
        instructions === null &&
        notes === null &&
        recipeName === null
      ) {
        dispatch({ type: SHOW_NO_NEW_UPDATES_MESSAGE });
      } else {
        const updatedRecipe: UpdatedRecipe = {
          authorId: authorOfRecipe(recipe),
          recipeId: idOfRecipe(recipe),
          recipeName,
          ingredients,
          instructions,
          notes,
        };
        updateHandler(recipe, updatedRecipe);
      }
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
        <div className={styles.recipeNameHeader}>
          <label className={styles.recipeNameLabel} htmlFor="recipe-name">
            Recipe name:
          </label>
          <input
            className={styles.recipeNameInput}
            id="recipe-name"
            type="text"
            value={state.recipeName}
            onChange={(e) => {
              e.preventDefault();
              dispatch({
                type: UPDATE_RECIPE_NAME_INPUT,
                recipeName: e.target.value,
              });
            }}
            required
          />
          <button
            className={styles.cancelEditNameBtn}
            onClick={(e) => {
              e.preventDefault();
              dispatch({
                type: CANCEL_EDITING_NAME,
                recipeName: nameOfRecipe(recipe),
              });
            }}
          >
            Cancel edit
          </button>
        </div>
      )}
      {/* <picture className="recipe-image">
        <img src={require("../../assets/gimbap-mobile.png")} alt="gimbap" />
      </picture> */}
      {/* abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz */}
      <div className={styles.ingredients}>
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
            addObjectHandler={(e) => {
              e.preventDefault();
              dispatch({ type: ADD_INGREDIENT });
            }}
            deleteObjectHandler={(targetIndex) => {
              dispatch({
                type: DELETE_INGREDIENT,
                targetIngredient: targetIndex,
              });
            }}
            showCancelBtn={true}
            cancelHandler={(e) => {
              e.preventDefault();
              dispatch({
                type: CANCEL_EDITING_INGREDIENTS,
                ingredients: ingredientsOfRecipe(recipe),
              });
            }}
          />
        )}
      </div>

      <div className={styles.instructions}>
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
            addObjectHandler={(e) => {
              e.preventDefault();
              dispatch({ type: ADD_INSTRUCTION });
            }}
            deleteObjectHandler={(targetIndex) => {
              dispatch({
                type: DELETE_INSTRUCTION,
                targetInstruction: targetIndex,
              });
            }}
            showCancelBtn={true}
            cancelHandler={(e) => {
              e.preventDefault();
              dispatch({
                type: CANCEL_EDITING_INSTRUCTIONS,
                instructions: instructionsOfRecipe(recipe),
              });
            }}
          />
        )}
      </div>

      <div className={styles.notes}>
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
            addObjectHandler={(e) => {
              e.preventDefault();
              dispatch({ type: ADD_NOTE });
            }}
            deleteObjectHandler={(targetIndex) => {
              dispatch({
                type: DELETE_NOTE,
                targetNote: targetIndex,
              });
            }}
            showCancelBtn={true}
            cancelHandler={(e) => {
              e.preventDefault();
              dispatch({
                type: CANCEL_EDITING_NOTES,
                notes: notesOfRecipe(recipe),
              });
            }}
          />
        )}
      </div>

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

      {state.showNoNewUpdatesMessage ? (
        <section className={styles.noUpdatesMsg}>
          <p>Nothing to update</p>
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
        onClick={(e) => {
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

export { Recipe };
