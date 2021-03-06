import * as React from "react";
import Axios from "axios";
import history from "../helpers/history";
import { Link } from "react-router-dom";
import { deleteUser, findLastSince } from "../App";
import { store } from "../redux/store";
import { insertOtherProfile } from "../redux/actions/actions";
import { User } from "../models/models";
import TopMenu from "../components/TopMenu";

import { Image, Icon, Feed } from "semantic-ui-react";
import "../styles/stylesUserVisits.css";

interface VState {
  userInfoAll: Array<User>;
  visitDate: Array<{ date: string }>;
  current: string;
}

class VisitsAndLikes extends React.Component<{}, VState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userInfoAll: [],
      visitDate: [],
      current:
        window.location.pathname.search("/likes") !== -1
          ? "likes"
          : window.location.pathname.search("/visits") !== -1
          ? "visits"
          : ""
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
    Axios.post(`http://localhost:5000/profile/get-user-${this.state.current}`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      current: this.state.current
    })
      .then(({ data: { validated, userInfoAll, visitDate, validToken } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this._isMounted && this.setState({ userInfoAll, visitDate });
          }
        }
      })
      .catch(err => console.error(err));
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  selectProfile = (otherUser: User) => {
    store.dispatch(insertOtherProfile(otherUser));
    history.push(`/profile/${otherUser.user_name}`);
  };

  public render() {
    return (
      <div>
        <TopMenu current={this.state.current} />
        <div className="topmenu-buffer"></div>
        <div className="visit-container">
          <Feed>
            {this.state.userInfoAll.map((user, index) => (
              <Feed.Event key={user.user_id} className="user-container">
                <Image
                  className="avatar-visit"
                  avatar
                  size="tiny"
                  src={`http://localhost:5000/public/profile-pictures/${user.pictures[0].path}`}
                />
                <Feed.Content className="feed-content">
                  <div
                    className="link-feed"
                    onClick={() => this.selectProfile(user)}
                  >
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
                  <Feed.Date className="time-feed">
                    {findLastSince(this.state.visitDate[index].date)}
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

export default VisitsAndLikes;
