import * as React from "react";
import Axios from "axios";
import { Router, Switch } from "react-router-dom";
import history from "./helpers/history";
import { connect } from "react-redux";
import { State } from "./redux/types/types";
import { store } from "./redux/store";
import { updateUserAuth, insertUserProfile } from "./redux/actions/actions";

import PublicRoutes from "./components/PublicRoutes";
import PrivateRoutes from "./components/PrivateRoutes";
import CompletedRoutes from "./components/CompletedRoutes";

import Authentication from "./views/Authentification";
import Profile from "./views/Profile";
import Home from "./views/Home";

interface AppState {
  isLoading: boolean;
}

interface Props {
  isAuth: boolean;
  isCompleted: boolean;
}

export function deleteUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  store.dispatch(updateUserAuth({ isAuth: false, isCompleted: false }));
  history.push("/");
}

class App extends React.Component<Props, AppState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    if (localStorage.getItem("user_name") && localStorage.getItem("token")) {
      await Axios.put("http://localhost:5000/verify-token", {
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
                  store.dispatch(insertUserProfile(userInfos));
                  store.dispatch(
                    updateUserAuth({ isAuth: authToken, isCompleted })
                  );
                }
              })
              .catch(error => {
                console.log("Error : ", error.message);
              });
          } else {
            localStorage.clear();
          }
        })
        .catch(error => {
          console.log("Error : ", error.message);
        });
    }
    this.setState({ isLoading: false });
  }

  render() {
    //  A faire : - Reparer la suppression d'images.
    //- Faire les tests avec Postman et refaire tous les tests du coté front.
    //- Reparer le CSS pour la partie My Password

    //  Reparer les bugs suivants:
    // -Mauvais message d'erreur quand on login avec un mauvais username
    // -Age affiché 1 an de plus (Peut etre qu'il faut prendre en compte les mois)
    
    return (
      <div>
        <Router history={history}>
          {!this.state.isLoading && (
            <Switch>
              <PublicRoutes
                exact={true}
                path="/"
                component={Authentication}
                isAuth={this.props.isAuth}
              />
              <PrivateRoutes
                exact={true}
                path="/profile"
                component={Profile}
                isAuth={this.props.isAuth}
              />
              <CompletedRoutes
                exact={true}
                path="/home"
                component={Home}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
            </Switch>
          )}
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return {
    isAuth: state.verified.isAuth,
    isCompleted: state.verified.isCompleted
  };
};

/*
const thunkAsyncAction = () => async (dispatch: Dispatch): Promise<void> => {
  // dispatch actions, return Promise, etc.
}
*/

export default connect(mapStateToProps)(App);
