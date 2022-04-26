import { useState } from "react";
import { BehaviorSubject } from "rxjs";

export const useForceUpdate = () => {
  console.log("forceUpdated");

  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export const toDoList$ = new BehaviorSubject([]);
export const isMount$ = new BehaviorSubject(false);
