import React from "react";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

const UserRecipesList = ({ loading, error, recipes }) => {
  return (
    <article>
      <h2>My Recipes</h2>

      {loading ? (
        <div className="loading-recipes">Loading recipes...</div>
      ) : null}

      {error ? <div>Error loading recipes. Try again.</div> : null}

      {!loading &&
        !error &&
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
