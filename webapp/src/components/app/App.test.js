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
    expect(redirecting).not.toBeInTheDocument();
  });

  test("shows redirecting page when logging in", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");
    mockUseAuth0.mockReturnValueOnce({
      loading: true,
      user: undefined,
      isAuthenticated: undefined,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByText, rerender } = render(<App />);
    mockUseAuth0.mockReturnValueOnce({
      loading: true,
      user: { email: "fake email", name: "fake name" },
      isAuthenticated: undefined,
      loginWithRedirect: mockLoginWithRedirect,
    });

    rerender(<App />);

    const login = queryByText(/login/i);
    const signup = queryByText(/sign up/i);
    const redirecting = getByText(/redirecting/i);
    expect(login).not.toBeInTheDocument();
    expect(signup).not.toBeInTheDocument();
    expect(redirecting).toBeInTheDocument();
  });

  test("shows authenticated app after redirecting", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");
    const mockGetTokenSilently = jest.fn().mockName("getTokenSilently");
    mockUseAuth0.mockReturnValueOnce({
      loading: true,
      user: undefined,
      isAuthenticated: undefined,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByText, rerender } = render(<App />);
    mockUseAuth0.mockReturnValueOnce({
      loading: true,
      user: { email: "fake email", name: "fake name" },
      isAuthenticated: undefined,
      loginWithRedirect: mockLoginWithRedirect,
    });
    rerender(<App />);
    mockUseAuth0.mockReturnValue({
      loading: false,
      user: { email: "fake email", name: "fake name" },
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      getTokenSilently: mockGetTokenSilently,
    });
    rerender(<App />);

    const loading = getByText(/Loading profile/i);
    const signup = queryByText(/sign up/i);
    expect(loading).toBeInTheDocument();
    expect(signup).not.toBeInTheDocument();
  });
});
