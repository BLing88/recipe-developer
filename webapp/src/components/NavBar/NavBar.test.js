import React from "react";
import { NavBar } from "./NavBar";
import { render } from "@testing-library/react";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";

describe("NavBar", () => {
  test("shows create recipe button if not creating recipe", () => {
    mockUseAuth0.mockReturnValue({
      logout: jest.fn().mockName("logout"),
    });
    const { getByText } = render(
      <NavBar isCreatingRecipe={false} setIsCreatingRecipe={jest.fn()} />
    );
    expect(getByText(/create recipe/i)).toBeInTheDocument();
  });
});
