import React, { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuth0 } from "../../react-auth0-spa";
import { CreateRecipeForm } from "../CreateRecipeForm";

import { buildRecipe } from "../../utils/recipe";

const AuthenticatedApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const { user } = useAuth0();

  const GET_USER_RECIPES = gql`
    query getAllRecipes($authorId: ID!) {
      getAllRecipes(authorId: $authorId) {
        recipeName
        recipeId
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_USER_RECIPES, {
    variables: {
      authorId: user.id,
    },
  });

  const createRecipeHandler = recipeData => {
    const recipe = buildRecipe({
      ...recipeData,
      author: user.id,
    });
    setIsCreatingRecipe(false);
  };

  useEffect(() => {
    if (!loading && !error) {
      data && setRecipes(data.getAllRecipes);
    }
  }, [loading, data, error]);

  if (loading) {
    return <div className="loading-profile">Loading profile...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <NavBar />
      </header>
      {isCreatingRecipe ? (
        <CreateRecipeForm createRecipeHandler={createRecipeHandler} />
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