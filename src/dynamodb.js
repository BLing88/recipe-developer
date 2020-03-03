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
      },
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const updateRecipe = ({ author: authorId, id: recipeId, db = dynamoDB }) => {
  return new Promise((resolve, reject) => {
    const updateParams = {
      TableName: `recipe-developer-recipes-dev-${process.env.PORT}`,
      Key: {
        recipeId,
        authorId,
      },
      // ReturnValues: "ALL_NEW"
      // UpdateExpression: "set authorId = :authorId, recipeId = :recipeId",
      // ExpressionAttributeValues: {
      //   ":authorId": authorId,
      //   ":recipeId": recipeId,
      // },
    };
    db.update(updateParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  getAllRecipesById,
  getRecipe,
  updateRecipe,
};
