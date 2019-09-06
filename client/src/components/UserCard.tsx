import * as React from "react";
import "../styles/stylesUserHome.css";

class UserCard extends React.Component {
  public render() {
    return (
      <div className="ui card user">
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic"
            src="http://localhost:5000/public/profile-pictures/tracteur.jpg"
          />
        </div>
        <div className="content">
          <a className="header">psim</a>
          <div className="meta">
            <span className="date">Offline since 1 month</span>
          </div>
          <div className="description">I liek eggs XD</div>
        </div>
        <div className="extra content">
          <a>
            <i className="road icon"></i>
            42 km
          </a>
        </div>
      </div>
    );
  }
}
export default UserCard;
