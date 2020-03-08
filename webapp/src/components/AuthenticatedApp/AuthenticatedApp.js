import React, { useState } from "react";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";

import { useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../../react-auth0-spa";
import { CreateRecipeForm } from "../CreateRecipeForm";
// import { GET_ALL_RECIPES } from "../../queries";
import { CREATE_RECIPE } from "../../mutations";

import { buildRecipe } from "../../utils/recipe";

const AuthenticatedApp = () => {
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [isShowingProfile, setIsShowingProfile] = useState(true);
  const { user } = useAuth0();

  const [
    createRecipe,
    {
      data: createRecipeData,
      loading: createRecipeLoading,
      error: createRecipeError,
    },
  ] = useMutation(CREATE_RECIPE);

  const createRecipeHandler = async recipeData => {
    const { recipeName, ingredients, instructions, notes } = recipeData;
    const recipe = buildRecipe({
      authorId: user.sub,
      recipeName,
      ingredients: ingredients.filter(ingredient => ingredient !== ""),
      instructions: instructions.filter(instruction => instruction !== ""),
      notes: notes.filter(note => note !== ""),
    });
    await createRecipe({
      variables: {
        authorId: user.sub,
        recipeInput: recipe,
      },
    });
    if (createRecipeData) {
      setIsCreatingRecipe(false);
    }
  };

  const creatingRecipe = () =>
    setIsCreatingRecipe(isCreatingRecipe => !isCreatingRecipe);
  const showingProfile = () =>
    setIsShowingProfile(isShowingProfile => !isShowingProfile);

  return (
    <div className="app">
      <header className="app-header">
        <NavBar
          isCreatingRecipe={isCreatingRecipe}
          setIsCreatingRecipe={creatingRecipe}
          isShowingProfile={isShowingProfile}
          setIsShowingProfile={showingProfile}
        />
      </header>
      <main>
        {isCreatingRecipe ? (
          <CreateRecipeForm
            createRecipeHandler={createRecipeHandler}
            error={createRecipeError}
            loading={createRecipeLoading}
          />
        ) : (
          <Profile />
        )}
      </main>
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
