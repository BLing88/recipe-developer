import React from "react";
import PropTypes from "prop-types";

const LandingPage = ({ loginWithRedirect, signup }) => {
  return (
    <main>
      <h1>Recipe Developer</h1>
      <button onClick={() => loginWithRedirect()}>Login</button>
      <section>
        Don&apos;t have an account?
        <button onClick={() => signup()}>Sign up</button>
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
