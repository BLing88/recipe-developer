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
  test("shows loading message when loading recipes", () => {
    const { getByText, queryByText } = render(
      <UserRecipesList
        loading={true}
        error={null}
        recipes={undefined}
        getRecipe={jest.fn()}
      />
    );
    expect(getByText(/loading recipes/i)).toBeInTheDocument();
    expect(queryByText(/Error loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
  });

  test("shows error if error getting user recipes", () => {
    const { getByText, queryByText } = render(
      <UserRecipesList
        loading={false}
        error={true}
        recipes={undefined}
        getRecipe={jest.fn()}
      />
    );
    expect(queryByText(/^loading recipes/i)).not.toBeInTheDocument();
    expect(getByText(/Error loading recipes/i)).toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
  });

  test("shows recipes", () => {
    const user = buildTestUser();
    const recipes = buildArray(5, () =>
      buildTestRecipe({ authorId: user.sub })
    );
    const { getByText, queryByText } = render(
      <UserRecipesList
        loading={false}
        error={null}
        recipes={recipes}
        getRecipe={jest.fn()}
      />
    );
    expect(queryByText(/^loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/Error loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/no recipes/i)).not.toBeInTheDocument();
    for (let recipe of recipes) {
      expect(getByText(nameOfRecipe(recipe))).toBeInTheDocument();
    }
  });

  test("shows no recipes message if user has no recipes", () => {
    const recipes = [];
    const { getByText, queryByText } = render(
      <UserRecipesList
        loading={false}
        error={null}
        recipes={recipes}
        getRecipe={jest.fn()}
      />
    );
    expect(queryByText(/^loading recipes/i)).not.toBeInTheDocument();
    expect(queryByText(/Error loading recipes/i)).not.toBeInTheDocument();
    expect(getByText(/no recipes/i)).toBeInTheDocument();
  });
});
