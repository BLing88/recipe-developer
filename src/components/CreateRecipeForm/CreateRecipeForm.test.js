import React from "react";
import { render } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { buildTestRecipe } from "test/utils/generate";

import { CreateRecipeForm } from "./CreateRecipeForm";

expect.extend(toHaveNoViolations);

describe("CreateRecipeForm", () => {
  test("has an accessible form", async () => {
    const { container } = render(<CreateRecipeForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has inputs for name, ingredients, instructions, and notes", () => {
    const testRecipe = buildTestRecipe();
    const { name, ingredients, notes, instructions } = testRecipe;
    const { getByLabelText } = render(<CreateRecipeForm />);

    const recipeNameInput = getByLabelText(/name/i);
    expect(recipeNameInput).toBeInTheDocument();
    expect(recipeNameInput).toHaveTextContent("");
    user.type(recipeNameInput, name);
    expect(recipeNameInput).toHaveValue(name);

    const recipeIngredientsInput = getByLabelText(/ingredient 1/i);
    expect(recipeIngredientsInput).toBeInTheDocument();
    expect(recipeIngredientsInput).toHaveTextContent("");
    user.type(recipeIngredientsInput, ingredients[0].ingredient);
    expect(recipeIngredientsInput).toHaveValue(ingredients[0].ingredient);
  });

  test("can add and delete multiple ingredients", () => {
    const testRecipe = buildTestRecipe();
    // const ingredients = testRecipe.ingredients.map(i => i.ingredient);
    const { getByLabelText, getByText, queryByText } = render(
      <CreateRecipeForm />
    );

    const addIngredientButton = getByText(/add ingredient/i);
    expect(addIngredientButton).toBeInTheDocument();

    const recipeIngredientsInput1 = getByLabelText(/ingredient 1/i);
    expect(recipeIngredientsInput1).toBeInTheDocument();
    expect(recipeIngredientsInput1).toHaveTextContent("");
    user.click(addIngredientButton);
    const recipeIngredientsInput2 = getByLabelText(/ingredient 2/i);
    expect(recipeIngredientsInput2).toBeInTheDocument();
    expect(recipeIngredientsInput2).toHaveTextContent("");

    const deleteIngredientButton = getByText(/delete ingredient/i);
    expect(deleteIngredientButton).toBeInTheDocument();
    user.click(deleteIngredientButton);
    expect(queryByText(/ingredient 2/i)).toBeNull();
    user.click(deleteIngredientButton);
    expect(recipeIngredientsInput1).toHaveTextContent("");
  });
});
