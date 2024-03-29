import React, { useState } from "react";
import styles from "./UserRecipesList.module.css";
import { idOfRecipe, nameOfRecipe } from "../../utils/recipe";
import {
  sortRecipesByLastModified,
  sortRecipeByName,
  sortByCreatedOn,
} from "../../utils/sortRecipes";

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" d="M0 0H24V24H0z" />
    <path d="M20 4v12h3l-4 5-4-5h3V4h2zm-8 14v2H3v-2h9zm2-7v2H3v-2h11zm0-7v2H3V4h11z" />
  </svg>
);

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
  const [sortFn, setSortFn] = useState(() => sortRecipesByLastModified);
  const [showDropdown, setShowDropdown] = useState(false);
  const sortByClickHandler = () => {
    setShowDropdown((showDropdown) => !showDropdown);
  };

  return (
    <article className={styles.userRecipesList}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Recipes</h1>
        <div className={styles.dropdownContainer}>
          <button
            className={styles.sortByBtn}
            onClick={(e) => {
              e.preventDefault();
              sortByClickHandler();
            }}
          >
            <SortIcon />
            Sort by
          </button>
          {showDropdown ? (
            <ul className={styles.dropdown}>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  setSortFn(() => sortRecipesByLastModified);
                  setShowDropdown((showDropdown) => !showDropdown);
                }}
              >
                {sortFn === sortRecipesByLastModified ? (
                  <span className={styles.sortByDot}>&#9679;</span>
                ) : null}{" "}
                last modified
              </li>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  setSortFn(() => sortByCreatedOn);
                  setShowDropdown((showDropdown) => !showDropdown);
                }}
              >
                {sortFn === sortByCreatedOn ? (
                  <span className={styles.sortByDot}>&#9679;</span>
                ) : null}{" "}
                date created
              </li>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  setSortFn(() => sortRecipeByName);
                  setShowDropdown((showDropdown) => !showDropdown);
                }}
              >
                {sortFn === sortRecipeByName ? (
                  <span className={styles.sortByDot}>&#9679;</span>
                ) : null}{" "}
                recipe name
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      {recipes && recipes.length ? (
        <ul className={styles.recipeList}>
          {recipes.sort(sortFn).map((recipe) => (
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
