import * as React from "react";
import TopMenu from "../components/TopMenu";
import Pictures from "../components/Profile/Pictures";
import Connection from "../components/Profile/Connection";
import ProgressBar from "../components/Profile/ProgressBar";
import Personal from "../components/Profile/Personal";
import Preferences from "../components/Profile/Preferences";
import Password from "../components/Profile/Password";
import Tags from "../components/Profile/Tags";

import "../styles/stylesUserProfile.css";

class Profile extends React.Component {
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
            <Connection />
            <ProgressBar />
          </div>
        </div>
        <div className="block-container">
          <div className="middle-container">
            <Personal />
            <Preferences />
          </div>
        </div>
        <div className="block-container">
          <div className="end-container">
            <Password />
            <Tags />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
