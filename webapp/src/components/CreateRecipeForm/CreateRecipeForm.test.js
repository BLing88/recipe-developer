import React from "react";
import { render } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { buildTestRecipe, buildTestUser } from "test/utils/generate";
import { nameOfRecipe } from "utils/recipe";

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

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const input = getByLabelText(new RegExp(`^ingredient ${i + 1}:$`, "i"));
      user.type(input, ingredient);
      expect(input).toHaveValue(ingredient);
      user.click(addIngredientButton);
    }

    user.click(deleteIngredientButton);

    const reversedIngredients = ingredients.slice().reverse();
    for (let i = 0; i < reversedIngredients.length; i++) {
      const ingredient = reversedIngredients[i];
      user.click(deleteIngredientButton);
      if (i < ingredients.length - 1) {
        expect(
          queryByText(
            new RegExp(`^ingredient ${ingredients.length - i}:$`, "i")
          )
        ).not.toBeInTheDocument();
      }
      expect(queryByText(ingredient)).not.toBeInTheDocument();
    }

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

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const input = getByLabelText(new RegExp(`^step ${i + 1}:$`, "i"));
      user.type(input, instruction);
      expect(input).toHaveValue(instruction);
      user.click(addInstructionButton);
    }

    user.click(deleteInstructionButton);

    const reversedInstructions = instructions.slice().reverse();
    for (let i = 0; i < reversedInstructions.length; i++) {
      const instruction = reversedInstructions[i];
      user.click(deleteInstructionButton);
      if (i < instructions.length - 1) {
        expect(
          queryByText(new RegExp(`^step ${instructions.length - i}:$`, "i"))
        ).not.toBeInTheDocument();
      }
      expect(queryByText(instruction)).not.toBeInTheDocument();
    }

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

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const input = getByLabelText(new RegExp(`^note ${i + 1}:$`, "i"));
      user.type(input, note);
      expect(input).toHaveValue(note);
      user.click(addNoteButton);
    }

    user.click(deleteNoteButton);

    const reversedNotes = notes.slice().reverse();
    for (let i = 0; i < reversedNotes.length; i++) {
      const note = reversedNotes[i];
      user.click(deleteNoteButton);
      if (i < notes.length - 1) {
        expect(
          queryByText(new RegExp(`^note ${notes.length - i}:$`, "i"))
        ).not.toBeInTheDocument();
      }
      expect(queryByText(note)).not.toBeInTheDocument();
    }

    const firstInput = getByLabelText(/^note 1:$/i);
    expect(firstInput).toBeInTheDocument();
    expect(firstInput).toHaveValue("");
  });

  test("Create new recipe when submitted", () => {
    const testuser = buildTestUser();
    const newRecipe = buildTestRecipe({ authorId: testuser.userId });
    const { ingredients, notes, instructions } = newRecipe;
    const mockCreateRecipeHandler = jest.fn().mockName("createRecipeHandler");
    const { getByLabelText, getByText } = render(
      <CreateRecipeForm createRecipeHandler={mockCreateRecipeHandler} />
    );

    const recipeNameInput = getByLabelText(/recipe name/i);
    user.click(recipeNameInput);
    user.type(recipeNameInput, nameOfRecipe(newRecipe));

    const addIngredientButton = getByText(/add ingredient/i);
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i].ingredient;
      const ingredientInput = getByLabelText(
        new RegExp(`^ingredient ${i + 1}:$`, "i")
      );
      user.type(ingredientInput, ingredient);
      user.click(addIngredientButton);
    }

    const addInstructionButton = getByText(/add instruction/i);
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].instruction;
      const instructionInput = getByLabelText(
        new RegExp(`^step ${i + 1}:$`, "i")
      );
      user.type(instructionInput, instruction);
      user.click(addInstructionButton);
    }

    const addNoteButton = getByText(/add note/i);
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i].note;
      const noteInput = getByLabelText(new RegExp(`^note ${i + 1}:$`, "i"));
      user.type(noteInput, note);
      user.click(addNoteButton);
    }

    const submitButton = getByText(/Create recipe/i);
    user.click(submitButton);
    expect(mockCreateRecipeHandler).toHaveBeenCalledTimes(1);
    expect(mockCreateRecipeHandler).toHaveBeenCalledWith({
      recipeName: newRecipe.recipeName,
      ingredients: [...newRecipe.ingredients.map(i => i.ingredient), ""],
      instructions: [...newRecipe.instructions.map(i => i.instruction), ""],
      notes: [...newRecipe.notes.map(i => i.note), ""],
    });
  });

  test("Does not submit if recipe name missing", () => {
    const testuser = buildTestUser();
    const newRecipe = buildTestRecipe({ authorId: testuser.userId });
    const { ingredients, notes, instructions } = newRecipe;
    const mockCreateRecipeHandler = jest.fn().mockName("createRecipeHandler");
    const { getByLabelText, getByText } = render(
      <CreateRecipeForm createRecipeHandler={mockCreateRecipeHandler} />
    );

    const addIngredientButton = getByText(/add ingredient/i);
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i].ingredient;
      const ingredientInput = getByLabelText(
        new RegExp(`^ingredient ${i + 1}:$`, "i")
      );
      user.type(ingredientInput, ingredient);
      user.click(addIngredientButton);
    }

    const addInstructionButton = getByText(/add instruction/i);
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].instruction;
      const instructionInput = getByLabelText(
        new RegExp(`^step ${i + 1}:$`, "i")
      );
      user.type(instructionInput, instruction);
      user.click(addInstructionButton);
    }

    const addNoteButton = getByText(/add note/i);
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i].note;
      const noteInput = getByLabelText(new RegExp(`^note ${i + 1}:$`, "i"));
      user.type(noteInput, note);
      user.click(addNoteButton);
    }

    const submitButton = getByText(/Create recipe/i);
    user.click(submitButton);
    expect(mockCreateRecipeHandler).not.toHaveBeenCalled();
    expect(getByText(/recipe name required/i)).toBeInTheDocument();
  });

  test("Shows try again message if recipe fails to be created", () => {
    const testuser = buildTestUser();
    const newRecipe = buildTestRecipe({ authorId: testuser.userId });
    const mockCreateRecipeHandler = jest.fn().mockName("createRecipeHandler");

    const { getByLabelText, getByText, rerender } = render(
      <CreateRecipeForm
        createRecipeHandler={mockCreateRecipeHandler}
        error={undefined}
        loading={false}
      />
    );

    const recipeNameInput = getByLabelText(/recipe name/i);
    user.click(recipeNameInput);
    user.type(recipeNameInput, nameOfRecipe(newRecipe));

    const submitButton = getByText(/Create recipe/i);
    user.click(submitButton);
    rerender(
      <CreateRecipeForm
        createRecipeHandler={mockCreateRecipeHandler}
        error={undefined}
        loading={true}
      />
    );

    expect(getByText(/creating recipe/i)).toBeInTheDocument();
    expect(recipeNameInput).toBeInTheDocument();
    expect(recipeNameInput).toHaveValue(nameOfRecipe(newRecipe));

    const mockError = "error creating recipe";
    rerender(
      <CreateRecipeForm
        createRecipeHandler={mockCreateRecipeHandler}
        error={mockError}
        loading={false}
      />
    );

    expect(getByText(/Error creating recipe/i)).toBeInTheDocument();
    expect(getByText(/try again/i)).toBeInTheDocument();
    expect(recipeNameInput).toBeInTheDocument();
    expect(recipeNameInput).toHaveValue(nameOfRecipe(newRecipe));
  });
});
