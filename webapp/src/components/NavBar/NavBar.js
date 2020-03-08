import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "../../react-auth0-spa";

const NavBar = ({
  isCreatingRecipe,
  setIsCreatingRecipe,
  isShowingProfile,
  setIsShowingProfile,
}) => {
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
        {isCreatingRecipe ? (
          <button
            onClick={e => {
              e.preventDefault();
              setIsShowingProfile();
              setIsCreatingRecipe();
            }}
          >
            My profile
          </button>
        ) : null}
        <button onClick={() => logout()}>Log out</button>
      </span>
    </nav>
  );
};
NavBar.propTypes = {
  isCreatingRecipe: PropTypes.bool.isRequired,
  setIsCreatingRecipe: PropTypes.func.isRequired,
};

export { NavBar };
