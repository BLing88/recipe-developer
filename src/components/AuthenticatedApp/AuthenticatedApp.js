import React from "react";
import { NavBar } from "../NavBar";
import { Recipe } from "../Recipe";

// import useAuth0 from '../../react-auth0-spa';

const AuthenticatedApp = ({ user }) => {
  return (
    <div className="app">
      <header className="app-header">
        Welcome {user.nickname}
        <NavBar />
      </header>
      <Recipe recipe={recipe} />
      {/* <EditRecipeForm updateRecipeHandler={updateRecipeHandler} /> */}
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
