import React from "react";
import PropTypes from "prop-types";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

const UserRecipesList = ({ loading, error, recipes, getRecipe }) => {
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
              <li
                onClick={e => {
                  getRecipe(e, recipe);
                }}
                key={idOfRecipe(recipe)}
              >
                {nameOfRecipe(recipe)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-recipes-message">You have no recipes</div>
        ))}
    </article>
  );
};
UserRecipesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  recipes: PropTypes.arrayOf(PropTypes.object),
  getRecipe: PropTypes.func.isRequired,
};

export { UserRecipesList };
