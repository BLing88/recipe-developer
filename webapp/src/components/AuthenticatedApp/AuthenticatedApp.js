import React, { useReducer } from "react";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";
import { UserRecipesList } from "../UserRecipesList/UserRecipesList";
import { Recipe } from "../Recipe";

import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../../react-auth0-spa";
import { CreateRecipeForm } from "../CreateRecipeForm";
import { GET_ALL_RECIPES, GET_RECIPE } from "../../queries";
import { CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE } from "../../mutations";

import {
  buildRecipe,
  nameOfRecipe,
  ingredientsOfRecipe,
  instructionsOfRecipe,
  notesOfRecipe,
  getIngredientOf,
  getInstructionOf,
  getNoteOf,
  authorOfRecipe,
  idOfRecipe,
  idOfIngredient,
  idOfInstruction,
  idOfNote,
} from "../../utils/recipe";

const SHOW_PROFILE = "SHOW_PROFILE";
const showProfile = "profile";
const SHOW_ALL_RECIPES = "SHOW_RECIPES";
const showAllRecipes = "allRecipes";
const SHOW_CREATE_RECIPE = "SHOW_CREATE_RECIPE";
const showCreateRecipe = "createRecipe";
const SHOW_RECIPE = "SHOW_RECIPE";
const showRecipe = "recipe";

const defaultAppState = {
  show: showAllRecipes,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case SHOW_PROFILE:
      return {
        ...state,
        show: showProfile,
      };
    case SHOW_ALL_RECIPES:
      return {
        ...state,
        show: showAllRecipes,
      };
    case SHOW_CREATE_RECIPE:
      return {
        ...state,
        show: showCreateRecipe,
      };
    case SHOW_RECIPE:
      return {
        ...state,
        show: showRecipe,
      };
    default:
      return {
        ...state,
      };
  }
};

export const arraysHaveSameElementsInOrder = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const projectRecipe = augmentedRecipe => {
  return {
    authorId: authorOfRecipe(augmentedRecipe),
    recipeId: idOfRecipe(augmentedRecipe),
    recipeName: nameOfRecipe(augmentedRecipe),
    ingredients: ingredientsOfRecipe(augmentedRecipe).map(ingredientObj => ({
      ingredient: getIngredientOf(ingredientObj),
      ingredientId: idOfIngredient(ingredientObj),
    })),
    instructions: instructionsOfRecipe(augmentedRecipe).map(instructionObj => ({
      instruction: getInstructionOf(instructionObj),
      instructionId: idOfInstruction(instructionObj),
    })),
    notes: notesOfRecipe(augmentedRecipe).map(noteObj => ({
      note: getNoteOf(noteObj),
      noteId: idOfNote(noteObj),
    })),
  };
};

const AuthenticatedApp = () => {
  const [state, dispatch] = useReducer(appReducer, defaultAppState);
  const { user } = useAuth0();
  const {
    loading: getAllRecipesLoading,
    data: getAllRecipesData,
    error: getAllRecipesError,
    refetch: refetchGetAllRecipes,
  } = useQuery(GET_ALL_RECIPES, {
    variables: {
      authorId: user.sub,
    },
  });

  const [
    getRecipe,
    {
      loading: getRecipeLoading,
      data: getRecipeData,
      error: getRecipeError,
      refetch: refetchRecipe,
    },
  ] = useLazyQuery(GET_RECIPE);

  const [
    createRecipe,
    {
      // data: createRecipeData,
      loading: createRecipeLoading,
      error: createRecipeError,
    },
  ] = useMutation(CREATE_RECIPE);

  const [
    updateRecipe,
    { loading: updateRecipeLoading, error: updateRecipeError },
  ] = useMutation(UPDATE_RECIPE);

  const [
    deleteRecipe,
    { loading: deleteRecipeLoading, error: deleteRecipeError },
  ] = useMutation(DELETE_RECIPE);

  const createRecipeHandler = async recipeData => {
    const { recipeName, ingredients, instructions, notes } = recipeData;
    const recipe = buildRecipe({
      authorId: user.sub,
      recipeName,
      ingredients: ingredients.filter(ingredient => ingredient !== ""),
      instructions: instructions.filter(instruction => instruction !== ""),
      notes: notes.filter(note => note !== ""),
    });
    const result = await createRecipe({
      variables: {
        authorId: user.sub,
        recipeInput: recipe,
      },
    });
    if (result.data) {
      dispatch({ type: SHOW_ALL_RECIPES });
      refetchGetAllRecipes();
    }
  };

  const recipeClickHandler = (e, recipe) => {
    e.preventDefault();
    getRecipe({
      variables: {
        authorId: user.sub,
        recipeId: recipe.recipeId,
      },
    });
    dispatch({ type: SHOW_RECIPE });
  };

  const updateRecipeHandler = async (recipe, newRecipe) => {
    const oldRecipeName = nameOfRecipe(recipe);
    const newRecipeName = nameOfRecipe(newRecipe);
    const oldIngredients = ingredientsOfRecipe(recipe);
    const newIngredients = ingredientsOfRecipe(newRecipe);
    const oldInstructions = instructionsOfRecipe(recipe);
    const newInstructions = instructionsOfRecipe(newRecipe);
    const oldNotes = notesOfRecipe(recipe);
    const newNotes = notesOfRecipe(newRecipe);

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

    const updatedRecipe = {
      authorId: authorOfRecipe(recipe),
      recipeId: idOfRecipe(recipe),
      recipeName,
      ingredients,
      instructions,
      notes,
    };
    const updateResult = await updateRecipe({ variables: updatedRecipe });

    if (updateResult.data) {
      refetchRecipe({
        variables: {
          authorId: authorOfRecipe(recipe),
          recipeId: idOfRecipe(recipe),
        },
      });
    }
  };

  const deleteRecipeHandler = async recipe => {
    const deleteRes = await deleteRecipe({
      variables: {
        authorId: authorOfRecipe(recipe),
        recipeId: idOfRecipe(recipe),
      },
    });
    if (deleteRes.data.deleteRecipe) {
      refetchGetAllRecipes();
      dispatch({ type: SHOW_ALL_RECIPES });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <NavBar
          isCreatingRecipe={state.show === showCreateRecipe}
          showCreatingRecipe={() => dispatch({ type: SHOW_CREATE_RECIPE })}
          isShowingProfile={state.show === showProfile}
          setShowingProfile={() => dispatch({ type: SHOW_PROFILE })}
          setShowingRecipe={state.show === showRecipe}
          isShowingAllRecipes={state.show === showAllRecipes}
          setShowingAllRecipes={() => dispatch({ type: SHOW_ALL_RECIPES })}
        />
      </header>
      <main>
        {state.show === showAllRecipes ? (
          <UserRecipesList
            loading={getAllRecipesLoading}
            error={getAllRecipesError}
            recipes={getAllRecipesData && getAllRecipesData.getAllRecipes}
            getRecipe={recipeClickHandler}
          />
        ) : null}
        {state.show === showCreateRecipe ? (
          <CreateRecipeForm
            createRecipeHandler={createRecipeHandler}
            error={createRecipeError}
            loading={createRecipeLoading}
          />
        ) : null}

        {state.show === showProfile ? <Profile /> : null}

        {state.show === showRecipe ? (
          <>
            {getRecipeLoading ? <div>Loading recipe...</div> : null}
            {getRecipeError ? <div>Error loading recipe. Try again</div> : null}
            {!getRecipeLoading && getRecipeData ? (
              <Recipe
                recipe={projectRecipe(getRecipeData.getRecipe)}
                updateHandler={updateRecipeHandler}
                updateRecipeError={updateRecipeError}
                updateRecipeLoading={updateRecipeLoading}
                deleteHandler={deleteRecipeHandler}
                deleteRecipeError={deleteRecipeError}
                deleteRecipeLoading={deleteRecipeLoading}
              />
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
