import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";

test("shows landing page when first loaded", () => {
  const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");

  mockUseAuth0.mockReturnValueOnce({
    loading: true,
    user: undefined,
    isAuthenticated: undefined,
    loginWithRedirect: mockLoginWithRedirect,
  });
  const { getByText, queryByText, rerender } = render(<App />);

  expect(getByText(/Redirecting/i)).toBeInTheDocument();
  expect(queryByText(/login/i)).toBeNull();
  expect(queryByText(/sign up/i)).toBeNull();

  mockUseAuth0.mockReturnValueOnce({
    loading: false,
    user: undefined,
    isAuthenticated: undefined,
    loginWithRedirect: mockLoginWithRedirect,
  });
  rerender(<App />);

  const login = getByText(/login/i);
  const signup = getByText(/sign up/i);
  expect(login).toBeInTheDocument();
  expect(signup).toBeInTheDocument();
});
