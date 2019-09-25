import * as React from "react";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";
import { connect } from "react-redux";
import TopMenu from "../TopMenu";
import Pictures from "../Profile/Pictures";
import Connection from "../Profile/Connection";
import ProgressBar from "../Profile/ProgressBar";
import Personal from "../Profile/Personal";
import Preferences from "../Profile/Preferences";
import Tags from "../Profile/Tags";

import "../../styles/stylesUserProfile.css";

class OtherProfile extends React.Component<User> {
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
            <div className="user-name">{this.props.user_name}</div>
            <Connection connection={this.props.connection} />
            <ProgressBar progressBarPercent={this.props.score} />
          </div>
        </div>
        <div className="block-container">
          <div className="middle-container">
            <Personal isOther={true} user={this.props} />
            <Preferences isOther={true} user={this.props} />
          </div>
        </div>
        <div className="block-container">
          <div className="end-container">
            <Tags isOther={true} user={this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.otherUser;
};

export default connect(mapStateToProps)(OtherProfile);
