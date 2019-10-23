import * as React from "react";
import { socket } from "../../helpers/socket";
import history from "../../helpers/history";
import { deleteUser, findLastSince } from "../../App";
import Axios from "axios";
import { store } from "../../redux/store";
import { insertOtherProfile } from "../../redux/actions/actions";

import { Icon, TextArea, Image, Form } from "semantic-ui-react";
import Scroll from "react-scroll";
import "../../styles/stylesMessages.css";

const scroll = Scroll.animateScroll;

interface Props {
  displayLittle: boolean;
  littleMessages: boolean;
  sender: {
    senderName: string;
    id: string;
    picture: string;
    lastConnection: string;
  };
  allMessages: Array<{
    message: string;
    messageId: string;
    date: string;
    sentPosition: string;
    receiverRead: boolean;
    senderRead: boolean;
  }>;
  receiverId: string;
  getAllMessages: () => void;
}

interface State {
  newMessage: string;
  allMessages: Array<{
    message: string;
    messageId: string;
    date: string;
    sentPosition: string;
    receiverRead: boolean;
    senderRead: boolean;
  }>;
}

class ShowMessages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allMessages: this.props.allMessages,
      newMessage: ""
    };
  }

  componentDidMount = () => {
    this.receiveNewMessages();
    this.scrollToBottom();
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  componentWillUnmount = () => {
    socket.removeListener("New message", this.initNewMessage);
  };

  scrollToBottom() {
    scroll.scrollToBottom({
      containerId: "show-message"
    });
  }

  initNewMessage = (messageReceived: {
    message: string;
    messageId: string;
    date: string;
    sentPosition: string;
    receiverRead: boolean;
    senderRead: boolean;
  }) => {
    const newMessages = [...this.state.allMessages, messageReceived];
    if (this.state.allMessages.length !== newMessages.length) {
      this.setState({
        allMessages: newMessages
      });
    }
  };

  receiveNewMessages = () => {
    socket.on("New message", this.initNewMessage);
  };

  setNewMessage = (newMessage: string) => {
    this.setState({ newMessage });
  };

  sendNewMessage = () => {
    if (this.state.newMessage.trim() !== "") {
      Axios.post("http://localhost:5000/message/send-new-message", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name"),
        message: this.state.newMessage.trim(),
        senderId: this.props.sender.id,
        senderName: this.props.sender.senderName,
        receiverId: this.props.receiverId
      })
        .then(({ data: { validToken, validated } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              this.setState({ newMessage: "" });
            }
          }
        })
        .catch(e => {
          console.log(e.message);
        });
    }
  };

  showProfileUser = (targetName: string) => {
    Axios.put(`http://localhost:5000/profile/get-user-infos`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetName
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

  public render() {
    return (
      <div
        className={
          !this.props.littleMessages
            ? "container-message"
            : "container-message-little"
        }
        style={{
          display: this.props.displayLittle ? "flex" : "none"
        }}
      >
        <Icon
          className="icon-message"
          size={!this.props.littleMessages ? "huge" : "large"}
          name="long arrow alternate left"
          onClick={() => this.props.getAllMessages()}
        />
        <div
          className={
            !this.props.littleMessages
              ? "container-conv"
              : "container-conv-little"
          }
        >
          <div className="show-profile">
            <Image
              className="avatar-message"
              avatar
              size="tiny"
              src={`http://localhost:5000/public/profile-pictures/${this.props.sender.picture}`}
              onClick={() => this.showProfileUser(this.props.sender.senderName)}
            />
            <div
              className="name-profile"
              onClick={() => this.showProfileUser(this.props.sender.senderName)}
            >
              {this.props.sender.senderName}
            </div>
            <div
              className={
                findLastSince(this.props.sender.lastConnection).split(
                  " "
                )[1] === "seconds"
                  ? "ring ring-color-online"
                  : "ring ring-color-offline"
              }
            ></div>
            <span className="last-connection">
              Online{" "}
              {findLastSince(this.props.sender.lastConnection).split(" ")[1] ===
              "seconds"
                ? "now !"
                : findLastSince(this.props.sender.lastConnection)}
            </span>
          </div>
          <div
            className={
              !this.props.littleMessages
                ? "show-messages"
                : "show-messages-little"
            }
            id="show-message"
          >
            {this.state.allMessages.map(
              ({ date, message, messageId, sentPosition }) => (
                <div key={messageId}>
                  <div
                    className={
                      sentPosition === this.props.sender.id
                        ? "date-value-sender"
                        : "date-value-receiver"
                    }
                  >
                    {findLastSince(date)}
                  </div>
                  <div
                    className={`container-message-${
                      sentPosition === this.props.sender.id
                        ? "sender"
                        : "receiver"
                    }`}
                  >
                    <div
                      className={"message-value"}
                      style={{
                        backgroundColor:
                          this.props.sender.id === sentPosition
                            ? "rgb(243, 244, 245)"
                            : "rgb(203, 231, 255)"
                      }}
                    >
                      {message}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="message-typing">
            <Form className="form-textarea">
              <TextArea
                className="textarea-message"
                value={this.state.newMessage}
                placeholder="What do you want to say ?"
                onChange={({ target: { value } }: any) =>
                  this.setNewMessage(value)
                }
                onKeyDown={({ keyCode, shiftKey }: any) => {
                  if (!shiftKey && keyCode === 13) {
                    this.sendNewMessage();
                  }
                }}
              />
            </Form>
            <Icon
              name="paper plane"
              size="big"
              className="send-icon"
              onClick={this.sendNewMessage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ShowMessages;
