import * as React from "react";
import Axios from "axios";
import { Router, Switch, Route } from "react-router-dom";
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

export function isProfileCompleted(
  city: string,
  gender: string,
  presentation: string,
  pictures: [],
  tags: []
): boolean {
  if (
    city &&
    gender &&
    presentation &&
    pictures.length > 0 &&
    tags.length > 0
  ) {
    return true;
  }
  return false;
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
                  let isCompleted = isProfileCompleted(
                    userInfos.city,
                    userInfos.gender,
                    userInfos.presentation,
                    userInfos.pictures,
                    userInfos.tags
                  );
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
    /*
    Partie front :
    - Design mdr
    - Tester le tri
    - Tester l'interval
    - Infinite scroll
    - Generer last connection en dynamique : Adapter par rapport aux heures/minutes
    - HandleChange
    
    Partie back :
    - Obtenir le bon age de naissance
    */
    return (
      <div>
        <Router history={history}>
          {!this.state.isLoading && (
            <Switch>
              <Route path="/sign-in" component={Authentication} />
              <Route path="/sign-up" component={Authentication} />
              <Route path="/reset-password" component={Authentication} />
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
