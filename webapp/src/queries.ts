import gql from "graphql-tag";

export const GET_RECIPE = gql`
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

export const GET_ALL_RECIPES = gql`
  query getAllRecipes($authorId: ID!) {
    getAllRecipes(authorId: $authorId) {
      recipeName
      recipeId
      lastModifiedOn
      createdOn
    }
  }
`;
