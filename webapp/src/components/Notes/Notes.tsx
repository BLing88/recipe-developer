import React from "react";
import { idOfNote, getNoteOf } from "../../utils/recipe";

const Notes = ({
  notes,
  onClick,
}: {
  notes: Recipe.Note[];
  onClick: () => void;
}) => {
  return (
    <section className="notes-section">
      <h2 onClick={onClick}>Notes</h2>
      <ul className="recipe-notes">
        {notes.map((note) => (
          <li onClick={onClick} key={idOfNote(note)}>
            {getNoteOf(note)}
          </li>
        ))}
      </ul>
    </section>
  );
};

export { Notes };
