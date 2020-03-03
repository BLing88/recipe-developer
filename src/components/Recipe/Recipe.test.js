import React from "react";
import { render } from "@testing-library/react";
import { Recipe } from ".";
import { buildTestRecipe } from "test/utils/generate";
import { nameOfRecipe } from "utils/recipe";

test("Given recipe it shows title, ingredients, instructions", () => {
  const recipe = buildTestRecipe();
  const { getByText } = render(<Recipe recipe={recipe} />);

  expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument();
  expect(getByText("Ingredients")).toBeInTheDocument();
  expect(getByText("Instructions")).toBeInTheDocument();
});
