import * as React from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import { Image, Icon, Feed } from "semantic-ui-react";
import "../styles/stylesUserVisits.css";

interface VState {
  userInfos: Array<{
    usering_user_id: string;
    usered_user_id: string;
    date: string;
    user_name: string;
    path: string;
  }>;
  current: string;
}

class VisitsAndLikes extends React.Component<{}, VState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userInfos: [],
      current:
        window.location.pathname.search("/likes") !== -1
          ? "likes"
          : window.location.pathname.search("/visits") !== -1
          ? "visits"
          : ""
    };
  }

  componentDidMount = () => {
    Axios.post(`http://localhost:5000/profile/get-user-${this.state.current}`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      current: this.state.current
    })
      .then(({ data: { validated, rows: userInfos, validToken } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({ userInfos });
          }
        }
      })
      .catch(err => console.error(err));
  };

  findLastSince = (lastseen: string) => {
    lastseen = new Date(+lastseen * 1000).toISOString();
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
    return "just now";
  };

  public render() {
    return (
      <div>
        <TopMenu current={this.state.current} />
        <div className="visit-container">
          <Feed>
            {this.state.userInfos.map(user => (
              <Feed.Event key={user.user_name} className="user-container">
                <Image
                  avatar
                  size="tiny"
                  src={`http://localhost:5000/public/profile-pictures/${user.path}`}
                />
                <Feed.Content className="feed-content">
                  <Feed.Date>{this.findLastSince(user.date)}</Feed.Date>
                  <div className="link-feed">
                    <Link to={`/profile/` + user.user_name}>
                      {user.user_name}
                    </Link>
                    &nbsp;
                    {this.state.current === "likes"
                      ? `liked your profile`
                      : `visited your profile`}
                    &nbsp;
                    <Icon
                      name={this.state.current === "likes" ? "star" : "eye"}
                      color={this.state.current === "likes" ? "yellow" : "blue"}
                    />
                  </div>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        </div>
      </div>
    );
  }
}

export default VisitsAndLikes;
