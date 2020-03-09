import { createTestClient } from "apollo-server-testing";
import { updateRecipe } from "../dynamodb";
import AWS from "aws-sdk";
import faker from "faker";
import {
  buildArray,
  buildTestRecipe,
  buildTestIngredients,
  buildTestInstructions,
  buildTestNotes,
} from "generate";
import { GET_RECIPE, GET_ALL_RECIPES } from "../queries";
import { authorOfRecipe, idOfRecipe } from "recipe";
import {
  CREATE_RECIPE,
  UPDATE_RECIPE,
  UPDATE_RECIPE_NAME,
  UPDATE_INGREDIENTS,
  UPDATE_INSTRUCTIONS,
  UPDATE_NOTES,
  DELETE_RECIPE,
} from "../mutations";
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

const testServer = Object.create(Object.getPrototypeOf(server));
const unauthorizedContext = server.context({
  event: {
    headers: {
      Authorization: `Bearer invalid.test.token.asdf`,
    },
  },
});
// Need to create test server this way so that we can pass in headers, otherwise
// createTestClient will pass in empty object into context creator function
const { query, mutate } = createTestClient(
  Object.assign(testServer, server, { context: () => unauthorizedContext })
);

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

describe("server - for unauthorized users", () => {
  test("returns null getting recipe by author and recipe ids", async () => {
    for (let recipe of testRecipes) {
      const res = await query({
        query: GET_RECIPE,
        variables: {
          authorId: testAuthorId,
          recipeId: recipe.recipeId,
        },
      });
      expect(res.errors).toBeDefined();
      expect(res.data.getRecipe).toBeNull();
    }
  });

  test("returns null getting all recipes for a user", async () => {
    const res = await query({
      query: GET_ALL_RECIPES,
      variables: {
        authorId: testAuthorId,
      },
    });
    expect(
      res.errors.map(err => err.message).includes(`You are not authorized`)
    ).toBe(true);
    expect(res.data).toBeNull();
  });

  test("returns null adding new recipe to db", async () => {
    const newRecipe = buildTestRecipe({ authorId: testAuthorId });
    const createRes = await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        recipeInput: newRecipe,
        authorId: testAuthorId,
      },
    });
    expect(createRes.data.createRecipe).toBeNull();
    expect(
      createRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null updating recipe name", async () => {
    const newRecipeName = `New ${faker.commerce.productName()}`;
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;
    const changeNameRes = await mutate({
      mutation: UPDATE_RECIPE_NAME,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
        newRecipeName,
      },
    });
    expect(changeNameRes.data.updateRecipeName).toBeNull();
    expect(
      changeNameRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null updating ingredients", async () => {
    const newIngredients = buildTestIngredients();
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;
    const updateIngredientsRes = await mutate({
      mutation: UPDATE_INGREDIENTS,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
        ingredients: newIngredients,
      },
    });

    expect(updateIngredientsRes.data.updateIngredients).toBeNull();
    expect(
      updateIngredientsRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null updating instructions", async () => {
    const newInstructions = buildTestInstructions();
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;
    const updateInstructionsRes = await mutate({
      mutation: UPDATE_INSTRUCTIONS,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
        instructions: newInstructions,
      },
    });
    expect(updateInstructionsRes.data.updateInstructions).toBeNull();
    expect(
      updateInstructionsRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null updating notes", async () => {
    const newNotes = buildTestNotes();
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;
    const updateNotesRes = await mutate({
      mutation: UPDATE_NOTES,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
        notes: newNotes,
      },
    });
    expect(updateNotesRes.data.updateNotes).toBeNull();
    expect(
      updateNotesRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null deleting a recipe", async () => {
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;
    const deleteRes = await mutate({
      mutation: DELETE_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(deleteRes.data.deleteRecipe).toBeNull();
    expect(
      deleteRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });

  test("returns null updating existing recipe", async () => {
    const targetRecipe = testRecipes[0];
    const targetRecipeId = idOfRecipe(targetRecipe);
    const newRecipe = buildTestRecipe({
      authorId: authorOfRecipe(targetRecipe),
      recipeId: targetRecipeId,
    });

    const updateRecipeRes = await mutate({
      mutation: UPDATE_RECIPE,
      variables: {
        ...newRecipe,
      },
    });
    expect(updateRecipeRes.data.updateRecipe).toBeNull();
    expect(
      updateRecipeRes.errors
        .map(err => err.message)
        .includes(`You are not authorized`)
    ).toBe(true);
  });
});
