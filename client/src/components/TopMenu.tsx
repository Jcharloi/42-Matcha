import * as React from "react";
import { Link } from "react-router-dom";
import { store } from "../redux/store";
import { insertOtherProfile } from "../redux/actions/actions";
import { State } from "../redux/types/types";
import Axios from "axios";
import { connect } from "react-redux";
import { User } from "../models/models";
import socket from "../helpers/socket";
import { deleteUser } from "../App";

import "../styles/stylesTopMenu.css";

interface Props {
  current?: string;
  user: User;
}

class TopMenu extends React.Component<Props> {
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

  public render() {
    return (
      <div>
        <div className="ui secondary big menu">
          <div className="left menu">
            <img
              className="item logo"
              src="http://localhost:5000/public/profile-pictures/logo.png"
              alt="Logo top menu"
            />
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

          <div className="right menu">
            <div className="item">
              {this.props.user.user_id ===
              "eef7d602-045f-4db3-92e2-afd6131f5a41" ? (
                <Link className="ui red button" to="/admin-reports">
                  Reports
                </Link>
              ) : null}
              <div className="item item-page">Notifications</div>

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
  return { user: state.user };
};

export default connect(mapStateToProps)(TopMenu);
