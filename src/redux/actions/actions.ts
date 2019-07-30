import {
  CounterAction,
  INCREMENT,
  DECREMENT,
  CHANGE,
  StringAction
} from "../types/types";

export function incrementAction(): CounterAction {
  return {
    type: INCREMENT
  };
}

export function decrementAction(): CounterAction {
  return {
    type: DECREMENT
  };
}

export function changeString(value: string): StringAction {
  return {
    type: CHANGE,
    payload: value
  };
}
