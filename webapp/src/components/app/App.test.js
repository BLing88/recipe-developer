import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";

describe("App", () => {
  test("shows landing page when first loaded", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");

    mockUseAuth0.mockReturnValueOnce({
      loading: true,
      user: undefined,
      isAuthenticated: undefined,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByText } = render(<App />);

    const login = getByText(/login/i);
    const signup = getByText(/sign up/i);
    const redirecting = queryByText(/redirecting/i);
    expect(login).toBeInTheDocument();
    expect(signup).toBeInTheDocument();
    expect(redirecting).toBeNull();
  });
});
