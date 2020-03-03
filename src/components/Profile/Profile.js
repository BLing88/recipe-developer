import React from "react";
import PropTypes from "prop-types";

import { idOfRecipe, nameOfRecipe } from "utils/recipe";

const Profile = ({ recipes, setIsCreatingRecipe }) => {
  return (
    <article className="user-profile">
      <h1>My Profile</h1>
      {recipes.length ? (
        <>
          <h2>My Recipes</h2>
          <ul className="recipe-list">
            {recipes.map(recipe => (
              <li key={idOfRecipe(recipe)}>{nameOfRecipe(recipe)}</li>
            ))}
          </ul>
        </>
      ) : (
        <button
          data-testid="no-recipes-create-btn"
          onClick={e => {
            e.preventDefault();
            setIsCreatingRecipe();
          }}
        >
          Create recipe
        </button>
      )}
    </article>
  );
};
Profile.propTypes = {
  recipes: PropTypes.array.isRequired,
  setIsCreatingRecipe: PropTypes.func.isRequired,
};

export default Profile;
export { Profile };
