import React from "react";
import PropTypes from "prop-types";
import { Recipe } from "../Recipe";

const Profile = ({ recipes }) => (
  <article className="user-profile">
    <h2>My Recipes</h2>
    <ul className="recipe-list">
      {recipes.length ? (
        recipes.map(recipe => <li key={recipe.id}>{recipe.name}</li>)
      ) : (
        <div>Create recipe</div>
      )}
    </ul>
  </article>
);
Recipe.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default Profile;
export { Profile };
