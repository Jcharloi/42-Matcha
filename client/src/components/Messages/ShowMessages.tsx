import * as React from "react";
import socket from "../../helpers/socket";
import history from "../../helpers/history";
import { deleteUser } from "../../App";
import Axios from "axios";

import { Icon, TextArea, Image, Form } from "semantic-ui-react";
import Scroll from "react-scroll";
import "../../styles/stylesMessages.css";

const scroll = Scroll.animateScroll;

interface Props {
  sender: {
    name: string;
    id: string;
    picture: string;
    lastConnection: string;
  };
  receiverId: string;
  displayHistory: (
    displayHistory: boolean,
    receiverId: string,
    user: { name: string; id: string; picture: string; lastConnection: string }
  ) => void;
}

interface State {
  isLoading: boolean;
  allMessages: Array<{
    message: string;
    messageId: string;
    date: string;
    senderId: string;
    receiverRead: boolean;
    senderRead: boolean;
  }>;
  newMessage: string;
}

class ShowMessages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      allMessages: [],
      newMessage: ""
    };
  }

  componentDidMount = () => {
    this.scrollToBottom();
    Axios.put("http://localhost:5000/message/get-messages-people", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      senderId: this.props.sender.id,
      receiverId: this.props.receiverId
    })
      .then(({ data: { validToken, validated, allMessages } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({
              isLoading: false,
              allMessages
            });
            socket.on(
              "Send new message",
              (messageReceived: {
                message: string;
                messageId: string;
                date: string;
                senderId: string;
                receiverRead: boolean;
                senderRead: boolean;
              }) => {
                const newMessages = [
                  ...this.state.allMessages,
                  messageReceived
                ];
                if (this.state.allMessages.length !== newMessages.length) {
                  this.setState({
                    allMessages: newMessages
                  });
                }
              }
            );
          }
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  componentWillUnmount = () => {
    //
  };

  scrollToBottom() {
    scroll.scrollToBottom({
      containerId: "show-message"
    });
  }

  findLastSince(lastseen: string) {
    if (lastseen !== "Just now") {
      lastseen = new Date(+lastseen * 1000).toISOString();
    }
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
  }

  setNewMessage = (newMessage: string) => {
    this.setState({ newMessage });
  };

  sendMessage = () => {
    Axios.post("http://localhost:5000/message/send-new-message", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      message: this.state.newMessage,
      senderId: this.props.sender.id,
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
  };

  showProfileUser = () => {
    console.log("show profile user");
    history.push("/profile/" + this.props.sender.name);
  };

  public render() {
    return (
      <div>
        {!this.state.isLoading && (
          <div className="container-message">
            <Icon
              className="icon-message"
              size="huge"
              name="long arrow alternate left"
              onClick={() =>
                this.props.displayHistory(true, "", {
                  name: "",
                  id: "",
                  picture: "",
                  lastConnection: ""
                })
              }
            />
            <div className="container-conv">
              <div className="show-profile">
                <div className="container-profile">
                  <Image
                    className="avatar-message"
                    avatar
                    size="tiny"
                    src={`http://localhost:5000/public/profile-pictures/${this.props.sender.picture}`}
                    onClick={this.showProfileUser}
                  />
                  <div className="name-profile" onClick={this.showProfileUser}>
                    {this.props.sender.name}
                  </div>
                  <div
                    className={
                      this.findLastSince(this.props.sender.lastConnection) ===
                      "just now"
                        ? "ring ring-color-online"
                        : "ring ring-color-offline"
                    }
                  ></div>
                  <span className="last-connection">
                    Online{" "}
                    {this.findLastSince(this.props.sender.lastConnection)}
                  </span>
                </div>
              </div>
              <div className="show-messages" id="show-message">
                {this.state.allMessages.map(
                  ({ date, message, messageId, senderId }) => (
                    <div key={messageId}>
                      <div
                        className={
                          senderId === this.props.sender.id
                            ? "date-value-sender"
                            : "date-value-receiver"
                        }
                      >
                        {this.findLastSince(date)}
                      </div>
                      <div
                        className={`container-message-${
                          senderId !== this.props.sender.id
                            ? "receiver"
                            : "sender"
                        }`}
                      >
                        <div
                          className={"message-value"}
                          style={{
                            backgroundColor:
                              this.props.sender.id === senderId
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
                  />
                </Form>
                <Icon
                  name="paper plane"
                  size="big"
                  className="send-icon"
                  onClick={this.sendMessage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ShowMessages;
