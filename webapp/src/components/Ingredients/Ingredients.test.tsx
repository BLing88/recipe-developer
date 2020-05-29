import React from "react";
import { Ingredients } from "./Ingredients";
import { render } from "@testing-library/react";

import { buildTestIngredients } from "test/utils/generate";

test("it lists every ingredient", () => {
  const testIngredients = buildTestIngredients();
  const { getAllByText } = render(
    <Ingredients ingredients={testIngredients} onClick={jest.fn()} />
  );
  const ingredientSet = new Set(
    testIngredients.map(ingredient => ingredient.ingredient)
  );
  Array.from(ingredientSet).forEach(ingredient => {
    const ingredientRegex = new RegExp(ingredient, "i");
    const queries = getAllByText(ingredientRegex);
    queries.forEach(ingredient => expect(ingredient).toBeInTheDocument());
  });
});
