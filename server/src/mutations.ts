import { gql } from "apollo-server-lambda";

export const CREATE_RECIPE = gql`
  mutation createRecipe($recipeInput: RecipeInput!, $authorId: ID!) {
    createRecipe(recipeInput: $recipeInput, authorId: $authorId) {
      recipeName
      recipeId
      authorId
      lastModifiedOn
      createdOn
      ingredients {
        ingredient
        ingredientId
      }
      instructions {
        instruction
        instructionId
      }
      notes {
        note
        noteId
      }
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation updateRecipe(
    $authorId: ID!
    $recipeId: ID!
    $recipeName: String
    $ingredients: [IngredientInput!]
    $instructions: [InstructionInput!]
    $notes: [NoteInput!]
  ) {
    updateRecipe(
      authorId: $authorId
      recipeId: $recipeId
      recipeName: $recipeName
      ingredients: $ingredients
      instructions: $instructions
      notes: $notes
    ) {
      authorId
      recipeId
      recipeName
      lastModifiedOn
      createdOn
      ingredients {
        ingredient
        ingredientId
      }
      instructions {
        instruction
        instructionId
      }
      notes {
        note
        noteId
      }
    }
  }
`;

export const UPDATE_RECIPE_NAME = gql`
  mutation updateRecipeName(
    $authorId: ID!
    $recipeId: ID!
    $newRecipeName: String!
  ) {
    updateRecipeName(
      authorId: $authorId
      recipeId: $recipeId
      newRecipeName: $newRecipeName
    )
  }
`;

export const UPDATE_INGREDIENTS = gql`
  mutation updateIngredients(
    $authorId: ID!
    $recipeId: ID!
    $ingredients: [IngredientInput!]!
  ) {
    updateIngredients(
      authorId: $authorId
      recipeId: $recipeId
      ingredients: $ingredients
    ) {
      ingredient
      ingredientId
    }
  }
`;

export const UPDATE_INSTRUCTIONS = gql`
  mutation updateInstructions(
    $authorId: ID!
    $recipeId: ID!
    $instructions: [InstructionInput!]!
  ) {
    updateInstructions(
      authorId: $authorId
      recipeId: $recipeId
      instructions: $instructions
    ) {
      instruction
      instructionId
    }
  }
`;

export const UPDATE_NOTES = gql`
  mutation updateNotes($authorId: ID!, $recipeId: ID!, $notes: [NoteInput!]!) {
    updateNotes(authorId: $authorId, recipeId: $recipeId, notes: $notes) {
      note
      noteId
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($authorId: ID!, $recipeId: ID!) {
    deleteRecipe(authorId: $authorId, recipeId: $recipeId)
  }
`;
