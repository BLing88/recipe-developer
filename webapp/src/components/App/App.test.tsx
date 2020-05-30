import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";

jest.mock("../../react-auth0-spa");
import { useAuth0 } from "../../react-auth0-spa";
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;
const mockAuth0Value = {
  isAuthenticated: false,
  user: null,
  loading: true,
  popupOpen: false,
  loginWithPopup: jest.fn().mockName("mockLoginWithPopup"),
  handleRedirectCallback: jest.fn().mockName("mockHandleRedirectCallback"),
  getIdTokenClaims: jest.fn().mockName("mockGetIdTokenClaims"),
  loginWithRedirect: jest.fn().mockName("mockLoginWithRedirect"),
  getTokenSilently: jest.fn().mockName("mockGetTokenSilently"),
  getTokenWithPopup: jest.fn().mockName("mockGetTokenWithPopup"),
  logout: jest.fn().mockName("mockLogout"),
};

describe("App", () => {
  test("shows splash page when first loading", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");

    mockUseAuth0.mockReturnValueOnce({
      ...mockAuth0Value,
      loading: true,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByText, getByTestId } = render(<App />);

    const appTitle = getByText("Recipe Developer");
    expect(appTitle).toBeInTheDocument();
    const loadingSpinner = getByTestId("loading-spinner");
    expect(loadingSpinner).toBeInTheDocument();

    const login = queryByText(/login/i);
    const signup = queryByText(/sign up/i);
    expect(login).not.toBeInTheDocument();
    expect(signup).not.toBeInTheDocument();
  });

  test("shows landing page after loading but not logged in", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");
    mockUseAuth0.mockReturnValueOnce({
      ...mockAuth0Value,
      loading: true,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByTestId, rerender } = render(<App />);
    mockUseAuth0.mockReturnValueOnce({
      ...mockAuth0Value,
      loading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });

    rerender(<App />);

    const appTitle = getByText("Recipe Developer");
    expect(appTitle).toBeInTheDocument();
    const loadingSpinner = queryByTestId("loading-spinner");
    expect(loadingSpinner).not.toBeInTheDocument();

    const login = getByText(/login/i);
    const signup = getByText(/sign up/i);
    expect(login).toBeInTheDocument();
    expect(signup).toBeInTheDocument();
  });

  test("shows authenticated app after redirecting", () => {
    const mockLoginWithRedirect = jest.fn().mockName("loginWithRedirect");
    const mockGetTokenSilently = jest.fn().mockName("getTokenSilently");
    mockUseAuth0.mockReturnValueOnce({
      ...mockAuth0Value,
      loading: true,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    const { getByText, queryByText, rerender } = render(<App />);
    mockUseAuth0.mockReturnValue({
      ...mockAuth0Value,
      loading: false,
      user: { email: "fake email", name: "fake name" },
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      getTokenSilently: mockGetTokenSilently,
    });
    rerender(<App />);

    const logout = getByText(/log out/i);
    const login = queryByText(/login/i);
    expect(logout).toBeInTheDocument();
    expect(login).not.toBeInTheDocument();
  });
});
