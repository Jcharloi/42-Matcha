import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  combineReducers
} from "redux";
import thunk from "redux-thunk";
import {
  verifiedUserReducer,
  userProfileReducer,
  otherProfileReducer,
  updateNumberOfReducer
} from "./reducers/reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  verified: verifiedUserReducer,
  user: userProfileReducer,
  otherUser: otherProfileReducer,
  numberOf: updateNumberOfReducer
});

export const store: Store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
