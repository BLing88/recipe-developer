import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "../../react-auth0-spa";
import styles from "./NavBar.module.css";

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
    <nav className={styles.navbar}>
      <div className={styles.navbarItems}>
        {!isShowingAllRecipes && (
          <button
            className={`${styles.navbarItem} ${styles.myRecipesBtn}`}
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
            className={`${styles.navbarItem} ${styles.createRecipeBtn}`}
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
            className={`${styles.navbarItem} ${styles.profileBtn}`}
            onClick={e => {
              e.preventDefault();
              setShowingProfile();
            }}
          >
            My profile
          </button>
        )}
        <button
          className={`${styles.navbarItem} ${styles.logoutBtn}`}
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
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
