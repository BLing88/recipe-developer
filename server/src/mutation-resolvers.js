const { updateRecipe } = require("./dynamodb");

const createRecipe = async (_, { recipeInput }) => {
  return await updateRecipe(recipeInput);
};

const updateRecipeName = async (_, { authorId, recipeId, newRecipeName }) => {
  const res = await updateRecipe({
    authorId,
    recipeId,
    recipeName: newRecipeName,
  });
  return res.recipeName;
};

module.exports = {
  createRecipe,
  updateRecipeName,
};
