import React, { useEffect, useRef, useState } from "react";
import { debounceTime, merge, Subject, takeUntil } from "rxjs";
import InputBox from "../components/InputBox";
import ToDoItemList from "../components/ToDoItemList";
import { toDoList$, useForceUpdate } from "../streams/store";

const Home = () => {
  const isMount = useRef(true);

  const destroy$ = new Subject();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    merge(toDoList$)
      .pipe(debounceTime(1), takeUntil(destroy$))
      .subscribe(() => forceUpdate());
    return () => destroy$.next(true);
  }, []);

  useEffect(() => {
    if (!isMount.current) {
      localStorage.setItem("toDoList", JSON.stringify(toDoList$.value));
    }
  }, [toDoList$.value]);

  useEffect(() => {
    const localToDoList = localStorage.getItem("toDoList");
    if (localToDoList) {
      toDoList$.next(JSON.parse(localToDoList));
    }
    isMount.current = false;
  }, []);

  return (
    <div className="Home__container">
      <InputBox />
      <div className="Home__listContainer">
        <ToDoItemList tag={"todo"} />
        <ToDoItemList tag={"doing"} />
        <ToDoItemList tag={"done"} />
      </div>
    </div>
  );
};

export default Home;
