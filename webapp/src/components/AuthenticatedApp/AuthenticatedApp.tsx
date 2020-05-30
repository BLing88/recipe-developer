import React from "react";
import styles from "./AuthenticatedApp.module.css";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";
import { UserRecipesList } from "../UserRecipesList/UserRecipesList";
import { Recipe } from "../Recipe";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";
import { LoadingSpinner } from "../LoadingSpinner";

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

interface ApolloResponseRecipe extends Recipes.Recipe {
  __typename: string;
}

const projectRecipe = (
  augmentedRecipe: ApolloResponseRecipe
): Recipes.Recipe => {
  return {
    authorId: authorOfRecipe(augmentedRecipe),
    recipeId: idOfRecipe(augmentedRecipe),
    recipeName: nameOfRecipe(augmentedRecipe),
    ingredients: ingredientsOfRecipe(augmentedRecipe).map((ingredientObj) => ({
      ingredient: getIngredientOf(ingredientObj),
      ingredientId: idOfIngredient(ingredientObj),
    })),
    instructions: instructionsOfRecipe(augmentedRecipe).map(
      (instructionObj) => ({
        instruction: getInstructionOf(instructionObj),
        instructionId: idOfInstruction(instructionObj),
      })
    ),
    notes: notesOfRecipe(augmentedRecipe).map((noteObj) => ({
      note: getNoteOf(noteObj),
      noteId: idOfNote(noteObj),
    })),
  };
};

const USER_RECIPES_PATH = "/my-recipes";
const CREATE_RECIPE_PATH = "/create-recipe";
const PROFILE_PATH = "/my-profile";
const RECIPE_PATH = "/recipe/";

interface RecipeData {
  recipeName: string;
  ingredients: Recipes.Ingredient[];
  instructions: Recipes.Instruction[];
  notes: Recipes.Note[];
}

const AuthenticatedApp = () => {
  const { user } = useAuth0()!;
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

  const createRecipeHandler = async (recipeData: RecipeData) => {
    const { recipeName, ingredients, instructions, notes } = recipeData;

    const recipe = buildRecipe({
      authorId: user.sub,
      recipeName,
      ingredients: ingredients.filter(
        (ingredient) => getIngredientOf(ingredient) !== ""
      ),
      instructions: instructions.filter(
        (instruction) => getInstructionOf(instruction) !== ""
      ),
      notes: notes.filter((note) => getNoteOf(note) !== ""),
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

  const recipeClickHandler: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    recipe: Recipes.RecipeListItem
  ) => void = (e, recipe) => {
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

  const updateRecipeHandler = async (
    recipe: Recipes.Recipe,
    newRecipe: Recipes.UpdatedRecipe
  ) => {
    try {
      await updateRecipe({ variables: newRecipe });
      refetchRecipe({
        variables: {
          authorId: authorOfRecipe(recipe),
          recipeId: idOfRecipe(recipe),
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRecipeHandler = async (recipe: Recipes.Recipe) => {
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
            <Profile
              recipeCount={
                getAllRecipesData && getAllRecipesData.getAllRecipes.length
              }
            />
          </Route>

          <Route
            path={RECIPE_PATH} // leave path=Recipe_path then fetch in recipe component
            // path={
            //   getRecipeData
            //     ? `${RECIPE_PATH}${
            //         projectRecipe(getRecipeData.getRecipe).recipeName
            //       }`
            //     : RECIPE_PATH
            // }
          >
            <>
              {getRecipeLoading ? (
                <section className={styles.loadingRecipe}>
                  <p>Loading recipe&hellip;</p>
                  <LoadingSpinner size="SMALL" />
                </section>
              ) : null}

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

          <Route path="/" exact>
            <UserRecipesList
              loading={getAllRecipesLoading}
              error={getAllRecipesError}
              recipes={getAllRecipesData && getAllRecipesData.getAllRecipes}
              getRecipe={recipeClickHandler}
            />
          </Route>

          <Route>
            <main className={styles.notFoundPage}>
              <p className={styles.pageNotFoundMsg}>Page not found&hellip;</p>
            </main>
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
