import { APIGatewayProxyEvent } from "aws-lambda";
import { ApolloServer, gql } from "apollo-server-lambda";
import { getAllRecipes, getRecipe } from "./query-resolvers";
import {
  createRecipe,
  updateRecipe,
  updateRecipeName,
  updateIngredients,
  updateInstructions,
  updateNotes,
  deleteRecipe,
} from "./mutation-resolvers";

import { typeDefsString } from "./typeDefs";
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

const createContext = ({ event }: { event: APIGatewayProxyEvent }) => {
  const accessToken = event.headers.Authorization || "";

  return {
    accessToken,
  };
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

export const handler = server.createHandler({
  cors: {
    origin: "*", // for security in production, lock this to your real endpoints
    credentials: true,
    // By default, the GraphQL Playground interface and GraphQL introspection
    // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
    //
    // If you'd like to have GraphQL Playground and introspection enabled in production,
    // the `playground` and `introspection` options must be set explicitly to `true`.
    // playground: true,
    // introspection: true,
  },
});
