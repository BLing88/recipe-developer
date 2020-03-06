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

const updateIngredients = async (_, { authorId, recipeId, ingredients }) => {
  const res = await updateRecipe({
    authorId,
    recipeId,
    ingredients,
  });
  return res.ingredients;
};

const updateInstructions = async (_, { authorId, recipeId, instructions }) => {
  const res = await updateRecipe({
    authorId,
    recipeId,
    instructions,
  });
  return res.instructions;
};

const updateNotes = async (_, { authorId, recipeId, notes }) => {
  const res = await updateRecipe({
    authorId,
    recipeId,
    notes,
  });
  return res.notes;
};

module.exports = {
  createRecipe,
  updateRecipeName,
  updateIngredients,
  updateInstructions,
  updateNotes,
};
