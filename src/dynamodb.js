const AWS = require("aws-sdk");
const { db } = require("./static-db");

const localDevConfig = {
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient(localDevConfig);

const getAllRecipesById = authorId => {
  return new Promise(resolve =>
    resolve(db.filter(recipe => recipe.author === authorId))
  );
};

const getRecipe = ({ authorId, recipeId, db = dynamoDB }) => {
  return new Promise((resolve, reject) => {
    db.get(
      {
        TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
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
      TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
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

module.exports = {
  getAllRecipesById,
  getRecipe,
  updateRecipe,
};
