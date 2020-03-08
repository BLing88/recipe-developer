import React from "react";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";
import { GET_ALL_RECIPES } from "../../queries";
import { useQuery } from "@apollo/react-hooks";
import { useAuth0 } from "../../react-auth0-spa";

const UserRecipesList = () => {
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

  const recipes = getAllRecipesData && getAllRecipesData.getAllRecipes;

  return (
    <article>
      <h2>My Recipes</h2>

      {getAllRecipesLoading ? (
        <div className="loading-recipes">Loading recipes...</div>
      ) : null}

      {getAllRecipesError ? <div>Error loading recipes. Try again.</div> : null}

      {!getAllRecipesLoading &&
        !getAllRecipesError &&
        (recipes && recipes.length ? (
          <ul className="recipe-list">
            {recipes.map(recipe => (
              <li key={idOfRecipe(recipe)}>{nameOfRecipe(recipe)}</li>
            ))}
          </ul>
        ) : (
          <div className="no-recipes-message">You have no recipes</div>
        ))}
    </article>
  );
};

export { UserRecipesList };
