import React from "react";
import user from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { LandingPage } from "./LandingPage";
import { RedirectLoginOptions } from "@auth0/auth0-spa-js";

const renderLandingPage = () => {
  const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect") as (
    p?: RedirectLoginOptions
  ) => Promise<void>;
  const queries = render(
    <LandingPage loginWithRedirect={mockLoginWithRedirect} />
  );
  return { mockLoginWithRedirect, ...queries };
};

describe("Landing page", () => {
  test("has a login button", () => {
    const { mockLoginWithRedirect, getByText } = renderLandingPage();
    const loginButton = getByText(/login/i);
    user.click(loginButton);
    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    expect(mockLoginWithRedirect).toHaveBeenCalledWith(/*nothing*/);
  });
});
