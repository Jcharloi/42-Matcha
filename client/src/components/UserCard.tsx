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

class TagButton extends React.Component {
  public render() {
    return <button className="mini ui button">Mini</button>;
  }
}

class UserCard extends React.Component<Props> {
  public render() {
    const today = new Date();
    const lastSeen = new Date(this.props.userInfo.connection);
    const msInDay = 24 * 60 * 60 * 1000;

    lastSeen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const lastSeenSince = (+today - +lastSeen) / msInDay;
    // console.log(lastSeenSince);

    console.log(this.props.userInfo.tags);
    console.log("hello");
    return (
      <div className="ui card user">
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic-card"
            src={`http://localhost:5000/public/fake-pictures/${this.props.userInfo.pictures[0].path}`}
            // src="http://localhost:5000/public/profile-pictures/psim.jpg"
            // src="http://localhost:5000/public/fake-pictures/001957.png"
          />
        </div>
        <div className="content">
          <a className="header">{this.props.userInfo.name}</a>
          <div className="meta">
            <span className="date">{this.props.userInfo.city}</span>
          </div>
          <div className="description">
            <TagButton />
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
