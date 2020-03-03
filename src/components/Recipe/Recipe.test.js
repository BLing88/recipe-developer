import React from "react";
import { Recipe } from ".";
import { testRecipe } from "../../static-recipe";
import { render } from "@testing-library/react";

test("Given recipe it shows title, ingredients, instructions", () => {
  const { recipeName } = testRecipe;
  const { getByText } = render(<Recipe recipe={testRecipe} />);

  expect(getByText(recipeName)).toBeInTheDocument();
  expect(getByText("Ingredients")).toBeInTheDocument();
  expect(getByText("Instructions")).toBeInTheDocument();
});
