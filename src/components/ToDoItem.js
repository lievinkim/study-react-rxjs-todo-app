import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toDoList$ } from "../streams/store";

const ToDoItem = ({ toDoItem, onDragStart }) => {
  const editInputRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [newText, setNewText] = useState(toDoItem.text);

  const onClickEditButton = () => {
    setIsEdit(true);
  };

  const onChangeEditInput = (e) => {
    setNewText(e.target.value);
  };

  const onClickSubmitButton = () => {
    if (newText.trim().length < 1) return window.alert("내용을 입력해 주세요!");

    const nextToDoList = toDoList$.value.map((item) => ({
      ...item,
      text: item.id === toDoItem.id ? newText : item.text,
    }));

    toDoList$.next(nextToDoList);
    setIsEdit(false);
  };

  const onClickDeleteButton = () => {
    const nextToDoList = toDoList$.value.map((item) => ({
      ...item,
      deleted: item.id === toDoItem.id ? true : item.deleted,
    }));

    toDoList$.next(nextToDoList);
  };

  useEffect(() => {
    if (isEdit) {
      editInputRef.current.focus();
    }
  }, []);

  return (
    <li
      className="ToDoItem__container"
      id={toDoItem.id}
      draggable
      onDragStart={onDragStart}
    >
      {isEdit ? (
        <textarea
          className="ToDoItem__textarea"
          type="text"
          value={newText}
          ref={editInputRef}
          onChange={onChangeEditInput}
          draggable
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      ) : (
        <span className="ToDoItem__content">{toDoItem.text}</span>
      )}
      <div className="ToDoItem__buttonContainer">
        {isEdit ? (
          <button
            type="button"
            className="ToDoItem__editButton"
            onClick={onClickSubmitButton}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            className="ToDoItem__editButton"
            onClick={onClickEditButton}
          >
            Edit
          </button>
        )}

        <button
          type="button"
          className="ToDoItem__deleteButton"
          onClick={onClickDeleteButton}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

ToDoItem.propTypes = {
  toDoItem: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    deleted: PropTypes.bool.isRequired,
  }),
};

export default ToDoItem;
