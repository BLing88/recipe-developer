const { gql } = require("apollo-server-lambda");

const CREATE_RECIPE = gql`
  mutation createRecipe($recipeInput: RecipeInput!) {
    createRecipe(recipeInput: $recipeInput) {
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

module.exports = {
  CREATE_RECIPE,
  UPDATE_RECIPE_NAME,
  UPDATE_INGREDIENTS,
};
