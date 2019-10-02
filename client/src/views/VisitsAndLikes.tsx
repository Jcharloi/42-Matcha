import * as React from "react";
import Axios from "axios";
import history from "../helpers/history";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import { List, Image } from "semantic-ui-react";
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
      token: localStorage.getItem("token")
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

  find_last_since = (lastseen: string) => {
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
          <List relaxed size="massive">
            {this.state.userInfos.map((user, index) => (
              <List.Item key={index}>
                <Image
                  className="avatar"
                  avatar
                  src={`http://localhost:5000/public/profile-pictures/${user.path}`}
                />
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={() => {
                      history.push(`/profile/${user.user_name}`);
                    }}
                  >
                    {user.user_name}
                  </List.Header>
                  <List.Description>
                    {this.state.current === "likes"
                      ? `liked your profile `
                      : `visited your profile ${this.find_last_since(
                          user.date
                        )}`}
                  </List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default VisitsAndLikes;
