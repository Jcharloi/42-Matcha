import * as React from "react";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import Axios from "axios";

import TopMenu from "../components/TopMenu";
import Pictures from "../components/Profile/Pictures";
import Connection from "../components/Profile/Connection";
import ProgressBar from "../components/Profile/ProgressBar";
import Like from "../components/Profile/Like";
import Personal from "../components/Profile/Personal";
import Preferences from "../components/Profile/Preferences";
import Password from "../components/Profile/Password";
import Tags from "../components/Profile/Tags";
import ReportAndBlock from "../components/Profile/ReportAndBlock";
import RemoveAccount from "../components/Profile/RemoveAccount";

import "../styles/stylesUserProfile.css";

interface Props {
  isOther: boolean;
  user: User;
}

class Profile extends React.Component<Props> {
  componentDidMount = async () => {
    if (this.props.isOther) {
      await Axios.post("http://localhost:5000/profile/visit", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name"),
        visitedUser: this.props.user.user_name
      })
        .then(() => {})
        .catch(error => {
          console.log("Error : ", error.message);
        });
    }
  };

  public render() {
    return (
      <div>
        <TopMenu current={this.props.isOther ? "" : "profile"} />
        <img
          className="profile-background"
          src={
            "http://localhost:5000/public/profile-pictures/background-" +
            this.props.user.gender +
            ".jpg"
          }
          alt="Profile background"
        />
        <div className="top-container">
          <div className="left-container">
            <div className="left-container-child">
              <Pictures isOther={this.props.isOther} user={this.props.user} />
              <div className="user-name">{this.props.user.user_name}</div>
              <Connection connection={this.props.user.connection} />
            </div>
          </div>
          <div className="right-container">
            <div className="right-container-child">
              <ProgressBar isOther={this.props.isOther} />
              {this.props.isOther &&
              this.props.user.pictures[0].date !== "1" ? (
                <Like otherUser={this.props.user} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="block-container">
          <div className="middle-container">
            <Personal isOther={this.props.isOther} user={this.props.user} />
            <Preferences isOther={this.props.isOther} user={this.props.user} />
          </div>
        </div>
        <div className="block-container">
          <div className="end-container">
            {this.props.isOther ? (
              <ReportAndBlock
                name={this.props.user.user_name}
                gender={this.props.user.gender}
                id={this.props.user.user_id}
              />
            ) : (
              <span>
                <Password />
                <RemoveAccount />
              </span>
            )}
            <Tags isOther={this.props.isOther} user={this.props.user} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return {
    isOther: state.otherUser.user_id === "" ? false : true,
    user:
      state.otherUser.user_id === ""
        ? {
            ...state.user,
            pictures:
              state.user.pictures && state.user.pictures.length > 0
                ? state.user.pictures
                : [{ date: "1", path: "unknown.png", main: false }]
          }
        : { ...state.otherUser }
  };
};

export default connect(mapStateToProps)(Profile);
