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
import {
  CREATE_RECIPE,
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
const authorizedContext = server.context({
  event: {
    headers: {
      Authorization: `Bearer ${process.env.VALID_TOKEN}`,
    },
  },
});

// Need to create test server this way so that we can pass in headers, otherwise
// createTestClient will pass in empty object into context creator function
const { query, mutate } = createTestClient(
  Object.assign(testServer, server, { context: () => authorizedContext })
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

describe("server - for authorized users", () => {
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
    const targetRecipeId = targetRecipe.recipeId;
    const beforeChangeNameRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(beforeChangeNameRes.data.getRecipe.recipeName).not.toBe(
      newRecipeName
    );

    const changeNameRes = await mutate({
      mutation: UPDATE_RECIPE_NAME,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
        newRecipeName,
      },
    });
    expect(changeNameRes.data.updateRecipeName).toEqual(newRecipeName);

    const checkChangeNameRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(checkChangeNameRes.data.getRecipe).toEqual({
      ...targetRecipe,
      recipeName: newRecipeName,
    });
  });

  test("updates just ingredients", async () => {
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
    const updatedIngredients = updateIngredientsRes.data.updateIngredients;

    expect(updatedIngredients.length).toBe(newIngredients.length);
    expect(updatedIngredients).toEqual(expect.arrayContaining(newIngredients));
    expect(newIngredients).toEqual(expect.arrayContaining(updatedIngredients));

    const checkUpdatedIngredientsRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    const updatedResIngredients =
      checkUpdatedIngredientsRes.data.getRecipe.ingredients;
    expect(updatedResIngredients.length).toBe(newIngredients.length);
    expect(updatedResIngredients).toEqual(
      expect.arrayContaining(newIngredients)
    );
    expect(newIngredients).toEqual(
      expect.arrayContaining(updatedResIngredients)
    );
  });

  test("updates just instructions", async () => {
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
    const updatedInstructions = updateInstructionsRes.data.updateInstructions;

    expect(updatedInstructions.length).toBe(newInstructions.length);
    expect(updatedInstructions).toEqual(
      expect.arrayContaining(newInstructions)
    );
    expect(newInstructions).toEqual(
      expect.arrayContaining(updatedInstructions)
    );

    const checkUpdatedInstructionsRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    const updatedResInstructions =
      checkUpdatedInstructionsRes.data.getRecipe.instructions;
    expect(updatedResInstructions.length).toBe(newInstructions.length);
    expect(updatedResInstructions).toEqual(
      expect.arrayContaining(newInstructions)
    );
    expect(newInstructions).toEqual(
      expect.arrayContaining(updatedResInstructions)
    );
  });

  test("updates just notes", async () => {
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
    const updatedNotes = updateNotesRes.data.updateNotes;

    expect(updatedNotes.length).toBe(newNotes.length);
    expect(updatedNotes).toEqual(expect.arrayContaining(newNotes));
    expect(newNotes).toEqual(expect.arrayContaining(updatedNotes));

    const checkUpdatedNotesRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    const updatedResNotes = checkUpdatedNotesRes.data.getRecipe.notes;
    expect(updatedResNotes.length).toBe(newNotes.length);
    expect(updatedResNotes).toEqual(expect.arrayContaining(newNotes));
    expect(newNotes).toEqual(expect.arrayContaining(updatedResNotes));
  });

  test("deletes recipe", async () => {
    const targetRecipe = testRecipes[0];
    const targetRecipeId = targetRecipe.recipeId;

    const beforeDeleteRecipeRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(beforeDeleteRecipeRes.data.getRecipe).toEqual(targetRecipe);

    const deleteRes = await mutate({
      mutation: DELETE_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(deleteRes.data.deleteRecipe).toEqual(targetRecipeId);

    const afterDeleteRecipeRes = await query({
      query: GET_RECIPE,
      variables: {
        authorId: testAuthorId,
        recipeId: targetRecipeId,
      },
    });
    expect(afterDeleteRecipeRes.data.getRecipe).toBeNull();
  });
});
