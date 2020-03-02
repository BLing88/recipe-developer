import React from "react";
import { AuthenticatedApp } from "./AuthenticatedApp";

import { render, wait } from "@testing-library/react";
import {
  buildTestUser,
  buildArray,
  buildTestRecipe,
} from "test/utils/generate";

jest.mock("../../react-auth0-spa");
import { useAuth0 as mockUseAuth0 } from "../../react-auth0-spa";

import { MockedProvider } from "@apollo/react-testing";
import gql from "graphql-tag";

const GET_USER_RECIPES = gql`
  query getAllRecipes($authorId: ID!) {
    getAllRecipes(authorId: $authorId) {
      name
      id
    }
  }
`;

describe("AuthenticatedApp", () => {
  test("shows loading Profile", async () => {
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
            authorId: user.id,
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
        <AuthenticatedApp user={user} />
      </MockedProvider>
    );

    // const loading = getByText(/Loading profile/i);
    expect(getByText(/Loading profile/i)).toBeInTheDocument();
    await wait(); // wait for MockedProvider's promise to resolve
    const profile = await findByText(/Log out/i);
    expect(profile).toBeInTheDocument();
    expect(queryByText(/Loading profile/i)).toBeNull();
    recipes.forEach(recipe =>
      expect(getByText(recipe.name)).toBeInTheDocument()
    );
  });

  //   test("loads user recipes", () =>)
});
