import { v4 as randomId } from "uuid";

export const buildRecipe = ({
  recipeName,
  authorId,
  ingredients = [],
  instructions = [],
  notes = [],
}) => {
  return {
    recipeName,
    authorId,
    recipeId: `recipe-${randomId()}`,
    ingredients: ingredients.map(ingredient => ({
      ingredient,
      ingredientId: randomId(),
    })),
    instructions: instructions.map(instruction => ({
      instruction,
      instructionId: randomId(),
    })),
    notes: notes.map(note => ({
      note,
      noteId: randomId(),
    })),
  };
};

export const buildIngredient = ingredient => ({
  ingredient,
  ingredientId: randomId(),
});

export const buildInstruction = instruction => ({
  instruction,
  instructionId: randomId(),
});

export const nameOfRecipe = recipe => recipe.recipeName;

export const authorOfRecipe = recipe => recipe.authorId;

export const idOfRecipe = recipe => recipe.recipeId;

export const ingredientsOfRecipe = recipe => recipe.ingredients;
export const getIngredientOf = ingredient => ingredient.ingredient;
export const idOfIngredient = ingredient => ingredient.ingredientId;

export const instructionsOfRecipe = recipe => recipe.instructions;
export const getInstructionOf = instruction => instruction.instruction;
export const idOfInstruction = instruction => instruction.instructionId;

export const notesOfRecipe = recipe => recipe.notes;

export const idOfNote = note => note.noteId;
