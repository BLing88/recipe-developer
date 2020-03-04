import React from "react";
import { useAuth0 } from "../../react-auth0-spa";

const NavBar = () => {
  const { logout } = useAuth0();

  return (
    <nav>
      <span>
        <button>My recipes</button>
        <button>Create recipe</button>
        <button>My profile</button>
        <button onClick={() => logout()}>Log out</button>
      </span>
    </nav>
  );
};

export { NavBar };
