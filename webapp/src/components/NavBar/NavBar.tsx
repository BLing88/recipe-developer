import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import styles from "./NavBar.module.css";
import { useHistory } from "react-router-dom";

const NavBar = ({
  isCreatingRecipe,
  isShowingProfile,
  isShowingAllRecipes,
}: {
  isCreatingRecipe: boolean;
  isShowingProfile: boolean;
  isShowingAllRecipes: boolean;
}) => {
  const { logout } = useAuth0()!;
  const history = useHistory();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarItems}>
        {!isShowingAllRecipes && (
          <button
            className={`${styles.navbarItem} ${styles.myRecipesBtn}`}
            onClick={(e) => {
              e.preventDefault();
              history.push("/my-recipes");
            }}
          >
            My recipes
          </button>
        )}
        {!isCreatingRecipe && (
          <button
            className={`${styles.navbarItem} ${styles.createRecipeBtn}`}
            onClick={(e) => {
              e.preventDefault();
              history.push("/create-recipe");
            }}
          >
            Create recipe
          </button>
        )}
        {!isShowingProfile && (
          <button
            className={`${styles.navbarItem} ${styles.profileBtn}`}
            onClick={(e) => {
              e.preventDefault();
              history.push("/my-profile");
            }}
          >
            My profile
          </button>
        )}
        <button
          className={`${styles.navbarItem} ${styles.logoutBtn}`}
          onClick={() => {
            logout();
            // history.push("/logout");
          }}
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export { NavBar };
