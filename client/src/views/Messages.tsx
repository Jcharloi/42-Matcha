import * as React from "react";
import socketIOClient from "socket.io-client";
import { State } from "../redux/types/types";
import { connect } from "react-redux";

import TopMenu from "../components/TopMenu";
import { User } from "../models/models";
import { Image, Icon, Divider } from "semantic-ui-react";
import "../styles/stylesMessages.css";

interface MState {
  isLoading: boolean;
  users: Array<{
    senderId: string;
    senderName: string;
    lastConnection: string;
    date: string;
    message: string;
    senderRead: boolean;
    receiverRead: boolean;
    mainPicture: string;
  }>;
}

class Messages extends React.Component<User, MState> {
  constructor(props: User) {
    super(props);
    this.state = {
      isLoading: true,
      users: [
        {
          senderId: "",
          senderName: "",
          lastConnection: "",
          date: "",
          message: "",
          senderRead: false,
          receiverRead: false,
          mainPicture: ""
        }
      ]
    };
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:5001");
    socket.emit("Get all messages", { receiverId: this.props.user_id });
    socket.on(
      "Receive all messages",
      (
        users: Array<{
          senderId: string;
          senderName: string;
          lastConnection: string;
          date: string;
          message: string;
          senderRead: boolean;
          receiverRead: boolean;
          mainPicture: string;
        }>
      ) => {
        this.setState({ users, isLoading: false });
      }
    );
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

  public render() {
    return (
      <div>
        <TopMenu current="messages" />
        <div className="container-message">
          {!this.state.isLoading &&
            this.state.users.map(
              ({
                senderId,
                senderName,
                message,
                date,
                senderRead,
                receiverRead,
                lastConnection,
                mainPicture
              }) => (
                <div
                  className="container-user"
                  key={senderId}
                  style={{
                    border: "1px solid rgb(209, 212, 214)",
                    backgroundColor: !receiverRead
                      ? "rgba(241, 239, 239, 0.952)"
                      : "white"
                  }}
                >
                  <Image
                    className="avatar-visit"
                    avatar
                    size="tiny"
                    src={`http://localhost:5000/public/profile-pictures/${mainPicture}`}
                  />
                  <div className="middle-message">
                    <div className="name-container">
                      <div className="name">{senderName}</div>
                      <div
                        className={
                          this.findLastSince(lastConnection) === "just now"
                            ? "ring ring-color-online"
                            : "ring ring-color-offline"
                        }
                      ></div>
                    </div>
                    <span className="date-message">
                      Last message {this.findLastSince(date)}
                    </span>
                    <div className="text-message">{message}</div>
                    <Icon
                      className="icon-message"
                      size="large"
                      name={
                        senderRead
                          ? "check circle outline"
                          : receiverRead
                          ? "circle outline"
                          : "circle"
                      }
                    />
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Messages);
