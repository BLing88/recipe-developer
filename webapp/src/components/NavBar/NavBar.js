import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "../../react-auth0-spa";

const NavBar = ({
  isCreatingRecipe,
  showCreatingRecipe,
  isShowingProfile,
  setShowingProfile,
  isShowingAllRecipes,
  setShowingAllRecipes,
}) => {
  const { logout } = useAuth0();

  return (
    <nav>
      <span>
        {!isShowingAllRecipes && (
          <button
            onClick={e => {
              e.preventDefault();
              setShowingAllRecipes();
            }}
          >
            My recipes
          </button>
        )}
        {!isCreatingRecipe && (
          <button
            onClick={e => {
              e.preventDefault();
              showCreatingRecipe();
            }}
          >
            Create recipe
          </button>
        )}
        {!isShowingProfile && (
          <button
            onClick={e => {
              e.preventDefault();
              setShowingProfile();
            }}
          >
            My profile
          </button>
        )}
        <button onClick={() => logout()}>Log out</button>
      </span>
    </nav>
  );
};
NavBar.propTypes = {
  isCreatingRecipe: PropTypes.bool.isRequired,
  showCreatingRecipe: PropTypes.func.isRequired,
  isShowingProfile: PropTypes.bool.isRequired,
  setShowingProfile: PropTypes.func.isRequired,
  isShowingAllRecipes: PropTypes.bool.isRequired,
  setShowingAllRecipes: PropTypes.func.isRequired,
};

export { NavBar };
