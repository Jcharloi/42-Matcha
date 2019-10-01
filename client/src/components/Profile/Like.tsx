import * as React from "react";
import { User } from "../../models/models";
import Axios from "axios";
import { deleteUser } from "../../App";
import { store } from "../../redux/store";
import { insertOtherProfile } from "../../redux/actions/actions";

import { Icon, Button } from "semantic-ui-react";
import "../../styles/stylesLike.css";

interface Props {
  otherUser: User;
}

interface State {
  isLiked: boolean;
  alreadyLiked: boolean;
  isMatched: boolean;
}

class Like extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLiked: false,
      alreadyLiked: false,
      isMatched: false
    };
  }

  componentDidMount = async () => {
    this.handleMatchAndLike(false);
  };

  handleMatchAndLike = async (toggle: boolean) => {
    await Axios.put("http://localhost:5000/profile/check-like-and-match", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetUser: this.props.otherUser.user_name,
      toggle
    })
      .then(
        ({
          data: {
            infos: { selfLikedTarget, targetLikedSelf, matched },
            score,
            validToken
          }
        }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (score && score !== 0) {
              store.dispatch(
                insertOtherProfile({ ...this.props.otherUser, score: score })
              );
            }
            this.setState({
              alreadyLiked: selfLikedTarget,
              isLiked: targetLikedSelf,
              isMatched: matched
            });
          }
        }
      )
      .catch(error => {
        console.log("Error : ", error.message);
      });
  };

  public render() {
    return (
      <div className="container-match">
        {this.state.isMatched ? (
          <div>
            <div className="text-container">
              <Icon name="star" color="yellow" size="large" />
              <span className="text-match">This is a match !</span>
            </div>
            <Button.Group>
              <Button className="purple">
                <Icon name="comments" /> Talk
              </Button>
              <Button.Or />
              <Button
                className="red"
                onClick={() => {
                  this.handleMatchAndLike(true);
                }}
              >
                <Icon name="fire" />
                Dislove
              </Button>
            </Button.Group>
          </div>
        ) : (
          <div>
            {this.state.isLiked ? (
              <Button
                className="red liked-button"
                size="large"
                circular
                onClick={() => {
                  this.handleMatchAndLike(true);
                }}
              >
                <span>{this.props.otherUser.user_name} loved you !&nbsp;</span>
                <span>
                  Love back&nbsp;&nbsp;
                  <Icon name="heart" />
                </span>
              </Button>
            ) : this.state.alreadyLiked ? (
              <div className="waiting-for-love">
                <Button
                  className="red liked-button"
                  circular
                  onClick={() => {
                    this.handleMatchAndLike(true);
                  }}
                >
                  <span>
                    You love {this.props.otherUser.user_name} !&nbsp;
                    Dislove&nbsp;
                    <Icon name="hourglass half" />
                  </span>
                </Button>
              </div>
            ) : (
              <Button
                className="red liked-button"
                size="large"
                circular
                onClick={() => {
                  this.handleMatchAndLike(true);
                }}
              >
                Love &nbsp;&nbsp;
                <Icon name="fire" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Like;
