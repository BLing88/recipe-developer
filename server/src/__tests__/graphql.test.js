const { ApolloServer, gql } = require("apollo-server-lambda");
const { createTestClient } = require("apollo-server-testing");
const { getAllRecipes, getRecipe } = require("../query-resolvers");
import { updateRecipe } from "../dynamodb";
const AWS = require("aws-sdk");
import faker from "faker";
import { buildArray, buildTestRecipe } from "generate";
import { GET_RECIPE } from "../queries";

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient(localDevConfig);
const db = new AWS.DynamoDB(localDevConfig);

const { typeDefsString } = require("../typeDefs");
const typeDefs = gql`
  ${typeDefsString}
`;
const resolvers = {
  Query: {
    getAllRecipes,
    getRecipe,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const testAuthorId = faker.random.uuid();
let testRecipes = [];

const setExistingRecipes = async () => {
  const numberOfRecipes = 1 + faker.random.number(15);
  const recipes = buildArray(numberOfRecipes, () =>
    buildTestRecipe({
      authorId: testAuthorId,
    })
  );
  for (let recipe of recipes) {
    await updateRecipe({
      ...recipe,
      db: dynamoDB,
    });
  }
  testRecipes = recipes;
};

beforeEach(async () => {
  const tableParams = {
    TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
    AttributeDefinitions: [
      {
        AttributeName: "authorId",
        AttributeType: "S",
      },
      {
        AttributeName: "recipeId",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "authorId",
        KeyType: "HASH",
      },
      {
        AttributeName: "recipeId",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };
  await new Promise((resolve, reject) => {
    db.createTable(tableParams, (err, data) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  await setExistingRecipes();
});

afterEach(async () => {
  testRecipes = [];
  await new Promise((resolve, reject) => {
    db.deleteTable(
      {
        TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
      },
      (err, data) => {
        if (err && err.code === "ResourceNotFoundException") {
          console.log("Error: Table not found");
          reject(err);
        } else if (err && err.code === "ResourceInUseException") {
          console.log("Error: Table in use");
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
});

describe("server", () => {
  test("gets a recipe by author and recipe ids", async () => {
    const { query } = createTestClient(server);
    for (let recipe of testRecipes) {
      const res = await query({
        query: GET_RECIPE,
        variables: {
          authorId: testAuthorId,
          recipeId: recipe.recipeId,
        },
      });
      expect(res.data.getRecipe).toEqual(recipe);
    }
  });
});
