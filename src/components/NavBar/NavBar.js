import React from "react";
import { useAuth0 } from "../../react-auth0-spa";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      ) : (
        <span>
          <button>My recipes</button>
          <button>Create recipe</button>
          <button>My profile</button>
          <button onClick={() => logout()}>Log out</button>
        </span>
      )}
    </nav>
  );
};

export { NavBar };
