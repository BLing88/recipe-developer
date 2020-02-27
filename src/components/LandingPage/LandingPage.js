import React from "react";
import PropTypes from "prop-types";

const LandingPage = ({ loginWithRedirect, signup }) => {
  return (
    <main className="landing-page">
      <h1 className="app-name">Recipe Developer</h1>
      <button className="login-btn" onClick={() => loginWithRedirect()}>
        Login
      </button>
      <section>
        Don&apos;t have an account?
        <button className="signup-btn" onClick={() => signup()}>
          Sign up
        </button>
      </section>
    </main>
  );
};
LandingPage.propTypes = {
  loginWithRedirect: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default LandingPage;
export { LandingPage };
