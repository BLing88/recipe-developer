import { v4 as randomId } from "uuid";

export const buildRecipe = ({
  name,
  author,
  ingredients,
  instructions,
  notes,
}) => {
  return {
    name,
    author,
    id: `recipe-${randomId()}`,
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

export const nameOfRecipe = recipe => recipe.name;

export const authorOfRecipe = recipe => recipe.author;

export const idOfRecipe = recipe => recipe.id;

export const ingredientsOfRecipe = recipe => recipe.ingredients;

export const instructionsOfRecipe = recipe => recipe.instructions;

export const notesOfRecipe = recipe => recipe.notes;
