import React from "react";
import { render } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { buildTestRecipe } from "test/utils/generate";

import { CreateRecipeForm } from "./CreateRecipeForm";

expect.extend(toHaveNoViolations);

describe("CreateRecipeForm", () => {
  test("has an accessible form", async () => {
    const { container } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has inputs for name, ingredients, instructions, and notes", () => {
    const testRecipe = buildTestRecipe();
    const { name, ingredients, notes, instructions } = testRecipe;
    const { getByLabelText } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );

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

    const recipeInstructionsInput = getByLabelText(/step 1/i);
    expect(recipeInstructionsInput).toBeInTheDocument();
    expect(recipeInstructionsInput).toHaveValue("");
    user.type(recipeInstructionsInput, instructions[0].instruction);
    expect(recipeInstructionsInput).toHaveValue(instructions[0].instruction);
  });

  test("can add and delete multiple ingredients", () => {
    const testRecipe = buildTestRecipe();
    const ingredients = testRecipe.ingredients.map(i => i.ingredient);
    const { getByLabelText, getByText, queryByText } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );

    const addIngredientButton = getByText(/add ingredient/i);
    expect(addIngredientButton).toBeInTheDocument();
    const deleteIngredientButton = getByText(/delete ingredient/i);
    expect(deleteIngredientButton).toBeInTheDocument();

    ingredients.forEach((ingredient, i) => {
      const input = getByLabelText(new RegExp(`^ingredient ${i + 1}:$`, "i"));
      user.type(input, ingredient);
      expect(input).toHaveValue(ingredient);
      user.click(addIngredientButton);
    });

    user.click(deleteIngredientButton);

    ingredients
      .slice()
      .reverse()
      .forEach((ingredient, i) => {
        user.click(deleteIngredientButton);
        if (i < ingredients.length - 1) {
          expect(
            queryByText(
              new RegExp(`^ingredient ${ingredients.length - i}:$`, "i")
            )
          ).not.toBeInTheDocument();
        }
        expect(queryByText(ingredient)).not.toBeInTheDocument();
      });

    const firstInput = getByLabelText(/^ingredient 1:$/i);
    expect(firstInput).toBeInTheDocument();
    expect(firstInput).toHaveValue("");
  });
});
