import * as React from "react";
import TopMenu from "../components/TopMenu";
import Pictures from "../components/Pictures";
import Connection from "../components/Connection";
import ProgressBar from "../components/ProgressBar";
import Personal from "../components/Personal";
import Preferences from "../components/Preferences";
import Password from "../components/Password";
import Tags from "../components/Tags";

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
        {/*
        verifier l'user
        <div>
          My tags :
          {this.props.tags.map(({ tag_id, name, custom }) => (
            <div key={tag_id}>{name}</div>
          ))}
        </div>
        <br />*/}
      </div>
    );
  }
}

export default Profile;
