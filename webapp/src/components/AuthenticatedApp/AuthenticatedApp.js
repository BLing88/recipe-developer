import React from "react";
import styles from "./AuthenticatedApp.module.css";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";
import { UserRecipesList } from "../UserRecipesList/UserRecipesList";
import { Recipe } from "../Recipe";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";

import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../../react-auth0-spa";
import { CreateRecipeForm } from "../CreateRecipeForm";
import { GET_ALL_RECIPES, GET_RECIPE } from "../../queries";
import { CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE } from "../../mutations";

import {
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
  buildRecipe,
} from "../../utils/recipe";

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

const USER_RECIPES_PATH = "/my-recipes";
const CREATE_RECIPE_PATH = "/create-recipe";
const PROFILE_PATH = "/my-profile";
const RECIPE_PATH = "/recipe/";

const AuthenticatedApp = () => {
  const { user } = useAuth0();
  const history = useHistory();
  const location = useLocation();
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
      ingredients: ingredients.filter(
        ingredient => getIngredientOf(ingredient) !== ""
      ),
      instructions: instructions.filter(
        instruction => getInstructionOf(instruction) !== ""
      ),
      notes: notes.filter(note => getNoteOf(note) !== ""),
    });
    const result = await createRecipe({
      variables: {
        authorId: user.sub,
        recipeInput: recipe,
      },
    });
    if (result.data) {
      refetchGetAllRecipes();
      history.push(USER_RECIPES_PATH);
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
    history.push(
      `${RECIPE_PATH}${nameOfRecipe(recipe)
        .split(" ")
        .join("-")}`
    );
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
      history.push(USER_RECIPES_PATH);
    }
  };

  return (
    <div className={styles.authenticatedApp}>
      <header className={styles.navbar}>
        <NavBar
          isCreatingRecipe={location.pathname === CREATE_RECIPE_PATH}
          isShowingAllRecipes={location.pathname === USER_RECIPES_PATH}
          isShowingProfile={location.pathname === PROFILE_PATH}
        />
      </header>

      <main className={styles.mainContent}>
        <Switch>
          <Route path={USER_RECIPES_PATH}>
            <UserRecipesList
              loading={getAllRecipesLoading}
              error={getAllRecipesError}
              recipes={getAllRecipesData && getAllRecipesData.getAllRecipes}
              getRecipe={recipeClickHandler}
            />
          </Route>

          <Route path={CREATE_RECIPE_PATH}>
            <CreateRecipeForm
              createRecipeHandler={createRecipeHandler}
              error={createRecipeError}
              loading={createRecipeLoading}
            />
          </Route>

          <Route path={PROFILE_PATH}>
            <Profile />
          </Route>

          <Route path={RECIPE_PATH}>
            <>
              {getRecipeLoading ? <div>Loading recipe...</div> : null}
              {getRecipeError ? (
                <div>Error loading recipe. Try again</div>
              ) : null}
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
          </Route>

          <Route>
            <UserRecipesList
              loading={getAllRecipesLoading}
              error={getAllRecipesError}
              recipes={getAllRecipesData && getAllRecipesData.getAllRecipes}
              getRecipe={recipeClickHandler}
            />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
