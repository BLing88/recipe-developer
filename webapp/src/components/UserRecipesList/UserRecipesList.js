import React from "react";
import PropTypes from "prop-types";
import styles from "./UserRecipesList.module.css";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

const UserRecipesList = ({ loading, error, recipes, getRecipe }) => {
  return (
    <article className={styles.userRecipesList}>
      <h2 className={styles.title}>My Recipes</h2>

      {loading ? (
        <div className={styles.loadingRecipes}>Loading recipes...</div>
      ) : null}

      {error ? <div>Error loading recipes. Try again.</div> : null}

      {!loading &&
        !error &&
        (recipes && recipes.length ? (
          <ul className={styles.recipeList}>
            {recipes.map(recipe => (
              <li
                className={styles.recipeName}
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
          <div className={styles.noRecipesMessage}>You have no recipes</div>
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
