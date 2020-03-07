import gql from "graphql-tag";

const GET_RECIPE = gql`
  query getRecipe($authorId: ID!, $recipeId: ID!) {
    getRecipe(authorId: $authorId, recipeId: $recipeId) {
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

const GET_ALL_RECIPES = gql`
  query getAllRecipes($authorId: ID!) {
    getAllRecipes(authorId: $authorId) {
      recipeName
      recipeId
    }
  }
`;

module.exports = {
  GET_RECIPE,
  GET_ALL_RECIPES,
};
