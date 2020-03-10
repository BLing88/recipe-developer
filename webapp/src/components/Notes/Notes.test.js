import React from "react";
import { Notes } from "./Notes";
import { render } from "@testing-library/react";
import { buildTestNotes } from "test/utils/generate";

test("it lists every note given an array of notes", () => {
  const testNotes = buildTestNotes();

  const { getAllByText } = render(
    <Notes notes={testNotes} onClick={jest.fn()} />
  );

  const notesSet = new Set(testNotes.map(note => note.note));
  Array.from(notesSet).forEach(note => {
    const queries = getAllByText(new RegExp(note, "i"));
    queries.forEach(note => expect(note).toBeInTheDocument());
  });
});
