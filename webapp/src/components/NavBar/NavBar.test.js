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
      <NavBar
        isCreatingRecipe={false}
        showCreatingRecipe={jest.fn()}
        isShowingProfile={true}
        setShowingProfile={jest.fn()}
        isShowingAllRecipes={false}
        setShowingAllRecipes={jest.fn()}
      />
    );
    expect(getByText(/create recipe/i)).toBeInTheDocument();
  });

  test("shows my profile button if not showing profile", () => {
    mockUseAuth0.mockReturnValue({
      logout: jest.fn().mockName("logout"),
    });
    const { getByText } = render(
      <NavBar
        isCreatingRecipe={true}
        showCreatingRecipe={jest.fn()}
        isShowingProfile={false}
        setShowingProfile={jest.fn()}
        isShowingAllRecipes={false}
        setShowingAllRecipes={jest.fn()}
      />
    );
    expect(getByText(/my profile/i)).toBeInTheDocument();
  });
});
