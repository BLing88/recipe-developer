import React, { useState } from "react";
import PropTypes from "prop-types";

import { CreateRecipeForm } from "../CreateRecipeForm";

const Profile = ({ recipes }) => {
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  return (
    <article className="user-profile">
      <h1>My Profile</h1>
      <h2>My Recipes</h2>
      {recipes.length ? (
        <ul className="recipe-list">
          {recipes.map(recipe => (
            <li key={recipe.id}>{recipe.name}</li>
          ))}
        </ul>
      ) : (
        <button
          onClick={e => {
            e.preventDefault();
            setIsCreatingRecipe(isCreatingRecipe => !isCreatingRecipe);
          }}
        >
          Create recipe
        </button>
      )}
      {isCreatingRecipe ? <CreateRecipeForm /> : null}
    </article>
  );
};
Profile.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default Profile;
export { Profile };
