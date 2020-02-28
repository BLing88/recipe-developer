const { ApolloServer, gql } = require("apollo-server-lambda");

const { allRecipes, recipe } = require("./queries");

const typeDefs = gql`
  type Recipe {
    id: ID!
    name: String!
    author: ID!
    ingredients: [Ingredient]!
    instructions: [Instruction]!
    notes: [Note]!
  }

  type Ingredient {
    id: ID!
    ingredient: String!
  }

  type Instruction {
    id: ID!
    instruction: String!
  }

  type Note {
    id: ID!
    note: String
  }

  type Query {
    allRecipes(authorId: ID!): [Recipe]!

    recipe(recipeId: ID!): Recipe
  }
`;

const resolvers = {
  Query: {
    allRecipes,
    recipe,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler({
  cors: {
    origin: "*", // for security in production, lock this to your real endpoints
    credentials: true,
  },
});

module.exports = {
  handler,
};
