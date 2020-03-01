import React from "react";
import PropTypes from "prop-types";

const Profile = ({ recipes }) => (
  <article className="user-profile">
    <h1>My Profile</h1>
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
Profile.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default Profile;
export { Profile };
