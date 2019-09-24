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
  otherProfileReducer
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
  otherUser: otherProfileReducer
});

//typer mapStatetoProps when many reducers
// export type AppState = ReturnType<typeof userProfileReducer>;

export const store: Store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
