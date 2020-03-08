import React, { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../../react-auth0-spa";
import { CreateRecipeForm } from "../CreateRecipeForm";
import { GET_ALL_RECIPES } from "../../queries";
import { CREATE_RECIPE } from "../../mutations";

import { buildRecipe } from "../../utils/recipe";

const AuthenticatedApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const { user } = useAuth0();

  const {
    loading: getAllRecipesLoading,
    data: getAllRecipesData,
    error: getAllRecipesError,
  } = useQuery(GET_ALL_RECIPES, {
    variables: {
      authorId: user.sub,
    },
  });
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
    const result = await createRecipe({
      variables: {
        authorId: user.sub,
        ...recipe,
      },
    });
    if (createRecipeData) {
      setIsCreatingRecipe(false);
    }
  };

  useEffect(() => {
    if (!getAllRecipesLoading && !getAllRecipesError) {
      getAllRecipesData && setRecipes(getAllRecipesData.getAllRecipes);
    }
  }, [getAllRecipesLoading, getAllRecipesData, getAllRecipesError]);

  if (getAllRecipesLoading) {
    return <div className="loading-profile">Loading profile...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <NavBar isCreatingRecipe={isCreatingRecipe} />
      </header>
      {isCreatingRecipe ? (
        <CreateRecipeForm
          createRecipeHandler={createRecipeHandler}
          error={createRecipeError}
          loading={createRecipeLoading}
        />
      ) : (
        <Profile
          user={user}
          setIsCreatingRecipe={() =>
            setIsCreatingRecipe(isCreatingRecipe => !isCreatingRecipe)
          }
          recipes={recipes}
        />
      )}
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
