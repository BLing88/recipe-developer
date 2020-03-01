import React from "react";
import { render } from "@testing-library/react";

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

  test("If user has no recipes, show create recipe message", () => {
    const recipes = [];
    const { getByText } = renderProfile({ recipes });

    expect(getByText(/Create recipe/i)).toBeInTheDocument();
  });
});
