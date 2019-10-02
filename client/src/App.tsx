import * as React from "react";
import Axios from "axios";
import { Router, Switch, Route } from "react-router-dom";
import history from "./helpers/history";
import { connect } from "react-redux";
import { State } from "./redux/types/types";
import { store } from "./redux/store";
import {
  updateUserAuth,
  insertUserProfile,
  insertOtherProfile
} from "./redux/actions/actions";
import { Pictures, UserTags } from "./models/models";

import PublicRoutes from "./components/Routes/PublicRoutes";
import PrivateRoutes from "./components/Routes/PrivateRoutes";
import CompletedRoutes from "./components/Routes/CompletedRoutes";
import SearchMatch from "./components/Match/SearchMatch";

import Authentication from "./views/Authentification";
import Profile from "./views/Profile";
import Home from "./views/Home";
import Visits from "./views/Visits";
import Likes from "./views/Likes";

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
  pictures: Array<Pictures>,
  tags: Array<UserTags>
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
            const url = window.location.pathname;
            if (url && url.search("/profile/") !== -1) {
              const urlArray = url.split("/");
              if (urlArray[2]) {
                await Axios.get(
                  `http://localhost:5000/get-user-infos?userName=${urlArray[2]}`
                )
                  .then(({ data: { validated, userInfos } }) => {
                    if (validated) {
                      store.dispatch(insertOtherProfile(userInfos));
                    } else {
                      history.push("/");
                    }
                  })
                  .catch(error => {
                    console.log("Error : ", error.message);
                  });
              }
            }
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
    - Fix popularity score 600%
    - Fix bug pour le rechargement de son profil
    - Fix background image profile
    - CSS de merde
    - Infinite scroll (pls no)

    Partie back :
    - Ne pas delete si y a encore la photo sur la db !
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
                exact={false}
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
              <CompletedRoutes
                exact={true}
                path="/search"
                component={SearchMatch}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/visits"
                component={Visits}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/likes"
                component={Likes}
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
