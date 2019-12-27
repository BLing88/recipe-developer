import React from "react";
import { Instructions } from "./Instructions";
import { testRecipe } from "../../static-recipe";
import { render } from "@testing-library/react";

test("it lists every instruction", () => {
  const { getByText } = render(
    <Instructions instructions={testRecipe.instructions} />
  );

  testRecipe.instructions.forEach(instruction => {
    expect(getByText(instruction)).toBeInTheDocument();
  });
});
