import React from "react";
import { render } from "@testing-library/react";
import { Recipe } from ".";
import { buildTestRecipe } from "test/utils/generate";
import { nameOfRecipe } from "utils/recipe";
import testUser from "@testing-library/user-event";

const renderRecipe = () => {
  const recipe = buildTestRecipe();
  return {
    recipe,
    ...render(<Recipe recipe={recipe} />),
  };
};

describe("Recipe", () => {
  test("shows title, ingredients, instructions, and notes", () => {
    const recipe = buildTestRecipe();
    const { ingredients, instructions, notes } = recipe;
    const { getAllByText, getByText } = render(<Recipe recipe={recipe} />);

    expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument();
    expect(getByText("Ingredients")).toBeInTheDocument();
    expect(getByText("Instructions")).toBeInTheDocument();
    expect(getByText("Notes")).toBeInTheDocument();

    for (let ingredient of ingredients) {
      expect(getAllByText(ingredient.ingredient)).not.toBeNull();
    }
    for (let instruction of instructions) {
      expect(getAllByText(instruction.instruction)).not.toBeNull();
    }
    for (let note of notes) {
      expect(getAllByText(note.note)).not.toBeNull();
    }
  });

  test("clicking recipe name allows user to edit it", () => {
    const { getByText, getByLabelText, recipe } = renderRecipe();

    testUser.click(getByText(nameOfRecipe(recipe)));
    const recipeNameInput = getByLabelText(/recipe name/i);
    expect(recipeNameInput).toBeInTheDocument();
    expect(recipeNameInput).toHaveValue(nameOfRecipe(recipe));
  });

  test("clicking on an ingredient brings up ingredient editing inputs", () => {
    const {
      getAllByText,
      getByLabelText,
      getByTestId,
      recipe,
    } = renderRecipe();
    const { ingredients } = recipe;

    testUser.click(getAllByText(ingredients[0].ingredient)[0]);
    const ingredientInput = getByLabelText(/^ingredient 1:/i);
    expect(ingredientInput).toBeInTheDocument();
    expect(ingredientInput).toHaveValue(ingredients[0].ingredient);

    const deleteButton = getByTestId("delete-ingredient-1");
    testUser.click(deleteButton);
    expect(getByLabelText(/^ingredient 1:/i)).toHaveValue(
      ingredients[1].ingredient
    );
  });

  test("clicking on an instruction brings up instruction editing inputs", () => {
    const {
      getAllByText,
      getByLabelText,
      getByTestId,
      recipe,
    } = renderRecipe();
    const { instructions } = recipe;

    testUser.click(getAllByText(instructions[0].instruction)[0]);
    const instructionInput = getByLabelText(/^step 1:/i);
    expect(instructionInput).toBeInTheDocument();
    expect(instructionInput).toHaveValue(instructions[0].instruction);

    const deleteButton = getByTestId("delete-instruction-1");
    testUser.click(deleteButton);
    expect(getByLabelText(/^step 1:/i)).toHaveValue(
      instructions[1].instruction
    );
  });
});
