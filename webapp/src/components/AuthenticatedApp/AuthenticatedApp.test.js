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
    </MockedProvider>
  );
  await wait(); // wait for MockedProvider's promise to resolve

  return {
    user,
    mockLogout,
    ...queries,
  };
};

describe("AuthenticatedApp", () => {
  test("loads Profile", async () => {
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
      </MockedProvider>
    );

    expect(getByText(/Loading recipes/i)).toBeInTheDocument();
    await wait(); // wait for MockedProvider's promise to resolve
    const profile = await findByText(/Log out/i);
    expect(profile).toBeInTheDocument();
    expect(queryByText(/Loading recipes/i)).toBeNull();
    recipes.forEach(recipe =>
      expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument()
    );
  });

  test("Shows create recipe form when create recipe button is clicked and no recipes", async () => {
    const recipes = [];
    const { getByTestId, getByText } = await renderLoadedProfile({ recipes });

    const createRecipeButton = getByText(/create recipe/i);
    testUser.click(createRecipeButton);
    expect(getByTestId("create-recipe-form")).toBeInTheDocument();
  });
  test("Shows create recipe form when create recipe button is clicked", async () => {
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
});
