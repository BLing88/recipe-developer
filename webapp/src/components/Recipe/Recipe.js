import React, { useReducer } from "react";
import PropTypes from "prop-types";
import "./Recipe.css";
import { Ingredients } from "../Ingredients";
import { Instructions } from "../Instructions";
import { Notes } from "../Notes";
import {
  nameOfRecipe,
  buildIngredient,
  getIngredientOf,
  idOfIngredient,
} from "../../utils/recipe";
import { InputForm } from "../InputForm";

const EDITING_NAME = "EDITING_NAME";
const UPDATE_RECIPE_NAME_INPUT = "UPDATE_RECIPE_NAME_INPUT";
const EDITING_INGREDIENTS = "EDITING_INGREDIENTS";
const UPDATE_INGREDIENTS_INPUT = "UPDATE_INGREDIENTS_INPUT";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const DELETE_INGREDIENT = "DELETE_INGREDIENT";

// const EDITING_INSTRUCTIONS = "EDITING_INSTRUCTIONS";
// const EDITING_NOTES = "EDITING_NOTES";

const initialState = recipe => {
  return {
    editName: false,
    recipeName: nameOfRecipe(recipe),
    editIngredients: false,
    ingredients: [...recipe.ingredients],
  };
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case EDITING_NAME:
      return {
        ...state,
        editName: true,
      };
    case UPDATE_RECIPE_NAME_INPUT:
      return {
        ...state,
        recipeName: action.recipeName,
      };
    case EDITING_INGREDIENTS:
      return {
        ...state,
        editIngredients: true,
      };
    case UPDATE_INGREDIENTS_INPUT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, action.ingredientNumber),
          action.ingredient,
          ...state.ingredients.slice(action.ingredientNumber + 1),
        ],
      };
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, buildIngredient("")],
      };
    case DELETE_INGREDIENT:
      const numOfIngredients = state.ingredients.length;
      return {
        ...state,
        ingredients:
          numOfIngredients === 1
            ? [buildIngredient("")]
            : [
                ...state.ingredients.slice(0, action.targetIngredient),
                ...state.ingredients.slice(action.targetIngredient + 1),
              ],
      };
    default:
      return {
        ...state,
      };
  }
};

const Recipe = ({ recipe, updateHandler }) => {
  const { recipeName, ingredients, instructions, notes } = recipe;
  const [state, dispatch] = useReducer(recipeReducer, recipe, initialState);

  const ingredientInputChangeHandler = (e, ingredient, index) => {
    e.preventDefault();
    const newIngredient = ingredient.ingredientId
      ? {
          ingredient: e.target.value,
          ingredientId: ingredient.ingredientId,
        }
      : buildIngredient(e.target.value);
    dispatch({
      type: UPDATE_INGREDIENTS_INPUT,
      ingredientNumber: index,
      ingredient: newIngredient,
    });
  };

  return (
    <article className="recipe">
      {!state.editName ? (
        <h1
          onClick={() => dispatch({ type: EDITING_NAME })}
          className="recipe-name"
        >
          {recipeName}
        </h1>
      ) : (
        <>
          <label htmlFor="recipe-name">Recipe name</label>
          <input
            id="recipe-name"
            type="text"
            value={state.recipeName}
            onChange={e => {
              e.preventDefault();
              dispatch({
                type: UPDATE_RECIPE_NAME_INPUT,
                recipeName: e.target.value,
              });
            }}
            required
          />
        </>
      )}
      {/* <picture className="recipe-image">
        <img src={require("../../assets/gimbap-mobile.png")} alt="gimbap" />
      </picture> */}
      {/* abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz */}
      {!state.editIngredients ? (
        <Ingredients
          onClick={() => dispatch({ type: EDITING_INGREDIENTS })}
          ingredients={ingredients}
        />
      ) : (
        <InputForm
          title={"Ingredients"}
          objectName={"ingredient"}
          objects={state.ingredients}
          getValueOfObject={getIngredientOf}
          getIdOfObject={idOfIngredient}
          inputChangeHandler={ingredientInputChangeHandler}
          addObjectHandler={e => {
            e.preventDefault();
            dispatch({ type: ADD_INGREDIENT });
          }}
          deleteObjectHandler={targetIndex => {
            dispatch({
              type: DELETE_INGREDIENT,
              targetIngredient: targetIndex,
            });
          }}
        />
        // <section>
        //   Ingredients
        //   <ul>
        //     {state.ingredients.map((ingredient, i) => {
        //       return (
        //         <li key={ingredient.ingredientId}>
        //           <label htmlFor={`recipe-ingredients-${i + 1}`}>
        //             ingredient {i + 1}:
        //           </label>
        //           <input
        //             id={`recipe-ingredients-${i + 1}`}
        //             type="text"
        //             value={ingredient.ingredient}
        //             onChange={e =>
        //               ingredientInputChangeHandler(e, ingredient, i)
        //             }
        //           />
        //           <div
        //             onClick={() =>
        //               dispatch({ type: DELETE_INGREDIENT, targetIngredient: i })
        //             }
        //             data-testid={`delete-ingredient-${i + 1}`}
        //           >
        //             delete
        //           </div>
        //         </li>
        //       );
        //     })}
        //   </ul>
        //   <button
        //     onClick={e => {
        //       e.preventDefault();
        //       dispatch({ type: ADD_INGREDIENT });
        //     }}
        //   >
        //     Add ingredient
        //   </button>
        // </section>
      )}
      <Instructions
        // onClick={() => setEditing(EDITING_INSTRUCTIONS)}
        instructions={instructions}
      />
      <Notes
        // onClick={() => setEditing(EDITING_NOTES)}
        notes={notes}
      />
    </article>
  );
};
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export { Recipe };
