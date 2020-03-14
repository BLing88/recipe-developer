import React from "react";
import PropTypes from "prop-types";
import styles from "./UserRecipesList.module.css";
import { LoadingSpinner } from "../LoadingSpinner";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

const UserRecipesList = ({ loading, error, recipes, getRecipe }) => {
  return (
    <article className={styles.userRecipesList}>
      <h1 className={styles.title}>My Recipes</h1>

      {loading ? (
        <section className={styles.loadingRecipes}>
          <p>Loading recipes...</p> <LoadingSpinner size="SMALL" />
        </section>
      ) : null}

      {error ? (
        <section className={styles.errorMsg}>
          <p>Error loading recipes. Try again.</p>
        </section>
      ) : null}
      <section className={styles.noRecipesMsg}>
        <p>You have no recipes!</p>
      </section>
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
          <section className={styles.noRecipesMsg}>
            <p>You have no recipes</p>
          </section>
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
