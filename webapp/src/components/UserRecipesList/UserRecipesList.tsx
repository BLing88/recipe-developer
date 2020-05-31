import React from "react";
import styles from "./UserRecipesList.module.css";
import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";

const UserRecipesList = ({
  recipes,
  getRecipe,
}: {
  recipes: Recipes.RecipeListItem[];
  getRecipe: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    recipe: Recipes.RecipeListItem
  ) => void;
}) => {
  return (
    <article className={styles.userRecipesList}>
      <h1 className={styles.title}>My Recipes</h1>

      {recipes && recipes.length ? (
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
      )}
    </article>
  );
};

export { UserRecipesList };
