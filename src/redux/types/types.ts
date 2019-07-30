//types des Actions
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const CHANGE = "CHANGE";

interface IncrementAction {
  type: typeof INCREMENT;
}

interface DecrementAction {
  type: typeof DECREMENT;
}

interface ChangeStringAction {
  type: typeof CHANGE;
  payload: string;
}

//nom des retours pour le fichier action
export type CounterAction = IncrementAction | DecrementAction;
export type StringAction = ChangeStringAction;

//interface des states qui vont devenir mes props à mettre dans model
export interface CounterState {
  testNumber: number;
}

export interface StringState {
  testString: string;
}
