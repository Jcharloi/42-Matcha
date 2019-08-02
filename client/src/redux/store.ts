import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  combineReducers
} from "redux";
import thunk from "redux-thunk";
import { insertUserProfileReducer } from "./reducers/reducers";
import Axios from "axios";
import { insertUserProfile } from "./actions/actions";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({
// getUser: getUserProfileReducer
// insertUser: insertUserProfileReducer
// });

//typer mapStatetoProps when many reducers
// export type AppState = ReturnType<typeof userProfileReducer>;

export const store: Store = createStore(
  insertUserProfileReducer,
  composeEnhancers(applyMiddleware(thunk))
);

Axios.post("http://localhost:5000/get-user-profile")
  .then(({ data }) => {
    store.dispatch(insertUserProfile(data));
  })
  .catch(error => {
    console.log("Error : ", error.message);
  });

/*
Cas à tester
Objectif : Creer un back, //done
relier le back avec mon front et //done
lier le back et la bdd //done
obtenir les infos de la bdd //done
les retourner au front //done
les stocker dans le store //done



Mettre à jour à chaque reload le Store
Async
*/
