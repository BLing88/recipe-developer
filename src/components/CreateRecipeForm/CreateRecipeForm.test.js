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
    const { recipeName, ingredients, notes, instructions } = testRecipe;
    const { getByLabelText } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );

    const recipeNameInput = getByLabelText(/name/i);
    expect(recipeNameInput).toBeInTheDocument();
    expect(recipeNameInput).toHaveTextContent("");
    user.type(recipeNameInput, recipeName);
    expect(recipeNameInput).toHaveValue(recipeName);

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

    const recipeNotesInput = getByLabelText(/note 1/i);
    expect(recipeNotesInput).toBeInTheDocument();
    expect(recipeNotesInput).toHaveValue("");
    user.type(recipeNotesInput, notes[0].note);
    expect(recipeNotesInput).toHaveValue(notes[0].note);
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

  test("can add and delete multiple instructions", () => {
    const testRecipe = buildTestRecipe();
    const instructions = testRecipe.instructions.map(i => i.instruction);
    const { getByLabelText, getByText, queryByText } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );

    const addInstructionButton = getByText(/add instruction/i);
    expect(addInstructionButton).toBeInTheDocument();
    const deleteInstructionButton = getByText(/delete instruction/i);
    expect(deleteInstructionButton).toBeInTheDocument();

    instructions.forEach((instruction, i) => {
      const input = getByLabelText(new RegExp(`^step ${i + 1}:$`, "i"));
      user.type(input, instruction);
      expect(input).toHaveValue(instruction);
      user.click(addInstructionButton);
    });

    user.click(deleteInstructionButton);

    instructions
      .slice()
      .reverse()
      .forEach((instruction, i) => {
        user.click(deleteInstructionButton);
        if (i < instructions.length - 1) {
          expect(
            queryByText(new RegExp(`^step ${instructions.length - i}:$`, "i"))
          ).not.toBeInTheDocument();
        }
        expect(queryByText(instruction)).not.toBeInTheDocument();
      });

    const firstInput = getByLabelText(/^step 1:$/i);
    expect(firstInput).toBeInTheDocument();
    expect(firstInput).toHaveValue("");
  });

  test("can add and delete multiple notes", () => {
    const testRecipe = buildTestRecipe();
    const notes = testRecipe.notes.map(i => i.note);
    const { getByLabelText, getByText, queryByText } = render(
      <CreateRecipeForm createRecipeHandler={jest.fn()} />
    );

    const addNoteButton = getByText(/add note/i);
    expect(addNoteButton).toBeInTheDocument();
    const deleteNoteButton = getByText(/delete note/i);
    expect(deleteNoteButton).toBeInTheDocument();

    notes.forEach((note, i) => {
      const input = getByLabelText(new RegExp(`^note ${i + 1}:$`, "i"));
      user.type(input, note);
      expect(input).toHaveValue(note);
      user.click(addNoteButton);
    });

    user.click(deleteNoteButton);

    notes
      .slice()
      .reverse()
      .forEach((note, i) => {
        user.click(deleteNoteButton);
        if (i < notes.length - 1) {
          expect(
            queryByText(new RegExp(`^note ${notes.length - i}:$`, "i"))
          ).not.toBeInTheDocument();
        }
        expect(queryByText(note)).not.toBeInTheDocument();
      });

    const firstInput = getByLabelText(/^note 1:$/i);
    expect(firstInput).toBeInTheDocument();
    expect(firstInput).toHaveValue("");
  });
});
