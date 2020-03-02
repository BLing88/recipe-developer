import React from "react";
import { render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { Profile } from "./Profile";
import { buildArray, buildTestRecipe } from "test/utils/generate";

const renderProfile = (overrides = {}) => {
  const author = overrides.author || "test author";
  const userRecipes =
    overrides.recipes ||
    buildArray(overrides.numberOfRecipes || 5, () =>
      buildTestRecipe({ author })
    );
  return render(<Profile recipes={userRecipes} />);
};

describe("Profile", () => {
  test("shows list of user recipes", () => {
    const recipes = buildArray(5, () => buildTestRecipe());
    const { getByText } = renderProfile({ recipes });

    expect(getByText(/^My Recipes$/i)).toBeInTheDocument();
    recipes.forEach(recipe =>
      expect(getByText(recipe.name)).toBeInTheDocument()
    );
  });

  test("shows create recipe message if user has no recipes,", () => {
    const recipes = [];
    const { getByText } = renderProfile({ recipes });

    expect(getByText(/Create recipe/i)).toBeInTheDocument();
  });

  test("Shows create recipe form when create recipe button is clicked", () => {
    const recipes = [];
    const { getByText, getByTestId } = renderProfile({ recipes });

    const createRecipeButton = getByText(/Create recipe/i);
    user.click(createRecipeButton);
    expect(getByTestId("create-recipe-form")).toBeInTheDocument();
  });
});
