import * as React from "react";
import history from "../../helpers/history";
import { store } from "../../redux/store";
import { insertOtherProfile } from "../../redux/actions/actions";
import { User } from "../../models/models";
import { findLastSince } from "../../App";

import "../../styles/stylesUserHome.css";

interface Props {
  userInfo: User;
}

interface CState {
  genderIcon: string;
}

class UserCard extends React.Component<Props, CState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      genderIcon:
        this.props.userInfo.gender === "Woman"
          ? "venus icon"
          : this.props.userInfo.gender === "Man"
          ? "mars icon"
          : "mars stroke horizontal icon"
    };
  }

  hsl_col_perc(percent: string): string {
    const nb = +percent;
    var a = nb / 100,
      b = (120 - 0) * a,
      c = b + 0;

    return "hsl(" + c + ", 120%, 40%)";
  }

  selectProfile = () => {
    store.dispatch(insertOtherProfile(this.props.userInfo));
    history.push(`/profile/${this.props.userInfo.user_name}`);
  };

  public render() {
    return (
      <div className="ui card user" onClick={this.selectProfile}>
        <div className="image">
          <img
            alt="profile-pic"
            className="profile-pic-card"
            src={`http://localhost:5000/public/profile-pictures/${this.props.userInfo.pictures[0].path}`}
          />
        </div>
        <div className="content">
          <div className="header">
            {this.props.userInfo.user_name}
            <span className="right floated popscore ">
              <div
                style={{
                  color: this.hsl_col_perc(this.props.userInfo.score)
                }}
                className="ui large label"
              >
                {this.props.userInfo.score}%
              </div>
            </span>
          </div>
          <div className="meta">
            <span className="date">{this.props.userInfo.city}</span>
          </div>
          <div>
            {this.props.userInfo.tags.slice(0, 2).map((tag, index) => (
              <button key={index} className="tag-home ui tag label">
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="extra content bottom-card">
          <span>
            <i className={this.state.genderIcon}></i>
            {this.props.userInfo.age} years old
          </span>
          <span className="right floated">
            {findLastSince(this.props.userInfo.connection).split(" ")[1] ===
            "seconds"
              ? "Online now !"
              : `Last seen ${findLastSince(this.props.userInfo.connection)}`}
          </span>
        </div>
      </div>
    );
  }
}
export default UserCard;
