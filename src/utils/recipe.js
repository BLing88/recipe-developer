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
      id: randomId(),
    })),
    instructions: instructions.map(instruction => ({
      instruction,
      id: randomId(),
    })),
    notes: notes.map(note => ({
      note,
      id: randomId(),
    })),
  };
};

export const nameOfRecipe = recipe => recipe.recipeName;

export const authorOfRecipe = recipe => recipe.authorId;

export const idOfRecipe = recipe => recipe.recipeId;

export const ingredientsOfRecipe = recipe => recipe.ingredients;

export const instructionsOfRecipe = recipe => recipe.instructions;

export const notesOfRecipe = recipe => recipe.notes;
