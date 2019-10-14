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
import { Pictures, UserTags, VerifiedUser } from "./models/models";

import PublicRoutes from "./components/Routes/PublicRoutes";
import PrivateRoutes from "./components/Routes/PrivateRoutes";
import CompletedRoutes from "./components/Routes/CompletedRoutes";
import SearchMatch from "./components/Match/SearchMatch";

import Authentication from "./views/Authentification";
import Profile from "./views/Profile";
import Home from "./views/Home";
import VisitsAndLikes from "./views/VisitsAndLikes";
import AdminReports from "./components/Admin/AdminReports";
import Messages from "./views/Messages";

interface AppState {
  isLoading: boolean;
}

export function deleteUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  store.dispatch(updateUserAuth({ isAuth: false, isCompleted: false }));
  history.push("/");
}

export function findLastSince(lastseen: string) {
  if (lastseen !== "Just now") {
    lastseen = new Date(+lastseen * 1000).toISOString();
  }
  var dateSeen: any = new Date(lastseen);
  var dateNow: any = new Date();
  var plural: string = "s";
  var seconds = Math.floor((dateNow - dateSeen) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 31);
  if (minutes === 1 || hours === 1 || days === 1 || months === 1) plural = "";

  if (months) return months.toString() + " month" + plural + " ago";
  if (days) return days.toString() + " day" + plural + " ago";
  if (hours) return hours.toString() + " hour" + plural + " ago";
  if (minutes) return minutes.toString() + " minute" + plural + " ago";
  return "Just now";
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

class App extends React.Component<VerifiedUser, AppState> {
  constructor(props: VerifiedUser) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  getUserInfos = async (
    userName: string | null,
    ourName: string | null,
    isOther: boolean,
    isAuth: boolean
  ): Promise<void> => {
    await Axios.put(`http://localhost:5000/get-user-infos`, {
      userName,
      ourName,
      isOther
    })
      .then(({ data: { userInfos, validated } }) => {
        if (
          validated &&
          !userInfos.message &&
          !userInfos.pictures.message &&
          !userInfos.tags.message
        ) {
          if (!isOther) {
            let isCompleted = isProfileCompleted(
              userInfos.city,
              userInfos.gender,
              userInfos.presentation,
              userInfos.pictures,
              userInfos.tags
            );
            store.dispatch(insertUserProfile(userInfos));
            store.dispatch(updateUserAuth({ isAuth, isCompleted }));
          } else {
            store.dispatch(
              insertOtherProfile({
                ...userInfos,
                pictures:
                  userInfos.pictures && userInfos.pictures.length > 0
                    ? userInfos.pictures
                    : [{ date: "1", path: "unknown.png", main: false }]
              })
            );
          }
        }
      })
      .catch(error => {
        console.log("Error : ", error.message);
      });
  };

  async componentDidMount() {
    if (localStorage.getItem("user_name") && localStorage.getItem("token")) {
      await Axios.put("http://localhost:5000/verify-token", {
        userName: localStorage.getItem("user_name"),
        token: localStorage.getItem("token")
      })
        .then(async ({ data: { authToken } }) => {
          if (authToken) {
            await this.getUserInfos(
              localStorage.getItem("user_name"),
              localStorage.getItem("user_name"),
              false,
              authToken
            );
            const current = window.location.pathname;
            if (current && current.search("/profile/") !== -1) {
              await this.getUserInfos(
                decodeURIComponent(current.split("/")[2]),
                localStorage.getItem("user_name"),
                true,
                authToken
              );
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
    - Appuyer sur entrée
    - Fix bug Vu quand t'as envoye un message
    - Socket pour recuperer l'histo quand on fait back ?
    - Creer de nouveaux messages quand c'est vide - Missing the URL shit

    - Augmenter size ring green profil
    - margin bas de page
    - center horizontalement profils
    - Disconnect quand le token expire
    - Infinite scroll (pls no)

    - Protect get users info
    
    Partie back :
    - Changer status res
    - Ne pas delete si y a encore la photo sur la db !
    - Ne pas degager le compte admin
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
                path="/profile/:userName"
                component={Profile}
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
                component={() => <VisitsAndLikes />}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/likes"
                component={() => <VisitsAndLikes />}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/admin-reports"
                component={AdminReports}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/messages"
                component={Messages}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
              <CompletedRoutes
                exact={true}
                path="/messages/:userName"
                component={Messages}
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

const mapStateToProps = (state: State): VerifiedUser => {
  return state.verified;
};

export default connect(mapStateToProps)(App);
