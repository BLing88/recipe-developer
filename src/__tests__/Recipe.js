import React from "react";
import { Recipe } from "../components/Recipe";
import { testRecipe } from "../static-recipe";
import { render } from "@testing-library/react";

test("Given recipe it shows title, ingredients, instructions", () => {
  const { title } = testRecipe;
  const { getByText } = render(<Recipe recipe={testRecipe} />);

  expect(getByText(title)).toBeInTheDocument();
  expect(getByText("Ingredients")).toBeInTheDocument();
  expect(getByText("Instructions")).toBeInTheDocument();
});
