import * as React from "react";
import Axios from "axios";
import history from "../helpers/history";
import { User } from "../models/models";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import { List, Image } from "semantic-ui-react";
import "../styles/stylesUserLikes.css";

interface VState {
  userLikesInfo: Array<{
    liking_user_id: string;
    liked_user_id: string;
    date: string;
    user_name: string;
    path: string;
  }>;
}

class Likes extends React.Component<User, VState> {
  constructor(props: User) {
    super(props);
    this.state = {
      userLikesInfo: []
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
    Axios.post("http://localhost:5000/profile/get-user-likes", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validated, rows: userLikesInfo, validToken } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this._isMounted && this.setState({ userLikesInfo });
          }
        }
      })
      .catch(err => console.error(err));
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  public render() {
    return (
      <div>
        <TopMenu current="likes" />
        <div className="like-container">
          <List relaxed size="massive">
            {this.state.userLikesInfo.map((user, index) => (
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
                  <List.Description>liked your profile</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default Likes;
