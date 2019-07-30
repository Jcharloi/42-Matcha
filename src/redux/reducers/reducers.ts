import {
  CounterState,
  CounterAction,
  StringState,
  StringAction
} from "../types/types";

let initialStateCounter: CounterState = { testNumber: 0 };

export const counterReducer = (
  state = initialStateCounter,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return { testNumber: state.testNumber + 1 };
    case "DECREMENT":
      return { testNumber: state.testNumber - 1 };
    default:
      return state;
  }
};

let initialStateReducer: StringState = {
  testString: "Fabzoul est une licorne"
};

export const stringReducer = (
  state = initialStateReducer,
  action: StringAction
): StringState => {
  switch (action.type) {
    case "CHANGE": {
      return { ...state, testString: action.payload };
    }
    default:
      return state;
  }
};
