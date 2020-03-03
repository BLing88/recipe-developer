const { getRecipe, updateRecipe } = require("../dynamodb");
const AWS = require("aws-sdk");
import { buildTestRecipe, buildTestIngredients } from "generate";
import faker from "faker";
import { nameOfRecipe, ingredientsOfRecipe } from "recipe";

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
    const recipe = buildTestRecipe();
    const newName = faker.commerce.productName();
    const newRecipe = { ...recipe, recipeName: newName };
    await updateRecipe({
      ...recipe,
      db: dynamoDB,
    });
    const updatedRecipe = await updateRecipe(newRecipe);
    expect(updatedRecipe).toEqual(newRecipe);
    expect(nameOfRecipe(updatedRecipe)).not.toEqual(nameOfRecipe(recipe));
  });

  test("updates ingredients of existing recipe", async () => {
    const recipe = buildTestRecipe();
    const newIngredients = buildTestIngredients();
    const newRecipe = { ...recipe, ingredients: newIngredients };
    await updateRecipe({
      ...recipe,
      db: dynamoDB,
    });
    const updatedRecipe = await updateRecipe(newRecipe);
    expect(ingredientsOfRecipe(updatedRecipe)).not.toEqual(
      ingredientsOfRecipe(recipe)
    );
  });
});
