const { v4: randomId } = require("uuid");

const buildRecipe = ({
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

const nameOfRecipe = recipe => recipe.recipeName;

const authorOfRecipe = recipe => recipe.authorId;

const idOfRecipe = recipe => recipe.recipeId;

const ingredientsOfRecipe = recipe => recipe.ingredients;

const idOfIngredient = ingredient => ingredient.ingredientId;

const instructionsOfRecipe = recipe => recipe.instructions;

const idOfInstruction = instruction => instruction.instructionId;

const notesOfRecipe = recipe => recipe.notes;

const idOfNote = note => note.noteId;

module.exports = {
  buildRecipe,
  nameOfRecipe,
  authorOfRecipe,
  idOfRecipe,
  ingredientsOfRecipe,
  idOfIngredient,
  instructionsOfRecipe,
  idOfInstruction,
  notesOfRecipe,
  idOfNote,
};
