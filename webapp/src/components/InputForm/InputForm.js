import React from "react";
import PropTypes from "prop-types";
import "./InputForm.css";

const InputForm = ({
  title,
  objectName,
  displayName,
  displayType,
  objects,
  getValueOfObject,
  getIdOfObject,
  inputChangeHandler,
  addObjectHandler,
  deleteObjectHandler,
}) => {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {objects.map((object, i) => {
          return (
            <li key={getIdOfObject(object)}>
              <label htmlFor={`${objectName}-${i + 1}`}>
                {displayName} {i + 1}:
              </label>
              {displayType === "text" ? (
                <input
                  id={`${objectName}-${i + 1}`}
                  type="text"
                  value={getValueOfObject(object)}
                  onChange={e => inputChangeHandler(e, object, i)}
                />
              ) : (
                <textarea
                  id={`${objectName}-${i + 1}`}
                  type="text"
                  value={getValueOfObject(object)}
                  onChange={e => inputChangeHandler(e, object, i)}
                />
              )}

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
InputForm.propTypes = {
  title: PropTypes.string.isRequired,
  objectName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  displayType: PropTypes.oneOf(["text", "textarea"]).isRequired,
  objects: PropTypes.arrayOf(PropTypes.object).isRequired,
  getValueOfObject: PropTypes.func.isRequired,
  getIdOfObject: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  addObjectHandler: PropTypes.func.isRequired,
  deleteObjectHandler: PropTypes.func.isRequired,
};

export { InputForm };
