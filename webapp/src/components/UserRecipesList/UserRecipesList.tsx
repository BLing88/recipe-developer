import React from "react";
import styles from "./UserRecipesList.module.css";
import { LoadingSpinner } from "../LoadingSpinner";

import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

interface RecipeListItem {
  recipeName: string;
  recipeId: string;
}

const UserRecipesList = ({
  loading,
  error,
  recipes,
  getRecipe,
}: {
  loading: boolean;
  error: any;
  recipes: RecipeListItem[];
  getRecipe: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    recipe: RecipeListItem
  ) => void;
}) => {
  return (
    <article className={styles.userRecipesList}>
      <h1 className={styles.title}>My Recipes</h1>

      {loading ? (
        <section className={styles.loadingRecipes}>
          <p>Loading recipes&hellip; </p> <LoadingSpinner size="SMALL" />
        </section>
      ) : null}

      {error ? (
        <section className={styles.errorMsg}>
          <p>Error loading recipes. Try again.</p>
        </section>
      ) : null}

      {!loading &&
        !error &&
        (recipes && recipes.length ? (
          <ul className={styles.recipeList}>
            {recipes.map((recipe) => (
              <li
                className={styles.recipeName}
                onClick={(e) => {
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

export { UserRecipesList };
