const AWS = require("aws-sdk");
const { db } = require("./static-db");

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient(localDevConfig);
const RECIPE_TABLE = `recipe-developer-recipes-dev-${process.env.PORT}`;
const USER_TABLE = `recipe-developer-users-dev-${process.env.PORT}`;

const getAllRecipesById = ({ userId, db = dynamoDB }) => {
  const filterParams = {
    TableName: RECIPE_TABLE,
    KeyConditionExpression: "authorId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
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

const getRecipeById = ({ authorId, recipeId, db = dynamoDB }) => {
  return new Promise((resolve, reject) => {
    db.get(
      {
        TableName: RECIPE_TABLE,
        Key: {
          recipeId,
          authorId,
        },
        ReturnValues: "ALL_NEW",
      },
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

const updateRecipe = ({
  authorId,
  recipeName,
  recipeId,
  ingredients,
  instructions,
  notes,
  db = dynamoDB,
}) => {
  return new Promise((resolve, reject) => {
    const updateParams = {
      TableName: RECIPE_TABLE,
      Key: {
        recipeId,
        authorId,
      },
      ReturnValues: "ALL_NEW",
      UpdateExpression:
        "set recipeName=:recipeName, ingredients=:ingredients, instructions=:instructions, notes=:notes",
      ExpressionAttributeValues: {
        ":recipeName": recipeName,
        ":ingredients": ingredients,
        ":instructions": instructions,
        ":notes": notes,
      },
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

const deleteRecipe = ({ authorId, recipeId, db = dynamoDB }) => {
  const deleteParams = {
    TableName: RECIPE_TABLE,
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

module.exports = {
  getAllRecipesById,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
