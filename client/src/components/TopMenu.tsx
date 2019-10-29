import * as React from "react";
import { Redirect, Link } from "react-router-dom";
import { store } from "../redux/store";
import { insertOtherProfile, updateNumberOf } from "../redux/actions/actions";
import { State } from "../redux/types/types";
import Axios from "axios";
import { connect } from "react-redux";
import { User, NumberOf } from "../models/models";
import { socket } from "../helpers/socket";
import { deleteUser } from "../App";
import { Label, Dropdown } from "semantic-ui-react";

import "../styles/stylesTopMenu.css";

interface Props {
  current?: string;
  user: User;
  numberOf: NumberOf;
}

class TopMenu extends React.Component<Props, {}> {
  componentDidMount = () => {
    Axios.put(`http://localhost:5000/profile/get-notification`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { notificationArray, validated } }) => {
        if (validated) {
          // console.log(notificationArray);
          notificationArray.forEach(
            (notif: { seen: boolean }, index: number) => {
              if (!notif.seen) {
                store.dispatch(
                  updateNumberOf({
                    numberMessages: this.props.numberOf.numberMessages,
                    numberNotifications: ++index
                  })
                );
              }
            }
          );
        }
      })
      .catch(err => console.error(err));
  };

  handleDisconnect = async () => {
    await Axios.put("http://localhost:5000/disconnect", {
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validated } }) => {
        socket.emit("disconnect");
        if (validated) {
          deleteUser();
        }
      })
      .catch(e => {
        console.error(e.stack);
      });
  };

  emptyOtherProfile = () => {
    store.dispatch(
      insertOtherProfile({
        user_id: "",
        mail: "",
        user_name: "",
        last_name: "",
        first_name: "",
        birthday: "",
        age: "",
        gender: "",
        orientation: "",
        presentation: "",
        score: "",
        city: "",
        pictures: [],
        tags: [],
        connection: "",
        liked: false
      })
    );
  };
  // redirect = () => {
  //   <Redirect to="/profile" />;
  // };

  onChange = (e: any, data: any) => {
    // return (
    // data.value === "Profile" ? this.emptyOtherProfile : null,
    return <Redirect to="/profile" />;
  };

  public render() {
    const options = [
      { key: 1, text: "Profile", value: "Profile" },
      { key: 2, text: "Home", value: "Home" },
      { key: 3, text: "Search", value: "Search" },
      { key: 4, text: "Visits", value: "Visits" },
      { key: 5, text: "Likes", value: "Likes" },
      {
        key: 6,
        text: "Notifications",
        value: "Notifications"
      },
      { key: 7, text: "Messages", value: "Messages" },
      { key: 8, text: "Disconnect", value: "Disconnect" }
    ];
    return (
      <div>
        <div className="ui secondary big menu">
          <img
            className="item logo"
            src="http://localhost:5000/public/profile-pictures/logo.png"
            alt="Logo top menu"
          />

          <div className="left menu">
            {this.props.current !== "profile" ? (
              <Link
                className="item item-page"
                onClick={this.emptyOtherProfile}
                to="/profile"
              >
                Profile
              </Link>
            ) : (
              <Link
                className="item active item-page"
                onClick={this.emptyOtherProfile}
                to="/profile"
              >
                Profile
              </Link>
            )}

            {this.props.current !== "home" ? (
              <Link className="item item-page" to="/home">
                Home
              </Link>
            ) : (
              <Link className="item active item-page" to="/home">
                Home
              </Link>
            )}
            {this.props.current !== "search" ? (
              <Link className="item item-page" to="/search">
                Search
              </Link>
            ) : (
              <Link className="item active item-page" to="/search">
                Search
              </Link>
            )}
            {this.props.current !== "visits" ? (
              <Link className="item item-page" to="/visits">
                Visits
              </Link>
            ) : (
              <Link className="item active item-page" to="/visits">
                Visits
              </Link>
            )}
            {this.props.current !== "likes" ? (
              <Link className="item item-page" to="/likes">
                Likes
              </Link>
            ) : (
              <Link className="item active item-page" to="/likes">
                Likes
              </Link>
            )}
          </div>
          <div className="right menu mobile">
            <Dropdown
              icon="list ul"
              options={options}
              onChange={this.onChange}
              simple
              item
            />
          </div>
          <div className="right menu">
            <div className="item">
              {this.props.user.user_id ===
              "eef7d602-045f-4db3-92e2-afd6131f5a41" ? (
                <Link className="ui red button" to="/admin-reports">
                  Reports
                </Link>
              ) : null}
              {/* <div className="item item-page">Notifications</div> */}
              {this.props.current !== "notifications" ? (
                <Link className="item item-page" to="/notifications">
                  Notifications
                  <Label className="label-notif" color="red">
                    {this.props.numberOf.numberNotifications}
                  </Label>
                </Link>
              ) : (
                <Link className="item active item-page" to="/notifications">
                  Notifications
                  <Label className="label-notif" color="red">
                    {this.props.numberOf.numberNotifications}
                  </Label>
                </Link>
              )}

              {this.props.current !== "messages" ? (
                <Link className="item item-page" to="/messages">
                  Messages
                </Link>
              ) : (
                <Link className="item active item-page" to="/messages">
                  Messages
                </Link>
              )}
              <div
                className="ui red button"
                onClick={() => {
                  this.handleDisconnect();
                  this.emptyOtherProfile();
                }}
              >
                Disconnect
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return { user: state.user, numberOf: state.numberOf };
};

export default connect(mapStateToProps)(TopMenu);
