import React, { useEffect, useState } from "react";
import ToDoItem from "./ToDoItem";
import PropTypes from "prop-types";

import { toDoList$ } from "../streams/store";

const ToDoItemList = ({ tag }) => {
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDragEnter = (e) => {
    if (e.target.className === "ToDoItemList__items") {
      e.target.style.background = "yellow";
    }
  };
  const onDragLeave = (e) => {
    if (e.target.className === "ToDoItemList__items") {
      e.target.style.background = "";
    }
  };

  const onDragStart = (e) => {
    e.dataTransfer.setData("targetItem", e.target.id);
    e.dataTransfer.setData("fromList", e.target.parentElement.id);
  };

  const onDrop = (e) => {
    const targetItem = Number(e.dataTransfer.getData("targetItem"));
    const from = e.dataTransfer.getData("fromList");
    const to =
      e.target.tagName === "LI" ? e.target.parentElement.id : e.target.id;

    if (to !== "todo" && to !== "doing" && to !== "done") return;

    if (from !== to) {
      const nextToDoList = toDoList$.value.map((item) => ({
        ...item,
        tag: item.id === targetItem ? to : item.tag,
      }));

      toDoList$.next(nextToDoList);
    }

    if (e.target.className === "ToDoItemList__items") {
      e.target.style.background = "";
    }
  };

  const title = tag === "todo" ? "TO DO" : tag === "doing" ? "DOING" : "DONE";

  return (
    <div className="ToDoItemList__container">
      <p className="ToDoItemList__title">{title}</p>
      <ul
        className="ToDoItemList__items"
        id={tag}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {toDoList$ &&
          toDoList$.value.map((toDoItem) => {
            if (toDoItem.deleted) return null;
            if (toDoItem.tag !== tag) return null;
            return (
              <ToDoItem
                key={toDoItem.id}
                toDoItem={toDoItem}
                onDragStart={onDragStart}
              />
            );
          })}
      </ul>
    </div>
  );
};

ToDoItemList.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default ToDoItemList;
