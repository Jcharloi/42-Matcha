import * as React from "react";
import TopMenu from "../components/TopMenu";
import Pictures from "../components/Profile/Pictures";
import Connection from "../components/Profile/Connection";
import ProgressBar from "../components/Profile/ProgressBar";
import Personal from "../components/Profile/Personal";
import Preferences from "../components/Profile/Preferences";
import Password from "../components/Profile/Password";
import Tags from "../components/Profile/Tags";
import { User } from "../models/models";

import { State } from "../redux/types/types";
import { connect } from "react-redux";
import "../styles/stylesUserProfile.css";

class Profile extends React.Component<User> {
  public render() {
    return (
      <div>
        <TopMenu current="profile" />
        <img
          className="profile-background"
          src="http://localhost:5000/public/profile-pictures/background-profile.jpg"
          alt="Profile background"
        />
        <div className="top-container">
          <Pictures />
          <div className="left-container">
            <div className="user-name">{localStorage.getItem("user_name")}</div>
            <Connection connection="Online now !" />
            <ProgressBar progressBarPercent={this.props.score} />
          </div>
        </div>
        <div className="block-container">
          <div className="middle-container">
            <Personal isOther={false} user={this.props} />
            <Preferences isOther={false} user={this.props} />
          </div>
        </div>
        <div className="block-container">
          <div className="end-container">
            <Password />
            <Tags isOther={false} user={this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Profile);
