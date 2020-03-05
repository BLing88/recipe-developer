// const { gql } = require("apollo-server-lambda");
const typeDefsString = `
  type Recipe {
    recipeId: ID!
    recipeName: String!
    authorId: ID!
    ingredients: [Ingredient!]!
    instructions: [Instruction!]!
    notes: [Note!]!
  }

  type Ingredient {
    ingredientId: ID!
    ingredient: String!
  }

  type Instruction {
    instructionId: ID!
    instruction: String!
  }

  type Note {
    noteId: ID!
    note: String!
  }

  type Query {
    getAllRecipes(authorId: ID!): [Recipe!]!

    getRecipe(authorId: ID!, recipeId: ID!): Recipe
  }
`;

module.exports = {
  typeDefsString,
};
