import * as React from "react";
import "../styles/stylesUserHome.css";
import Pictures from "./Pictures";
import ProgressBar from "./ProgressBar";
import { Redirect } from "react-router";
//tag font size
//button
//max tag nb
interface Props {
  userInfo: {
    id: string;
    name: string;
    city: string;
    age: string;
    connection: string;
    gender: string;
    popularityScore: string;
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

// class UserTags extends React.Component {
// public
// }

class UserCard extends React.Component<Props> {
  hsl_col_perc(percent: string) {
    const nb = +percent;
    var a = nb / 100,
      b = (120 - 0) * a,
      c = b + 0;

    // Return a CSS HSL string
    return "hsl(" + c + ", 120%, 40%)";
  }
  public render() {
    const today = new Date();
    const lastSeen = new Date(this.props.userInfo.connection);
    const msInDay = 24 * 60 * 60 * 1000;

    lastSeen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const lastSeenSince = (+today - +lastSeen) / msInDay;
    // console.log(lastSeenSince);
    var genderIcon = "mars stroke horizontal icon";
    if (this.props.userInfo.gender == "Woman") {
      genderIcon = "venus icon";
    } else if (this.props.userInfo.gender == "Man") {
      genderIcon = "mars icon";
    }

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
          {/* <div className="popularity"></div> */}
          {/* <ProgressBar /> */}
        </div>
        <div className="content">
          <a className="header">
            {this.props.userInfo.name}
            <span className="right floated popscore ">
              <div
                style={{
                  color: this.hsl_col_perc(this.props.userInfo.popularityScore)
                }}
                className="ui large label"
              >
                {this.props.userInfo.popularityScore}%
              </div>
            </span>
          </a>
          <div className="meta">
            <span className="date">{this.props.userInfo.city}</span>
          </div>
          <div className="description">
            {this.props.userInfo.tags.map(tag => (
              <button key={tag.tag_id.toString()} className="mini ui tag label">
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="extra content">
          <a>
            <i className={genderIcon}></i>
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
