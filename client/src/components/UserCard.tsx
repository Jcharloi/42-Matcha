import * as React from "react";

import "../styles/stylesUserHome.css";

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

interface CState {
  genderIcon: string;
  lastSeenSince: number;
}

class UserCard extends React.Component<Props, CState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      genderIcon: "mars stroke horizontal icon",
      lastSeenSince:
        (+new Date().setHours(0, 0, 0, 0) -
          +new Date(this.props.userInfo.connection).setHours(0, 0, 0, 0)) /
        (24 * 60 * 60 * 1000)
    };
  }

  hsl_col_perc(percent: string): string {
    const nb = +percent;
    var a = nb / 100,
      b = (120 - 0) * a,
      c = b + 0;

    return "hsl(" + c + ", 120%, 40%)";
  }

  find_last_since(lastseen: string) {
    var dateSeen: any = new Date(lastseen);
    var dateNow: any = new Date();
    var plural: string = "s";

    var seconds = Math.floor((dateNow - dateSeen) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 31);
    if (minutes === 1 || hours === 1 || days === 1 || months === 1) plural = "";

    if (months) return months.toString() + " month" + plural + " ago";
    if (days) return days.toString() + " day" + plural + " ago";
    if (hours) return hours.toString() + " hour" + plural + " ago";
    if (minutes) return minutes.toString() + " minute" + plural + " ago";
    return "Just Now";
  }

  public render() {
    // console.log(this.find_time_unit(this.props.userInfo.connection));
    if (this.props.userInfo.gender === "Woman") {
      this.setState({ genderIcon: "venus icon" });
    } else if (this.props.userInfo.gender === "Man") {
      this.setState({ genderIcon: "mars icon" });
    }
    return (
      <div className="ui card user">
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic-card"
            src={`http://localhost:5000/public/fake-pictures/${this.props.userInfo.pictures[0].path}`}
          />
        </div>
        <div className="content">
          <div className="header">
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
          </div>
          <div className="meta">
            <span className="date">{this.props.userInfo.city}</span>
          </div>
          <div className="description">
            {this.props.userInfo.tags.slice(0, 2).map((tag, index) => (
              <button key={index} className="tag-home ui tag label">
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="extra content">
          <span>
            <i className={this.state.genderIcon}></i>
            {this.props.userInfo.age} years old
          </span>
          <span className="right floated">
            Last seen {this.find_last_since(this.props.userInfo.connection)}
          </span>
        </div>
      </div>
    );
  }
}
export default UserCard;
