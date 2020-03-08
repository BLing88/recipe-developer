import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "../../react-auth0-spa";

const NavBar = ({ isCreatingRecipe, setIsCreatingRecipe }) => {
  const { logout } = useAuth0();

  return (
    <nav>
      <span>
        <button>My recipes</button>
        {!isCreatingRecipe && (
          <button
            onClick={e => {
              e.preventDefault();
              setIsCreatingRecipe();
            }}
          >
            Create recipe
          </button>
        )}
        <button>My profile</button>
        <button onClick={() => logout()}>Log out</button>
      </span>
    </nav>
  );
};
NavBar.propTypes = {
  isCreatingRecipe: PropTypes.bool.isRequired,
};

export { NavBar };
