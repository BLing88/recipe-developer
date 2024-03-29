const AWS = require("aws-sdk");
import {
  buildTestRecipe,
  buildTestIngredients,
  buildTestInstructions,
  buildTestNotes,
  buildTestUser,
} from "generate";
import faker from "faker";
import {
  nameOfRecipe,
  ingredientsOfRecipe,
  instructionsOfRecipe,
  notesOfRecipe,
} from "recipe";

const {
  getRecipeById,
  updateRecipe,
  getAllRecipesById,
  deleteRecipe,
} = require("../dynamodb");

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
  return { ...recipe };
};

const separateRecipe = (recipeResponse) => {
  const {
    recipeName,
    recipeId,
    authorId,
    ingredients,
    instructions,
    notes,
    lastModifiedOn,
    createdOn,
  } = recipeResponse;
  return [
    {
      recipeName,
      recipeId,
      authorId,
      ingredients,
      instructions,
      notes,
      createdOn,
    },
    lastModifiedOn,
  ];
};

describe("DynamoDB", () => {
  test("creates and gets new recipe", async () => {
    const baseRecipe = buildTestRecipe();
    const recipe = {
      ...baseRecipe,
      createdOn: Date.now(),
    };
    const beforeCreate = await getRecipeById({ ...recipe, db: dynamoDB });
    expect(beforeCreate).not.toBeDefined();
    const updateResult = await updateRecipe({
      ...recipe,
      db: dynamoDB,
    });
    const getResult = await getRecipeById({
      ...recipe,
      db: dynamoDB,
    });
    const [newRecipe, lastModifiedOn] = separateRecipe(getResult);
    expect(newRecipe).toEqual(recipe);
    expect(newRecipe.createdOn < lastModifiedOn).toBe(true);
    expect(updateResult).toEqual(getResult);
  });

  test("updates name of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newName = faker.commerce.productName();
    const newRecipe = { ...oldRecipe, recipeName: newName };

    const updatedRecipeResponse = await updateRecipe(newRecipe);
    const [updatedRecipe, lastModifiedOn] = separateRecipe(
      updatedRecipeResponse
    );

    expect(updatedRecipe).toEqual(newRecipe);
    expect(
      updatedRecipe.createdOn < lastModifiedOn && lastModifiedOn < Date.now()
    );
    expect(nameOfRecipe(updatedRecipe)).not.toEqual(nameOfRecipe(oldRecipe));
  });

  test("updates ingredients of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newIngredients = buildTestIngredients();
    const newRecipe = { ...oldRecipe, ingredients: newIngredients };

    const [updatedRecipe, lastModifiedOn] = separateRecipe(
      await updateRecipe(newRecipe)
    );
    expect(updatedRecipe).toEqual(newRecipe);
    expect(
      updatedRecipe.createdOn < lastModifiedOn && lastModifiedOn < Date.now()
    );
    expect(ingredientsOfRecipe(updatedRecipe)).not.toEqual(
      ingredientsOfRecipe(oldRecipe)
    );
  });

  test("updates instructions of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newInstructions = buildTestInstructions();
    const newRecipe = { ...oldRecipe, instructions: newInstructions };

    const [updatedRecipe, lastModifiedOn] = separateRecipe(
      await updateRecipe(newRecipe)
    );
    expect(updatedRecipe).toEqual(newRecipe);
    expect(
      updatedRecipe.createdOn < lastModifiedOn && lastModifiedOn < Date.now()
    );
    expect(instructionsOfRecipe(updatedRecipe)).not.toEqual(
      instructionsOfRecipe(oldRecipe)
    );
  });

  test("updates notes of existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const newNotes = buildTestNotes();
    const newRecipe = { ...oldRecipe, notes: newNotes };

    const [updatedRecipe, lastModifiedOn] = separateRecipe(
      await updateRecipe(newRecipe)
    );
    expect(updatedRecipe).toEqual(newRecipe);
    expect(
      updatedRecipe.createdOn < lastModifiedOn && lastModifiedOn < Date.now()
    );
    expect(notesOfRecipe(updatedRecipe)).not.toEqual(notesOfRecipe(oldRecipe));
  });

  test("gets all recipes by a user", async () => {
    const user = buildTestUser();
    const recipes = user.recipes;
    for (let recipe of recipes) {
      await updateRecipe({ ...recipe, db: dynamoDB });
    }
    const allRecipes = await getAllRecipesById({ authorId: user.userId });
    const projectedAllRecipes = allRecipes.map(
      (recipe) => separateRecipe(recipe)[0]
    );
    expect(recipes).toEqual(expect.arrayContaining(projectedAllRecipes));
    expect(projectedAllRecipes).toEqual(expect.arrayContaining(recipes));
    expect(recipes.length).toEqual(projectedAllRecipes.length);
  });

  test("deletes existing recipe", async () => {
    const oldRecipe = await setExistingRecipe();
    const beforeDelete = await getRecipeById({ ...oldRecipe, db: dynamoDB });
    const wasDeleted = await deleteRecipe({ ...oldRecipe, db: dynamoDB });
    expect(wasDeleted).toEqual(beforeDelete);
    const checkDeleted = await getRecipeById({ ...beforeDelete, db: dynamoDB });
    expect(checkDeleted).not.toBeDefined();
  });
});
