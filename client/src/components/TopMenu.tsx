import * as React from "react";
import "../styles/stylesTopMenu.css";
import history from "../helpers/history";
import { store } from "../redux/store";
import { updateUserAuth } from "../redux/actions/actions";

interface Props {
  current: string;
}

class TopMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

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
              className="item home inactive"
              onClick={() => {
                history.push("/home");
              }}
            >
              Home
            </div>
          ) : null}
          {this.props.current !== "profile" ? (
            <div
              className="item home inactive"
              onClick={() => {
                history.push("/profile");
              }}
            >
              Profile
            </div>
          ) : null}
          <a className="item">Visits</a>
          <a className="item">Likes</a>
          <div className="right menu">
            <div className="item">
              <a className="item">Notifications</a>
              <a className="item">Messages</a>
              <div
                className="ui red button"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user_name");
                  store.dispatch(
                    updateUserAuth({ isAuth: false, isCompleted: false })
                  );
                  history.push("/");
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
