/// <reference types="react-scripts" />

namespace Recipes {
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

  interface RecipeSummary {
    recipeName: string;
    recipeId: string;
  }

  type Component = Ingredient | Instruction | Note;
  type ComponentArray = Ingredient[] | Instruction[] | Note[];
}
