import gql from "graphql-tag";

const CREATE_RECIPE = gql`
  mutation createRecipe($recipeInput: RecipeInput!, $authorId: ID!) {
    createRecipe(recipeInput: $recipeInput, authorId: $authorId) {
      recipeName
      recipeId
      authorId
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

const UPDATE_RECIPE_NAME = gql`
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

const UPDATE_INGREDIENTS = gql`
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

const UPDATE_INSTRUCTIONS = gql`
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

const UPDATE_NOTES = gql`
  mutation updateNotes($authorId: ID!, $recipeId: ID!, $notes: [NoteInput!]!) {
    updateNotes(authorId: $authorId, recipeId: $recipeId, notes: $notes) {
      note
      noteId
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation deleteRecipe($authorId: ID!, $recipeId: ID!) {
    deleteRecipe(authorId: $authorId, recipeId: $recipeId)
  }
`;

module.exports = {
  CREATE_RECIPE,
  DELETE_RECIPE,
  UPDATE_RECIPE_NAME,
  UPDATE_INGREDIENTS,
  UPDATE_INSTRUCTIONS,
  UPDATE_NOTES,
};
