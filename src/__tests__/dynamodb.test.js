const { getRecipe, updateRecipe } = require("../dynamodb");
const AWS = require("aws-sdk");
import {
  buildTestRecipe,
  buildTestIngredients,
  buildTestInstructions,
  buildTestNotes,
} from "generate";
import faker from "faker";
import {
  nameOfRecipe,
  ingredientsOfRecipe,
  instructionsOfRecipe,
  notesOfRecipe,
} from "recipe";

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient(localDevConfig);
const db = new AWS.DynamoDB(localDevConfig);

beforeEach(async () => {
  const tableParams = {
    TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
    AttributeDefinitions: [
      {
        AttributeName: "recipeId",
        AttributeType: "S",
      },
      {
        AttributeName: "authorId",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "recipeId",
        KeyType: "HASH",
      },
      {
        AttributeName: "authorId",
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
});

afterEach(async () => {
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

const setExistingRecipe = async () => {
  const recipe = buildTestRecipe();
  await updateRecipe({
    ...recipe,
    db: dynamoDB,
  });
  return recipe;
};

describe("DynamoDB", () => {
  test("set and get recipe", async () => {
    const recipe = buildTestRecipe();
    const updateResult = await updateRecipe({
      ...recipe,
      db: dynamoDB,
    });
    const getResult = await getRecipe({ ...recipe });
    expect(updateResult).toEqual(getResult);
    expect(updateResult).toEqual(recipe);
  });

  test("updates name of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newName = faker.commerce.productName();
    const newRecipe = { ...oldRecipe, recipeName: newName };

    const updatedRecipe = await updateRecipe(newRecipe);
    expect(updatedRecipe).toEqual(newRecipe);
    expect(nameOfRecipe(updatedRecipe)).not.toEqual(nameOfRecipe(oldRecipe));
  });

  test("updates ingredients of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newIngredients = buildTestIngredients();
    const newRecipe = { ...oldRecipe, ingredients: newIngredients };

    const updatedRecipe = await updateRecipe(newRecipe);
    expect(updatedRecipe).toEqual(newRecipe);
    expect(ingredientsOfRecipe(updatedRecipe)).not.toEqual(
      ingredientsOfRecipe(oldRecipe)
    );
  });

  test("updates instructions of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newInstructions = buildTestInstructions();
    const newRecipe = { ...oldRecipe, instructions: newInstructions };

    const updatedRecipe = await updateRecipe(newRecipe);
    expect(updatedRecipe).toEqual(newRecipe);
    expect(instructionsOfRecipe(updatedRecipe)).not.toEqual(
      instructionsOfRecipe(oldRecipe)
    );
  });

  test("updates notes of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newNotes = buildTestNotes();
    const newRecipe = { ...oldRecipe, notes: newNotes };

    const updatedRecipe = await updateRecipe(newRecipe);
    expect(updatedRecipe).toEqual(newRecipe);
    expect(notesOfRecipe(updatedRecipe)).not.toEqual(notesOfRecipe(oldRecipe));
  });
});
