const { gql } = require("apollo-server-lambda");

const CREATE_RECIPE = `
    mutation createRecipe($recipeInput: RecipeInput!) {
        createRecipe(recipeInput: $recipeInput) {
            recipeName
            recipeId
            authorId
            ingredients {
                ingredient
                ingredientId
            }
            instructions {
                instruction
                instructionId
            }
            notes {
                note
                noteId
            }
        }
    }
`;

module.exports = {
  CREATE_RECIPE,
};
