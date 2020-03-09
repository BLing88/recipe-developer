import React from "react";

const InputForm = ({
  title,
  objectName,
  objects,
  getValueOfObject,
  getIdOfObject,
  inputChangeHandler,
  addObjectHandler,
  deleteObjectHandler,
}) => {
  return (
    <section>
      {title}
      <ul>
        {objects.map((object, i) => {
          return (
            <li key={getIdOfObject(object)}>
              <label htmlFor={`${objectName}-${i + 1}`}>
                {objectName} {i + 1}:
              </label>
              <input
                id={`${objectName}-${i + 1}`}
                type="text"
                value={getValueOfObject(object)}
                onChange={e => inputChangeHandler(e, object, i)}
              />

              <div
                onClick={e => deleteObjectHandler(i)}
                data-testid={`delete-${objectName}-${i + 1}`}
              >
                delete
              </div>
            </li>
          );
        })}
      </ul>
      <button onClick={addObjectHandler}>Add {objectName}</button>
    </section>
  );
};

export { InputForm };
