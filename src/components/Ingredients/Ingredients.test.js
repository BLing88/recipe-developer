import React from "react";
import { Ingredients } from "./Ingredients";
import { testRecipe } from "../../static-recipe";
import { render } from "@testing-library/react";

test("it lists every ingredient", () => {
  const { getByText } = render(
    <Ingredients ingredients={testRecipe.ingredients} />
  );

  testRecipe.ingredients.forEach(ingredient => {
    expect(getByText(ingredient.name, { exact: false })).toBeInTheDocument();
  });
});
