import React from "react";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { nameOfRecipe } from "utils/recipe";

import { render, wait } from "@testing-library/react";
import {
  buildTestUser,
  buildArray,
  buildTestRecipe,
} from "test/utils/generate";
import testUser from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";

import { MockedProvider } from "@apollo/react-testing";
import gql from "graphql-tag";

const GET_USER_RECIPES = gql`
  query getAllRecipes($authorId: ID!) {
    getAllRecipes(authorId: $authorId) {
      recipeName
      recipeId
    }
  }
`;

const renderLoadedProfile = async (overrides = {}) => {
  const mockLogout = jest.fn().mockName("logout");
  const user = buildTestUser();
  mockUseAuth0.mockReturnValue({
    user,
    logout: mockLogout,
  });

  const recipes =
    overrides.recipes ||
    buildArray(10, () => buildTestRecipe({ author: user }));
  const mocks = [
    {
      request: {
        query: GET_USER_RECIPES,
        variables: {
          authorId: user.userId,
        },
      },
      result: () => {
        return {
          data: {
            getAllRecipes: recipes,
          },
          error: null,
        };
      },
    },
  ];

  const queries = render(
    <MockedProvider addTypename={false} mocks={mocks}>
      <AuthenticatedApp />
    </MockedProvider>,
    { wrapper: MemoryRouter }
  );
  await wait(); // wait for MockedProvider's promise to resolve

  return {
    user,
    mockLogout,
    ...queries,
  };
};

describe("AuthenticatedApp", () => {
  test("loads all recipes after login", async () => {
    const mockLogout = jest.fn().mockName("logout");
    const user = buildTestUser();
    mockUseAuth0.mockReturnValue({
      user,
      logout: mockLogout,
    });

    const recipes = buildArray(10, () => buildTestRecipe({ author: user }));
    const mocks = [
      {
        request: {
          query: GET_USER_RECIPES,
          variables: {
            authorId: user.sub,
          },
        },
        result: () => {
          return {
            data: {
              getAllRecipes: recipes,
            },
            error: null,
          };
        },
      },
    ];

    const { getByText, queryByText, findByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <AuthenticatedApp />
      </MockedProvider>,
      { wrapper: MemoryRouter }
    );

    expect(getByText(/Loading recipes/i)).toBeInTheDocument();
    await wait(); // wait for MockedProvider's promise to resolve
    const logout = await findByText(/Log out/i);
    expect(logout).toBeInTheDocument();
    expect(queryByText(/Loading recipes/i)).toBeNull();
    recipes.forEach(recipe =>
      expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument()
    );
  });

  test("shows create recipe form when create recipe button is clicked and no recipes", async () => {
    const recipes = [];
    const { getByTestId, getByText } = await renderLoadedProfile({ recipes });

    const createRecipeButton = getByText(/create recipe/i);
    testUser.click(createRecipeButton);
    expect(getByTestId("create-recipe-form")).toBeInTheDocument();
  });

  test("shows create recipe form when create recipe button is clicked", async () => {
    const recipes = buildArray(5, () => buildTestRecipe());
    const { getByText, getByTestId } = await renderLoadedProfile({ recipes });

    const createRecipeButton = getByText(/create recipe/i);
    testUser.click(createRecipeButton);
    expect(getByTestId("create-recipe-form")).toBeInTheDocument();
  });

  test("clicking my profile btn when creating recipe shows profile", async () => {
    const recipes = buildArray(5, () => buildTestRecipe());
    const { getByText } = await renderLoadedProfile({ recipes });

    const createRecipeButton = getByText(/create recipe/i);
    testUser.click(createRecipeButton);
    const myProfileButton = getByText(/my profile/i);
    testUser.click(myProfileButton);
    await wait(); // wait for MockedProvider's promise to resolve loading recipes
    expect(myProfileButton).not.toBeInTheDocument();
    expect(getByText(/my profile/i)).toBeInTheDocument();
    expect(createRecipeButton).not.toBeInTheDocument();
  });

  test("show all user recipes if click my recipes btn", async () => {
    const recipes = buildArray(5, () => buildTestRecipe());
    const { getByText } = await renderLoadedProfile({ recipes });

    const createRecipeButton = getByText(/create recipe/i);
    testUser.click(createRecipeButton);
    const myRecipesButton = getByText(/my recipes/i);
    testUser.click(myRecipesButton);
    await wait(); // wait for MockedProvider's promise to resolve loading recipes
    expect(myRecipesButton).not.toBeInTheDocument();
    expect(getByText(/my profile/i)).toBeInTheDocument();
    expect(getByText(/create recipe/i)).toBeInTheDocument();
  });

  // test("show recipe if user clicks on recipe in recipe list", async () => {
  //   const recipes = buildArray(5, () => buildTestRecipe());
  //   const targetRecipe = recipes[0];
  //   const { getByText, queryByText } = await renderLoadedProfile({ recipes });

  //   testUser.click(getByText(nameOfRecipe(targetRecipe)));
  //   expect(queryByText(/my recipes/i)).not.toBeInTheDocument();
  //   expect(getByText(nameOfRecipe(targetRecipe))).toBeInTheDocument();
  // });
});
