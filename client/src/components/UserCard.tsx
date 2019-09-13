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
      genderIcon:
        this.props.userInfo.gender == "Woman" ? "venus icon" : "mars icon",
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

  public render() {
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
            {this.props.userInfo.tags.slice(0, 2).map(tag => (
              <button key={tag.tag_id} className="tag-home ui tag label">
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="extra content">
          <a>
            <i className={this.state.genderIcon}></i>
            {this.props.userInfo.age} years old
          </a>
          <span className="right floated">
            Last seen {this.state.lastSeenSince} days ago
          </span>
        </div>
      </div>
    );
  }
}
export default UserCard;
