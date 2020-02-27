import React from "react";
import user from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

const renderLandingPage = () => {
  const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");
  const mockSignup = jest.fn().mockName("signup");
  const queries = render(
    <LandingPage
      loginWithRedirect={mockLoginWithRedirect}
      signup={mockSignup}
    />
  );
  return { mockLoginWithRedirect, mockSignup, ...queries };
};

describe("Landing page", () => {
  test("has a login button", () => {
    const {
      mockLoginWithRedirect,
      mockSignup,
      getByText,
    } = renderLandingPage();
    const loginButton = getByText(/login/i);
    user.click(loginButton);
    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    expect(mockLoginWithRedirect).toHaveBeenCalledWith(/*nothing*/);
    expect(mockSignup).not.toHaveBeenCalled();
  });

  test("has a sign up button", () => {
    const {
      mockLoginWithRedirect,
      mockSignup,
      getByText,
    } = renderLandingPage();
    const signupButton = getByText(/sign up/i);
    user.click(signupButton);
    expect(mockSignup).toHaveBeenCalledTimes(1);
    expect(mockSignup).toHaveBeenCalledWith(/*nothing*/);
    expect(mockLoginWithRedirect).not.toHaveBeenCalled();
  });
});
