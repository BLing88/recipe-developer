/// <reference types="react-scripts" />

namespace Recipe {
  interface Ingredient {
    ingredient: string;
    ingredientId: string;
  }

  interface Instruction {
    instruction: string;
    instructionId: string;
  }

  interface Note {
    note: string;
    noteId: string;
  }

  interface Recipe {
    recipeName: string;
    authorId: string;
    recipeId: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
  }
}
