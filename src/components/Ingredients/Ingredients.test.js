import React from "react";
import { Ingredients } from "./Ingredients";
import { render } from "@testing-library/react";

import { buildTestIngredients } from "test/utils/generate";

test("it lists every ingredient", () => {
  const testIngredients = buildTestIngredients();
  const { getAllByText } = render(
    <Ingredients ingredients={testIngredients} />
  );
  const ingredientSet = new Set(
    testIngredients.map(ingredient => ingredient.ingredient)
  );
  Array.from(ingredientSet).forEach(ingredient => {
    const queries = getAllByText(ingredient, { exact: false });
    queries.forEach(ingredient => expect(ingredient).toBeInTheDocument());
  });
});
