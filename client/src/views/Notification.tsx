import * as React from "react";
import Axios from "axios";
import history from "../helpers/history";
import { store } from "../redux/store";

import { insertOtherProfile } from "../redux/actions/actions";

import { Link } from "react-router-dom";
import { User } from "../models/models";
import { deleteUser, findLastSince } from "../App";

import TopMenu from "../components/TopMenu";

import { Image, Icon, Feed, Button } from "semantic-ui-react";
import "../styles/stylesUserNotifications.css";

interface NState {
  notificationArray: Array<{
    sender: string;
    date: string;
    notif_type: string;
    seen: boolean;
    mainPicPath: string;
  }>;
  current: string;
}

class Notification extends React.Component<{}, NState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      notificationArray: [],
      current: "notifications"
    };
  }
  componentDidMount = () => {
    Axios.put(`http://localhost:5000/profile/get-notification`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { notificationArray, validated } }) => {
        if (validated) {
          this.setState({ notificationArray });
        }
      })
      .catch(err => console.error(err));
  };
  selectProfile = (otherUser: string) => {
    Axios.put(`http://localhost:5000/profile/get-user-infos`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetName: otherUser
    })
      .then(({ data: { validToken, validated, userInfos } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            store.dispatch(insertOtherProfile(userInfos));
            history.push(`/profile/${userInfos.user_name}`);
          }
        }
      })
      .catch(err => console.error(err));
  };
  checkNotif = (targetNotif: any) => {
    Axios.put(`http://localhost:5000/profile/saw-notification`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      sender: targetNotif.sender,
      date: targetNotif.date,
      notif_type: targetNotif.notif_type
    }).then(() => {
      Axios.put(`http://localhost:5000/profile/get-notification`, {
        userName: localStorage.getItem("user_name"),
        token: localStorage.getItem("token")
      })
        .then(({ data: { notificationArray, validated } }) => {
          if (validated) {
            this.setState({ notificationArray });
          }
        })
        .catch(err => console.error(err));
    });
  };

  public render() {
    return (
      <div>
        <TopMenu current="notifications" />
        <div className="notification-container">
          <Feed>
            {this.state.notificationArray.map((notif, index) => (
              <Feed.Event
                key={notif.date}
                className={
                  notif.seen
                    ? "notification-user-container"
                    : "notification-user-container-unseen"
                }
              >
                {console.log(notif.mainPicPath)}
                <Image
                  className="avatar-visit"
                  avatar
                  size="tiny"
                  src={`http://localhost:5000/public/profile-pictures/${notif.mainPicPath}`}
                />
                <Feed.Content className="feed-content">
                  <div className="link-feed">
                    <span onClick={() => this.selectProfile(notif.sender)}>
                      <Link to={`/profile/` + notif.sender}>
                        {notif.sender}
                      </Link>
                    </span>
                    &nbsp;
                    {notif.notif_type === "match"
                      ? "matched"
                      : notif.notif_type === "dislike"
                      ? "disliked"
                      : "visited"}
                    {` your profile`}
                    &nbsp;
                    {/* <Icon
                      name={this.state.current === "likes" ? "star" : "eye"}
                      color={this.state.current === "likes" ? "yellow" : "blue"}
                    /> */}
                    <Button
                      icon
                      onClick={() => this.checkNotif(notif)}
                      // onCLick={() => console.log("test")}
                      labelPosition="right"
                    >
                      OK
                      <Icon className="checkmark" />
                    </Button>
                  </div>

                  <Feed.Date className="time-feed">
                    {findLastSince(notif.date)}
                  </Feed.Date>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        </div>
      </div>
    );
  }
}

export default Notification;
