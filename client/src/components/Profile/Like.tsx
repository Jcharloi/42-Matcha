import * as React from "react";
import { User } from "../../models/models";

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
    // await Axios.put("http://localhost:5000/profile/check-match", {
    //   token: localStorage.getItem("token"),
    //   userName: localStorage.getItem("user_name"),
    //   targetUser: this.props.otherUser.user_id
    // })
    //   .then(({ data: { selfLikedTarget, targetLikedSelf, matched, validToken } }) => {
    //     if (!validToken) {
    //       deleteUser();
    //     } else {
    //       this.setState({ isAlreadyLiked: selfLikedTarget, isLiked: targetLikedSelf, isMatched: matched });
    //     }
    //   })
    //   .catch(error => {
    //     console.log("Error : ", error.message);
    //   });
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
              <Button className="orange">
                <Icon name="comments" /> Talk
              </Button>
              <Button.Or />
              <Button
                className="red"
                onClick={() => {
                  this.setState({ isMatched: false, isLiked: true });
                  //bdd
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
                  this.setState({ isMatched: true, isLiked: true });
                  //bdd
                }}
              >
                <span>{this.props.otherUser.user_name} loved you !&nbsp;</span>
                <span>
                  Love back&nbsp;&nbsp;
                  <Icon name="heart" />
                </span>
              </Button>
            ) : this.state.alreadyLiked ? (
              <span>
                You loved {this.props.otherUser.user_name} !
                <Icon name="clock" />
              </span>
            ) : (
              <Button
                className="red liked-button"
                size="large"
                circular
                onClick={() => {
                  //ask if she likes you
                  this.setState({ isMatched: true });
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
