import React from "react";
import { UserRecipesList } from "./UserRecipesList";

import { render, wait } from "@testing-library/react";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";
import { MockedProvider } from "@apollo/react-testing";
import gql from "graphql-tag";
import {
  buildTestUser,
  buildArray,
  buildTestRecipe,
} from "test/utils/generate";
import { GET_ALL_RECIPES } from "../../queries";
import { nameOfRecipe } from "utils/recipe";

describe("UserRecipesList", () => {
  test("shows loading message when loading recipes", async () => {
    const mockLogout = jest.fn().mockName("logout");
    const user = buildTestUser();
    mockUseAuth0.mockReturnValue({
      user,
      logout: mockLogout,
    });

    const mocks = [
      {
        request: {
          query: GET_ALL_RECIPES,
          variables: {
            authorId: user.userId,
          },
        },
        result: () => {
          return {
            data: {
              getAllRecipes: undefined,
            },
            error: null,
            loading: true,
          };
        },
      },
    ];

    const { getByText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <UserRecipesList />
      </MockedProvider>
    );
    expect(getByText(/loading recipes/i)).toBeInTheDocument();
    expect(queryByText(/Error loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
    await wait();
  });

  test("shows error if error getting user recipes", async () => {
    const mockLogout = jest.fn().mockName("logout");
    const user = buildTestUser();
    mockUseAuth0.mockReturnValue({
      user,
      logout: mockLogout,
    });

    const mocks = [
      {
        request: {
          query: GET_ALL_RECIPES,
          variables: {
            authorId: user.userId,
          },
        },
        result: () => {
          return {
            data: {
              getAllRecipes: undefined,
            },
            error: true,
            loading: false,
          };
        },
      },
    ];

    const { getByText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <UserRecipesList />
      </MockedProvider>
    );
    await wait();
    expect(queryByText(/^loading recipes/i)).not.toBeInTheDocument();
    expect(getByText(/Error loading recipes/i)).toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
  });

  test("shows recipes", async () => {
    const mockLogout = jest.fn().mockName("logout");
    const user = buildTestUser();
    user.sub = user.userId;
    mockUseAuth0.mockReturnValue({
      user,
      logout: mockLogout,
    });
    const recipes = buildArray(5, () =>
      buildTestRecipe({ authorId: user.userId })
    );
    const mocks = [
      {
        request: {
          query: GET_ALL_RECIPES,
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
            loading: true,
          };
        },
      },
    ];

    const { getByText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <UserRecipesList />
      </MockedProvider>
    );
    await wait();
    expect(queryByText(/^loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/Error loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
    for (let recipe of recipes) {
      expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument();
    }
  });
});
