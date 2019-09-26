import * as React from "react";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { User } from "../models/models";

import TopMenu from "../components/TopMenu";
import Pictures from "../components/Profile/Pictures";
import Connection from "../components/Profile/Connection";
import ProgressBar from "../components/Profile/ProgressBar";
import Like from "../components/Profile/Like";
import Personal from "../components/Profile/Personal";
import Preferences from "../components/Profile/Preferences";
import Password from "../components/Profile/Password";
import Tags from "../components/Profile/Tags";

import "../styles/stylesUserProfile.css";

interface Props {
  user: User;
  otherUser: User;
}

interface PState {
  isOther: boolean;
  usedUser: User;
}

class Profile extends React.Component<Props, PState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOther: this.props.otherUser.user_id !== "" ? true : false,
      usedUser:
        this.props.otherUser.user_id !== ""
          ? this.props.otherUser
          : this.props.user
    };
  }

  public render() {
    return (
      <div>
        <span
          onClick={() => {
            this.setState({ usedUser: this.props.user, isOther: false });
          }}
        >
          <TopMenu current={this.state.isOther ? "" : "profile"} />
        </span>
        <img
          className="profile-background"
          src={
            "http://localhost:5000/public/profile-pictures/background-" +
            (!this.state.isOther
              ? this.props.user.gender
              : this.props.otherUser.gender) +
            ".jpg"
          }
          alt="Profile background"
        />
        <div className="top-container">
          <Pictures isOther={this.state.isOther} user={this.state.usedUser} />
          <div className="left-container">
            <div className="user-name">
              {this.state.isOther
                ? this.props.otherUser.user_name
                : this.props.user.user_name}
            </div>
            <Connection
              connection={
                this.state.isOther
                  ? this.props.otherUser.connection
                  : "Online now !"
              }
            />
            <ProgressBar progressBarPercent={this.state.usedUser.score} />
            {this.state.isOther ? (
              <Like otherUser={this.props.otherUser} />
            ) : null}
          </div>
        </div>
        <div className="block-container">
          <div className="middle-container">
            <Personal isOther={this.state.isOther} user={this.state.usedUser} />
            <Preferences
              isOther={this.state.isOther}
              user={this.state.usedUser}
            />
          </div>
        </div>
        <div className="block-container">
          <div className="end-container">
            {this.state.isOther ? null : <Password />}
            <Tags isOther={this.state.isOther} user={this.state.usedUser} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return {
    user: {
      ...state.user,
      pictures:
        state.user.pictures && state.user.pictures.length > 0
          ? state.user.pictures
          : [{ date: "1", path: "unknown.png", main: false }]
    },
    otherUser: state.otherUser
  };
};

export default connect(mapStateToProps)(Profile);
