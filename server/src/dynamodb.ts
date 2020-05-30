import AWS from "aws-sdk";

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB =
  process.env.NODE_ENV !== "test"
    ? new AWS.DynamoDB.DocumentClient()
    : new AWS.DynamoDB.DocumentClient(localDevConfig);

const RECIPE_TABLE =
  process.env.NODE_ENV !== "test"
    ? process.env.RECIPE_TABLE
    : `recipe-developer-recipes-dev-${process.env.PORT}`;

interface DBParameters {
  authorId: string;
  recipeId: string;
  recipeName?: string;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  notes?: Note[];
  db: AWS.DynamoDB.DocumentClient;
}

export const getAllRecipesById = ({
  authorId,
  db = dynamoDB,
}: {
  authorId: string;
  db: AWS.DynamoDB.DocumentClient;
}) => {
  const filterParams = {
    TableName: RECIPE_TABLE!,
    KeyConditionExpression: "authorId = :authorId",
    ExpressionAttributeValues: {
      ":authorId": authorId,
    },
  };

  return new Promise((resolve, reject) => {
    db.query(filterParams, (err, items) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(items.Items);
      }
    });
  });
};

export const getRecipeById = ({
  authorId,
  recipeId,
  db = dynamoDB,
}: DBParameters) => {
  return new Promise((resolve, reject) => {
    db.get(
      {
        TableName: RECIPE_TABLE!,
        Key: {
          recipeId,
          authorId,
        },
        ReturnValues: "ALL_NEW",
      } as AWS.DynamoDB.GetItemInput,
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data.Item);
        }
      }
    );
  });
};

export const updateRecipe = ({
  authorId,
  recipeId,
  recipeName,
  ingredients,
  instructions,
  notes,
  db = dynamoDB,
}: DBParameters) => {
  const newRecipeName = recipeName ? "recipeName=:recipeName, " : "";
  const newIngredients = ingredients ? "ingredients=:ingredients, " : "";
  const newInstructions = instructions ? "instructions=:instructions, " : "";
  const newNotes = notes ? "notes=:notes, " : "";
  const UpdateExpressionString = `set ${newRecipeName}${newIngredients}${newInstructions}${newNotes}`.slice(
    0,
    -2
  );

  const ExpressionAttributeValues = {
    ...(newRecipeName && { ":recipeName": recipeName }),
    ...(newIngredients && { ":ingredients": ingredients }),
    ...(newInstructions && { ":instructions": instructions }),
    ...(newNotes && { ":notes": notes }),
  };

  return new Promise((resolve, reject) => {
    const updateParams = {
      TableName: RECIPE_TABLE!,
      Key: {
        recipeId,
        authorId,
      },
      ReturnValues: "ALL_NEW",
      UpdateExpression: UpdateExpressionString,
      ExpressionAttributeValues,
    };
    db.update(updateParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data.Attributes);
      }
    });
  });
};

export const deleteRecipe = ({
  authorId,
  recipeId,
  db = dynamoDB,
}: DBParameters) => {
  const deleteParams = {
    TableName: RECIPE_TABLE!,
    Key: {
      recipeId,
      authorId,
    },
    ReturnValues: "ALL_OLD",
  };
  return new Promise((resolve, reject) => {
    db.delete(deleteParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data.Attributes);
      }
    });
  });
};
