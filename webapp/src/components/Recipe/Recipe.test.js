import React from "react";
import { render } from "@testing-library/react";
import { Recipe } from ".";
import { buildTestRecipe } from "test/utils/generate";
import { nameOfRecipe } from "utils/recipe";

describe("Recipe", () => {
  test("Given recipe it shows title, ingredients, instructions, and notes", () => {
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
});
