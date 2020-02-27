import React from "react";
import user from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

const renderLandingPage = () => {
  const loginWithRedirect = jest.fn().mockName("loginWithRedirect");
  const signup = jest.fn().mockName("signup");
  const queries = render(
    <LandingPage loginWithRedirect={loginWithRedirect} signup={signup} />
  );
  return { loginWithRedirect, signup, ...queries };
};

describe("Landing page", () => {
  test("has a login button", () => {
    const { loginWithRedirect, signup, getByText } = renderLandingPage();
    const loginButton = getByText(/login/i);
    user.click(loginButton);
    expect(loginWithRedirect).toHaveBeenCalledTimes(1);
    expect(loginWithRedirect).toHaveBeenCalledWith(/*nothing*/);
    expect(signup).not.toHaveBeenCalled();
  });

  test("has a sign up button", () => {
    const { loginWithRedirect, signup, getByText } = renderLandingPage();
    const signupButton = getByText(/sign up/i);
    user.click(signupButton);
    expect(signup).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledWith(/*nothing*/);
    expect(loginWithRedirect).not.toHaveBeenCalled();
  });
});
