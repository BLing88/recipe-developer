const { db } = require("./static-db");

const getAllRecipesById = authorId => {
  return new Promise(resolve =>
    resolve(db.filter(recipe => recipe.author === authorId))
  );
};

const getRecipe = recipeId => {
  return new Promise(resolve =>
    resolve(db.find(recipe => recipe.id === recipeId))
  );
};

module.exports = {
  getAllRecipesById,
  getRecipe,
};
