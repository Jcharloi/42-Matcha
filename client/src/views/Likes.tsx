import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import history from "../helpers/history";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import { List, Image } from "semantic-ui-react";
import "../styles/stylesUserLikes.css";

interface VState {
  userLikesInfo: Array<{
    likeing_user_id: string;
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
  componentDidMount = () => {
    Axios.post("http://localhost:5000/profile/get-user-likes", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(
        ({ data: { validated, message, rows: userLikesInfo, validToken } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              this.setState({ userLikesInfo });
              console.log(userLikesInfo);
            }
          }
        }
      )
      .catch(err => console.error(err));
  };
  public render() {
    return (
      <div>
        <TopMenu current="home" />
        <div className="like-container">
          <List relaxed size="massive">
            {this.state.userLikesInfo.map((pencil, index) => (
              <List.Item key={index}>
                <Image
                  className="avatar"
                  avatar
                  src={`http://localhost:5000/public/profile-pictures/${pencil.path}`}
                />
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={() => {
                      history.push(`/profile/${pencil.user_name}`);
                    }}
                  >
                    {pencil.user_name}
                  </List.Header>
                  <List.Description>Liked your profile</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Likes);
