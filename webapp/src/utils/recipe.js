import { v4 as randomId } from "uuid";

export const buildIngredient = ingredient => ({
  ingredient,
  ingredientId: randomId(),
});

export const buildInstruction = instruction => ({
  instruction,
  instructionId: randomId(),
});

export const buildNote = note => ({
  note,
  noteId: randomId(),
});

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
    ingredients: ingredients.map(buildIngredient),
    instructions: instructions.map(buildInstruction),
    notes: notes.map(buildNote),
  };
};

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
export const getNoteOf = note => note.note;
export const idOfNote = note => note.noteId;
