import { createTestClient } from "apollo-server-testing";
import { updateRecipe } from "../dynamodb";
import AWS from "aws-sdk";
import faker from "faker";
import { buildArray, buildTestRecipe } from "generate";
import { GET_RECIPE, GET_ALL_RECIPES } from "../queries";
import { CREATE_RECIPE, UPDATE_RECIPE_NAME } from "../mutations";
import { server } from "../graphql";

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient(localDevConfig);
const db = new AWS.DynamoDB(localDevConfig);

const testAuthorId = faker.random.uuid();
let testRecipes = [];

const { query, mutate } = createTestClient(server);

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
  test("gets recipe by author and recipe ids", async () => {
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

  test("gets all recipes for a user", async () => {
    const res = await query({
      query: GET_ALL_RECIPES,
      variables: {
        authorId: testAuthorId,
      },
    });

    const resRecipes = res.data.getAllRecipes;
    const expectedResult = testRecipes.map(recipe => ({
      recipeId: recipe.recipeId,
      recipeName: recipe.recipeName,
    }));
    expect(resRecipes.length).toBe(testRecipes.length);
    expect(resRecipes).toEqual(expect.arrayContaining(expectedResult));
    expect(expectedResult).toEqual(expect.arrayContaining(resRecipes));
  });

  test("adds new recipe to db", async () => {
    const newRecipe = buildTestRecipe({ authorId: testAuthorId });
    const beforeCreateRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: newRecipe.recipeId,
      },
    });
    expect(beforeCreateRes.data.getRecipe).toBeNull();
    const numRecipesBeforeRes = await query({
      query: GET_ALL_RECIPES,
      variables: {
        authorId: testAuthorId,
      },
    });
    const numRecipesBefore = numRecipesBeforeRes.data.getAllRecipes.length;

    const createRes = await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        recipeInput: newRecipe,
      },
    });
    expect(createRes.data.createRecipe).toEqual(newRecipe);

    const numRecipesAfterRes = await query({
      query: GET_ALL_RECIPES,
      variables: {
        authorId: testAuthorId,
      },
    });
    const numRecipesAfter = numRecipesAfterRes.data.getAllRecipes.length;
    expect(numRecipesAfter).toBe(numRecipesBefore + 1);

    const checkCreateQuery = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: newRecipe.recipeId,
      },
    });
    expect(checkCreateQuery.data.getRecipe).toEqual(newRecipe);
  });

  test("updates just recipe name", async () => {
    const newRecipeName = `New ${faker.commerce.productName()}`;
    const targetRecipe = testRecipes[0];
    const beforeChangeNameRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipe.recipeId,
      },
    });
    expect(beforeChangeNameRes.data.getRecipe.recipeName).not.toBe(
      newRecipeName
    );

    const changeNameRes = await mutate({
      mutation: UPDATE_RECIPE_NAME,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipe.recipeId,
        newRecipeName,
      },
    });
    expect(changeNameRes.data.updateRecipeName).toEqual(newRecipeName);

    const checkChangeNameRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipe.recipeId,
      },
    });
    expect(checkChangeNameRes.data.getRecipe).toEqual({
      ...targetRecipe,
      recipeName: newRecipeName,
    });
  });
});