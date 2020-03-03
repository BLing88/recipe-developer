const { getRecipe, updateRecipe } = require("../dynamodb");
const AWS = require("aws-sdk");

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

test("set recipe", async () => {
  await updateRecipe({
    author: "test author",
    name: "test recipe",
    id: "1",
    db: dynamoDB,
  });
  const result = await getRecipe({ authorId: "test author", recipeId: "1" });
  console.log(result.Item);
});
