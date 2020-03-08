import React from "react";
import { UserRecipesList } from "../UserRecipesList/UserRecipesList";

const Profile = () => {
  return (
    <article className="user-profile">
      <h1>My Profile</h1>
      <UserRecipesList />
    </article>
  );
};

export default Profile;
export { Profile };
