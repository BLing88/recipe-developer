import React, { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { Profile } from "../Profile";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuth0 } from "../../react-auth0-spa";

const AuthenticatedApp = () => {
  const [recipes, setRecipes] = useState([]);
  const { user } = useAuth0();

  const GET_USER_RECIPES = gql`
    query getAllRecipes($authorId: ID!) {
      getAllRecipes(authorId: $authorId) {
        name
        id
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_USER_RECIPES, {
    variables: {
      authorId: user.id,
    },
  });

  useEffect(() => {
    if (!loading && !error) {
      data && setRecipes(data.getAllRecipes);
    }
  }, [loading, data, error]);

  return (
    <div className="app">
      <header className="app-header">
        <NavBar />
      </header>
      {loading ? (
        <div className="loading-profile">Loading profile...</div>
      ) : (
        <Profile user={user} recipes={recipes} />
      )}
    </div>
  );
};

export default AuthenticatedApp;
export { AuthenticatedApp };
