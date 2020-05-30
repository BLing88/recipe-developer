import React from "react";
import { useAuth0 } from "../../react-auth0-spa";

const Profile = ({ recipeCount }: { recipeCount: number }) => {
  const { user } = useAuth0()!;

  return (
    <article className="user-profile">
      <h1>My Profile</h1>
      <p>Username: {user.name}</p>
      <p>You have {recipeCount} recipes.</p>
    </article>
  );
};

export default Profile;
export { Profile };
