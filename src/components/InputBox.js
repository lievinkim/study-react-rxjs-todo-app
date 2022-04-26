import React, { useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { toDoList$ } from "../streams/store";

const tag$ = new BehaviorSubject("todo");

const OPTIONS = [
  { value: "todo", name: "TO DO" },
  { value: "doing", name: "DOING" },
  { value: "done", name: "DONE" },
];

const SelectBox = (props) => {
  return (
    <select className="InputBox__dropboxButton" onChange={props.onChangeTag}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

const InputBox = () => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const onChangeInput = (e) => {
    setText(e.target.value);
  };

  const onChangeTag = (e) => {
    tag$.next(e.target.value);
  };

  const onClickSaveButton = () => {
    if (text.trim().length < 1) return window.alert("내용을 입력해 주세요!");

    const nextToDoList = toDoList$.value.concat({
      id: toDoList$.value.length,
      text: text,
      tag: tag$.value,
      deleted: false,
    });
    toDoList$.next(nextToDoList);

    setText("");
    inputRef.current.focus();
  };

  return (
    <div className="InputBox__container">
      <div className="InputBox__inputArea">
        <textarea
          name="toDoItem"
          value={text}
          ref={inputRef}
          placeholder="오늘의 할 일을 입력해 주세요."
          className="InputBox__input"
          onChange={onChangeInput}
        />
      </div>
      <div className="InputBox__buttonArea">
        <SelectBox options={OPTIONS} onChangeTag={onChangeTag}></SelectBox>
        <button
          type="submit"
          className="InputBox__saveButton"
          onClick={onClickSaveButton}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default InputBox;
