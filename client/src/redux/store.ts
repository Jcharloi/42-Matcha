import Axios from "axios";
import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  combineReducers
} from "redux";
import thunk from "redux-thunk";
import { verifiedUserReducer, userProfileReducer } from "./reducers/reducers";
import { updateUserAuth, updateUserProfile } from "./actions/actions";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  verified: verifiedUserReducer,
  user: userProfileReducer
});

//typer mapStatetoProps when many reducers
// export type AppState = ReturnType<typeof userProfileReducer>;

export const store: Store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

//delete s'il fait joujou avec

if (localStorage.getItem("user_name") && localStorage.getItem("token")) {
  Axios.put("http://localhost:5000/verify-token", {
    userName: localStorage.getItem("user_name"),
    token: localStorage.getItem("token")
  })
    .then(async ({ data: { authToken } }) => {
      if (authToken) {
        let userName = localStorage.getItem("user_name");
        await Axios.get(
          `http://localhost:5000/get-user-infos?userName=${userName}`
        )
          .then(({ data: { userInfos } }) => {
            if (
              !userInfos.message &&
              !userInfos.pictures.message &&
              !userInfos.tags.message
            ) {
              let isCompleted = false;
              if (
                userInfos.city &&
                userInfos.gender &&
                userInfos.presentation &&
                userInfos.pictures.length > 0 &&
                userInfos.tags.length > 0
              ) {
                isCompleted = true;
              }
              store.dispatch(updateUserProfile(userInfos));
              store.dispatch(
                updateUserAuth({ isAuth: authToken, isCompleted })
              );
            }
          })
          .catch(error => {
            console.log("Error : ", error.message);
          });
      }
    })
    .catch(error => {
      console.log("Error : ", error.message);
    });
}
