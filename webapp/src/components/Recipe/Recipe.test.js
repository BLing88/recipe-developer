import React from "react";
import { render, getByTestId, wait } from "@testing-library/react";
import { Recipe } from ".";
import { buildTestRecipe } from "test/utils/generate";
import {
  nameOfRecipe,
  buildIngredient,
  buildInstruction,
  buildNote,
} from "utils/recipe";
import testUser from "@testing-library/user-event";

const renderRecipe = (overrides = {}) => {
  const recipe = overrides.recipe || buildTestRecipe();
  const updateHandler =
    overrides.updateHandler || jest.fn().mockName("updateHandler");
  const updateRecipeError = overrides.updateRecipeError || null;
  const updateRecipeLoading = overrides.updateRecipeLoading || false;
  const deleteHandler =
    overrides.deleteHandler || jest.fn().mockName("deleteHandler");
  const deleteRecipeError = overrides.deleteRecipeError || null;
  const deleteRecipeLoading = overrides.deleteRecipeLoading || false;
  return {
    recipe,
    ...render(
      <Recipe
        recipe={recipe}
        updateHandler={updateHandler}
        updateRecipeError={updateRecipeError}
        updateRecipeLoading={updateRecipeLoading}
        deleteHandler={deleteHandler}
        deleteRecipeError={deleteRecipeError}
        deleteRecipeLoading={deleteRecipeLoading}
      />
    ),
  };
};

describe("Recipe", () => {
  test("shows title, ingredients, instructions, and notes", () => {
    const recipe = buildTestRecipe();
    const { ingredients, instructions, notes } = recipe;
    const { getAllByText, getByText } = renderRecipe({ recipe });

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

  test("clicking on a note brings up note editing inputs", () => {
    const {
      getAllByText,
      getByLabelText,
      getByTestId,
      recipe,
    } = renderRecipe();
    const { notes } = recipe;

    testUser.click(getAllByText(notes[0].note)[0]);
    const noteInput = getByLabelText(/^note 1:/i);
    expect(noteInput).toBeInTheDocument();
    expect(noteInput).toHaveValue(notes[0].note);

    const deleteButton = getByTestId("delete-note-1");
    testUser.click(deleteButton);
    expect(getByLabelText(/^note 1:/i)).toHaveValue(notes[1].note);
  });

  test("submitting an empty recipe shows an error message", async () => {
    const recipeName = "a";
    const { queryByText, getByText, getByLabelText } = renderRecipe({
      recipe: buildTestRecipe({
        recipeName,
        ingredients: [buildIngredient("")],
        instructions: [buildInstruction("")],
        notes: [buildNote("")],
      }),
    });

    expect(queryByText(/submit/i)).not.toBeInTheDocument();
    testUser.click(getByText(recipeName));
    await testUser.type(getByLabelText(/recipe name/i), "", {
      allAtOnce: true,
    });
    testUser.click(getByText(/ingredients/i));
    expect(queryByText(/Recipe cannot be empty/i)).not.toBeInTheDocument();

    const submitButton = queryByText(/submit/i);
    expect(submitButton).toBeInTheDocument();
    testUser.click(submitButton);
    expect(getByText(/Recipe cannot be empty/i)).toBeInTheDocument();

    await testUser.type(getByLabelText(/ingredient/i), "new ingredient");
    testUser.click(submitButton);
    expect(queryByText(/Recipe cannot be empty/i)).not.toBeInTheDocument();
  });
});
