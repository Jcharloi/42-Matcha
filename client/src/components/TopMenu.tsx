import * as React from "react";
import { Link } from "react-router-dom";
import { store } from "../redux/store";
import { insertOtherProfile } from "../redux/actions/actions";
import Axios from "axios";
import { deleteUser } from "../App";

import "../styles/stylesTopMenu.css";

interface Props {
  current?: string;
}

class TopMenu extends React.Component<Props> {
  handleDisconnect = async () => {
    await Axios.put("http://localhost:5000/disconnect", {
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validated } }) => {
        if (validated) deleteUser();
      })
      .catch(e => {
        console.error(e.stack);
      });
  };

  linkToMyProfile = () => {
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
          <img
            className="item logo"
            src="http://localhost:5000/public/profile-pictures/logo.png"
            alt="Logo top menu"
          />
          {this.props.current !== "home" ? (
            <Link className="item item-page" to="/home">
              Home
            </Link>
          ) : null}
          {this.props.current !== "profile" ? (
            <Link
              className="item item-page"
              onClick={this.linkToMyProfile}
              to="/profile"
            >
              Profile
            </Link>
          ) : null}
          {this.props.current !== "search" ? (
            <Link className="item item-page" to="/search">
              Search
            </Link>
          ) : null}
          <Link className="item item-page" to="/visits">
            Visits
          </Link>
          <div className="item item-page">Likes</div>
          <div className="right menu">
            <div className="item">
              <div className="item item-page">Notifications</div>
              <div className="item item-page">Messages</div>
              <div
                className="ui red button"
                onClick={() => {
                  this.handleDisconnect();
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

export default TopMenu;
