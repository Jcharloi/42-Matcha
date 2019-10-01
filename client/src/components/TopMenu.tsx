import * as React from "react";
import history from "../helpers/history";
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
            <div
              className="item item-page"
              onClick={() => {
                history.push("/home");
              }}
            >
              Home
            </div>
          ) : null}
          {this.props.current !== "profile" ? (
            <div
              className="item item-page"
              onClick={() => {
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
                history.push("/profile");
              }}
            >
              Profile
            </div>
          ) : null}
          {this.props.current !== "search" ? (
            <div
              className="item item-page"
              onClick={() => {
                history.push("/search");
              }}
            >
              Search
            </div>
          ) : null}
          <div
            className="item item-page "
            onClick={() => {
              history.push("/visits");
            }}
          >
            Visits
          </div>
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
