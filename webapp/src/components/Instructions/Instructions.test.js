import React from "react";
import { Instructions } from "./Instructions";
import { render } from "@testing-library/react";

import { buildTestInstructions } from "test/utils/generate";

test("it lists every instruction", () => {
  const testInstructions = buildTestInstructions();

  const { getAllByText } = render(
    <Instructions instructions={testInstructions} onClick={jest.fn()} />
  );

  const instructionSet = new Set(
    testInstructions.map(instruction => instruction.instruction)
  );
  Array.from(instructionSet).forEach(instruction => {
    const queries = getAllByText(new RegExp(instruction, "i"));
    queries.forEach(instruction => expect(instruction).toBeInTheDocument());
  });
});
