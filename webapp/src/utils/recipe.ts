import { v4 as randomId } from "uuid";

export const nameOfRecipe = (recipe: Recipes.Recipe | Recipes.RecipeSummary) =>
  recipe.recipeName;

export const authorOfRecipe = (recipe: Recipes.Recipe) => recipe.authorId;

export const idOfRecipe = (recipe: Recipes.Recipe | Recipes.RecipeSummary) =>
  recipe.recipeId;

export const ingredientsOfRecipe = (recipe: Recipes.Recipe) =>
  recipe.ingredients;
export const getIngredientOf = (ingredient: Recipes.Ingredient) =>
  ingredient.ingredient;
export const idOfIngredient = (ingredient: Recipes.Ingredient) =>
  ingredient.ingredientId;

export const instructionsOfRecipe = (recipe: Recipes.Recipe) =>
  recipe.instructions;
export const getInstructionOf = (instruction: Recipes.Instruction) =>
  instruction.instruction;
export const idOfInstruction = (instruction: Recipes.Instruction) =>
  instruction.instructionId;

export const notesOfRecipe = (recipe: Recipes.Recipe) => recipe.notes;
export const getNoteOf = (note: Recipes.Note) => note.note;
export const idOfNote = (note: Recipes.Note) => note.noteId;

const isIngredient = (
  ingredient: Recipes.Ingredient | string
): ingredient is Recipes.Ingredient => {
  return (
    (ingredient as Recipes.Ingredient).ingredient !== undefined &&
    (ingredient as Recipes.Ingredient).ingredientId !== undefined
  );
};

const isInstruction = (
  instruction: Recipes.Instruction | string
): instruction is Recipes.Instruction => {
  return (
    (instruction as Recipes.Instruction).instruction !== undefined &&
    (instruction as Recipes.Instruction).instructionId !== undefined
  );
};

const isNote = (note: Recipes.Note | string): note is Recipes.Note => {
  return (
    (note as Recipes.Note).note !== undefined &&
    (note as Recipes.Note).noteId !== undefined
  );
};

export const buildIngredient = (
  ingredient: string | Recipes.Ingredient
): Recipes.Ingredient =>
  isIngredient(ingredient)
    ? ingredient
    : {
        ingredient,
        ingredientId: randomId(),
      };

export const buildInstruction = (instruction: Recipes.Instruction | string) =>
  isInstruction(instruction)
    ? instruction
    : {
        instruction,
        instructionId: randomId(),
      };

export const buildNote = (note: string | Recipes.Note) =>
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
}: Recipes.Recipe): Recipes.Recipe => {
  return {
    recipeName,
    authorId,
    recipeId: `recipe-${randomId()}`,
    ingredients: ingredients.map(buildIngredient),
    instructions: instructions.map(buildInstruction),
    notes: notes.map(buildNote),
  };
};
