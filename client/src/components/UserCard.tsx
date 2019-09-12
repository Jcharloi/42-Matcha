import * as React from "react";
import "../styles/stylesUserHome.css";
import Pictures from "./Pictures";

interface Props {
  userInfo: {
    id: string;
    name: string;
    city: string;
    age: string;
    connection: string;
    pictures: [
      {
        path: string;
        date: string;
        main: boolean;
      }
    ];
    tags: [
      {
        tag_id: string;
        name: string;
        custom: boolean;
      }
    ];
  };
}

class MatchedUserTag extends React.Component {
  public render() {
    return <button className="mini ui button">Mini</button>;
  }
}

class UserCard extends React.Component<Props> {
  public render() {
    var today = new Date();
    var lastSeen = new Date(this.props.userInfo.connection);
    var msInDay = 24 * 60 * 60 * 1000;

    lastSeen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    var lastSeenSince = (+today - +lastSeen) / msInDay;
    // console.log(lastSeenSince);
    var userPic = this.props.userInfo.pictures;
    var userPicMain = userPic[0];
    // console.log(userPicMain.path);
    console.log(this.props.userInfo.tags);
    return (
      <div className="ui card user">
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic-card"
            src={`http://localhost:5000/public/fake-pictures/${userPicMain.path}`}
            // src="http://localhost:5000/public/profile-pictures/psim.jpg"
          />
        </div>
        <div className="content">
          <a className="header">{this.props.userInfo.name}</a>
          <div className="meta">
            <span className="date">{this.props.userInfo.city}</span>
          </div>
          <div className="description">
            <MatchedUserTag />
          </div>
        </div>
        <div className="extra content">
          <a>
            <i className="birthday cake icon"></i>
            {this.props.userInfo.age} years old
          </a>
          <span className="right floated">
            Last seen {lastSeenSince} days ago
          </span>
        </div>
      </div>
    );
  }
}
export default UserCard;
