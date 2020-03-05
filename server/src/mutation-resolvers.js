const { updateRecipe } = require("./dynamodb");

const createRecipe = async (_, { recipeInput }) => {
  return await updateRecipe(recipeInput);
};

module.exports = {
  createRecipe,
};
