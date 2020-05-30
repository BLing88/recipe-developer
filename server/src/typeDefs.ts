export const typeDefsString = `
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

  type Mutation {
    createRecipe(authorId: ID!, recipeInput: RecipeInput!): Recipe
    updateRecipe(
      authorId: ID!,
      recipeId: ID!,
      recipeName: String,
      ingredients: [IngredientInput!]
    instructions: [InstructionInput!]
    notes: [NoteInput!]
    ): Recipe
    updateRecipeName(authorId: ID!, recipeId: ID!, newRecipeName: String!): String
    updateIngredients(authorId: ID!, recipeId: ID!, ingredients: [IngredientInput!]!): [Ingredient]
    updateInstructions(authorId: ID!, recipeId: ID!, instructions: [InstructionInput!]!): [Instruction]
    updateNotes(authorId: ID!, recipeId: ID!, notes: [NoteInput!]!): [Note]
    deleteRecipe(authorId: ID!, recipeId: ID!): String
  }

  input RecipeInput {
    recipeId: ID!
    recipeName: String!
    authorId: ID!
    ingredients: [IngredientInput!]!
    instructions: [InstructionInput!]!
    notes: [NoteInput!]!
  }

  input IngredientInput {
    ingredientId: ID!
    ingredient: String!
  }

  input InstructionInput {
    instructionId: ID!
    instruction: String!
  }

  input NoteInput {
    noteId: ID!
    note: String!
  }
`;
