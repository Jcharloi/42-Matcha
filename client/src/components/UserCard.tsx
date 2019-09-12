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
  };
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
    console.log(userPicMain.path);
    return (
      <div className="ui card user">
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic-card"
            // src={`http://localhost:5000/public/profile-pictures/${userPicMain.path}`}
            src="http://localhost:5000/public/profile-pictures/psim.jpg"
          />
        </div>
        <div className="content">
          <a className="header">{this.props.userInfo.name}</a>
          <div className="meta">
            <span className="date">Connected {lastSeenSince} days ago</span>
          </div>
          <div className="description">blblbl</div>
        </div>
        <div className="extra content">
          <a>
            <i className="road icon"></i>
            {this.props.userInfo.city}
          </a>
        </div>
      </div>
    );
  }
}
export default UserCard;
