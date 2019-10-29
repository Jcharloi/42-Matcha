import * as React from "react";
import Axios from "axios";
import { Router, Switch, Route } from "react-router-dom";
import history from "./helpers/history";
import { socket } from "./helpers/socket";
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
import IsNotAuthRoutes from "./components/Routes/IsNotAuthRoutes";
import CompletedRoutes from "./components/Routes/CompletedRoutes";
import SearchMatch from "./components/Match/SearchMatch";

import Authentication from "./views/Authentification";
import Profile from "./views/Profile";
import Home from "./views/Home";
import VisitsAndLikes from "./views/VisitsAndLikes";
import AdminReports from "./components/Admin/AdminReports";
import Messages from "./views/Messages";
import Notification from "./views/Notification";

interface AppState {
  isLoading: boolean;
  messageApp?: string | null;
}

export function deleteUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  store.dispatch(updateUserAuth({ isAuth: false, isCompleted: false }));
  history.push("/");
}

export function findLastSince(lastseen: string) {
  lastseen = new Date(+lastseen).toISOString();
  const dateSeen: any = new Date(lastseen);
  const dateNow: any = new Date();
  let plural: string = "s";
  const seconds = Math.floor((dateNow - dateSeen) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 31);
  if (minutes === 1 || hours === 1 || days === 1 || months === 1) plural = "";

  if (months) return months.toString() + " month" + plural + " ago";
  if (days) return days.toString() + " day" + plural + " ago";
  if (hours) return hours.toString() + " hour" + plural + " ago";
  if (minutes) return minutes.toString() + " minute" + plural + " ago";
  if (seconds) return seconds.toString() + " second" + plural + " ago";
  return "now";
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

  timer!: NodeJS.Timeout;
  timerConnection!: NodeJS.Timeout;

  getUserInfos = async (
    targetName: string | null,
    isOther: boolean,
    isAuth: boolean
  ): Promise<void> => {
    await Axios.put(`http://localhost:5000/profile/get-user-infos`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetName,
      isOther
    })
      .then(({ data: { validToken, userInfos, validated } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
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
              socket.emit("send-user-name", localStorage.getItem("user_name"));
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
          socket.on("notification", (data: any) => {
            if (data.type === "like") {
              this.setState({
                messageApp: data.sender + " just " + data.type + "d you !"
              });
            }
            if (data.type === "visit") {
              this.setState({
                messageApp: data.sender + " just visited your profile."
              });
            }
            if (data.type === "match") {
              this.setState({
                messageApp:
                  "This is a Match ! " + data.sender + " just liked you back !"
              });
            }
            if (data.type === "dislike") {
              this.setState({
                messageApp: "Ouch ! " + data.sender + " disloved you :("
              });
            }
          });
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
              false,
              authToken
            );
            const current = window.location.pathname;
            if (current && current.search("/profile/") !== -1) {
              await this.getUserInfos(
                decodeURIComponent(current.split("/")[2]),
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

  componentDidUpdate = () => {
    if (this.state.messageApp && this.timer) {
      clearTimeout(this.timer);
    }
    if (this.state.messageApp) {
      this.timer = setTimeout(() => this.setState({ messageApp: "" }), 4000);
    }
    if (!this.timerConnection) {
      if (this.props.isAuth) {
        this.timerConnection = setInterval(() => {
          Axios.put("http://localhost:5000/admin/verify-connection", {
            token: localStorage.getItem("token"),
            userName: localStorage.getItem("user_name")
          })
            .then(({ data: validToken }) => {
              if (validToken === false) {
                deleteUser();
              }
            })
            .catch(e => {
              console.log(e.message);
            });
        }, 30000);
      }
    }
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.timerConnection) {
      clearTimeout(this.timerConnection);
    }
  };

  render() {
    /*
    Partie front :
    - Changer status res
    - Responsive
    - TOUS LES TESTS ET C'EST FINI !!!
    
    - Infinite scroll (pls no)
    - CSS notif
    
    Partie back :
    - Ne pas delete si y a encore la photo sur la db !
    */
    return (
      <div>
        {this.state.messageApp && (
          <div className="toast-message ui floating message">
            <p>{this.state.messageApp}</p>
          </div>
        )}
        <Router history={history}>
          {!this.state.isLoading && (
            <Switch>
              <IsNotAuthRoutes
                exact={true}
                path="/sign-in"
                component={Authentication}
                isAuth={this.props.isAuth}
              />
              <IsNotAuthRoutes
                exact={true}
                path="/sign-up"
                component={Authentication}
                isAuth={this.props.isAuth}
              />
              <Route path="/reset-password" component={Authentication} />
              <PublicRoutes
                exact={true}
                path="/"
                component={Authentication}
                isAuth={this.props.isAuth}
              />
              {console.log(this.props.isAuth)}
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
              <CompletedRoutes
                exact={true}
                path="/notifications"
                component={Notification}
                isAuth={this.props.isAuth}
                isCompleted={this.props.isCompleted}
              />
            </Switch>
          )}
        </Router>
        {this.props.isAuth && this.props.isCompleted && (
          <div className="container-little-messages">
            <Messages littleMessages={true} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State): VerifiedUser => {
  return state.verified;
};

export default connect(mapStateToProps)(App);
