import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  combineReducers
} from "redux";
import thunk from "redux-thunk";
import { counterReducer, stringReducer } from "./reducers/reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({ counterReducer, stringReducer });

export const store: Store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

console.log(store.getState());
