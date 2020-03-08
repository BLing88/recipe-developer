import React from "react";

const Profile = ({ children }) => {
  return (
    <article className="user-profile">
      <h1>My Profile</h1>
      {children}
    </article>
  );
};

export default Profile;
export { Profile };
