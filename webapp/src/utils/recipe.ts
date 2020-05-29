import { v4 as randomId } from "uuid";

export const nameOfRecipe = (recipe: Recipe.Recipe | Recipe.RecipeSummary) =>
  recipe.recipeName;

export const authorOfRecipe = (recipe: Recipe.Recipe) => recipe.authorId;

export const idOfRecipe = (recipe: Recipe.Recipe | Recipe.RecipeSummary) =>
  recipe.recipeId;

export const ingredientsOfRecipe = (recipe: Recipe.Recipe) =>
  recipe.ingredients;
export const getIngredientOf = (ingredient: Recipe.Ingredient) =>
  ingredient.ingredient;
export const idOfIngredient = (ingredient: Recipe.Ingredient) =>
  ingredient.ingredientId;

export const instructionsOfRecipe = (recipe: Recipe.Recipe) =>
  recipe.instructions;
export const getInstructionOf = (instruction: Recipe.Instruction) =>
  instruction.instruction;
export const idOfInstruction = (instruction: Recipe.Instruction) =>
  instruction.instructionId;

export const notesOfRecipe = (recipe: Recipe.Recipe) => recipe.notes;
export const getNoteOf = (note: Recipe.Note) => note.note;
export const idOfNote = (note: Recipe.Note) => note.noteId;

const isIngredient = (
  ingredient: Recipe.Ingredient | string
): ingredient is Recipe.Ingredient => {
  return (
    (ingredient as Recipe.Ingredient).ingredient !== undefined &&
    (ingredient as Recipe.Ingredient).ingredientId !== undefined
  );
};

const isInstruction = (
  instruction: Recipe.Instruction | string
): instruction is Recipe.Instruction => {
  return (
    (instruction as Recipe.Instruction).instruction !== undefined &&
    (instruction as Recipe.Instruction).instructionId !== undefined
  );
};

const isNote = (note: Recipe.Note | string): note is Recipe.Note => {
  return (
    (note as Recipe.Note).note !== undefined &&
    (note as Recipe.Note).noteId !== undefined
  );
};

export const buildIngredient = (
  ingredient: string | Recipe.Ingredient
): Recipe.Ingredient =>
  isIngredient(ingredient)
    ? ingredient
    : {
        ingredient,
        ingredientId: randomId(),
      };

export const buildInstruction = (instruction: Recipe.Instruction | string) =>
  isInstruction(instruction)
    ? instruction
    : {
        instruction,
        instructionId: randomId(),
      };

export const buildNote = (note: Recipe.Note) =>
  isNote(note)
    ? note
    : {
        note,
        noteId: randomId(),
      };

export const buildRecipe = ({
  recipeName,
  authorId,
  ingredients = [],
  instructions = [],
  notes = [],
}: Recipe.Recipe): Recipe.Recipe => {
  return {
    recipeName,
    authorId,
    recipeId: `recipe-${randomId()}`,
    ingredients: ingredients.map(buildIngredient),
    instructions: instructions.map(buildInstruction),
    notes: notes.map(buildNote),
  };
};
