const { ApolloServer, gql } = require("apollo-server-lambda");
const { getAllRecipes, getRecipe } = require("./query-resolvers");
const {
  createRecipe,
  updateRecipe,
  updateRecipeName,
  updateIngredients,
  updateInstructions,
  updateNotes,
  deleteRecipe,
} = require("./mutation-resolvers");

const { typeDefsString } = require("./typeDefs");
const typeDefs = gql`
  ${typeDefsString}
`;

const resolvers = {
  Query: {
    getAllRecipes,
    getRecipe,
  },
  Mutation: {
    createRecipe,
    updateRecipe,
    updateRecipeName,
    updateIngredients,
    updateInstructions,
    updateNotes,
    deleteRecipe,
  },
};

const createContext = ({ event }) => {
  const accessToken = event.headers.Authorization || "";

  return {
    accessToken,
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

const handler = server.createHandler({
  cors: {
    origin: "*", // for security in production, lock this to your real endpoints
    credentials: true,
    // By default, the GraphQL Playground interface and GraphQL introspection
    // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
    //
    // If you'd like to have GraphQL Playground and introspection enabled in production,
    // the `playground` and `introspection` options must be set explicitly to `true`.
    playground: true,
    introspection: true,
  },
});

module.exports = {
  handler,
  server,
};
