import React from "react";
import PropTypes from "prop-types";
import "./LandingPage.module.css";
import styles from "./LandingPage.module.css";

const LandingPage = ({ loginWithRedirect, signup }) => {
  return (
    <main className={styles.landingPage}>
      <h1 className={styles.appTitle}>Recipe Developer</h1>

      <picture className={styles.recipeImage}>
        <img
          src={require("../../assets/jeff-sheldon-6MT4_Ut8a3Y-unsplash.jpg")}
          alt="recipe"
        />
      </picture>

      <button className={styles.loginBtn} onClick={() => loginWithRedirect()}>
        Login or sign up
      </button>

      <p>Easily develop all your recipes in one location.</p>
    </main>
  );
};
LandingPage.propTypes = {
  loginWithRedirect: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default LandingPage;
export { LandingPage };
