import * as React from "react";
import Axios from "axios";
import { deleteUser } from "../../App";

import { Image, Icon } from "semantic-ui-react";
import "../../styles/stylesMessages.css";

interface Props {
  users: Array<{
    senderId: string;
    senderName: string;
    receiverId: string;
    lastConnection: string;
    date: string;
    message: string;
    messageId: string;
    senderRead: boolean;
    receiverRead: boolean;
    mainPicture: string;
  }>;
  displayHistory: (
    displayHistory: boolean,
    userName: string,
    userId: string
  ) => void;
}

class HistoryMessages extends React.Component<Props, {}> {
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

  readMessage = (senderId: string, receiverId: string, messageId: string) => {
    Axios.put("http://localhost:5000/message/read-message", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      senderId,
      receiverId,
      messageId
    })
      .then(({ data: { validToken } }) => {
        if (validToken === false) {
          deleteUser();
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };

  public render() {
    return (
      <div className="container-history">
        {this.props.users.map(
          ({
            senderId,
            senderName,
            receiverId,
            message,
            messageId,
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
              onClick={() => {
                if (!receiverRead) {
                  this.readMessage(senderId, receiverId, messageId);
                }
                this.props.displayHistory(false, senderName, senderId);
              }}
            >
              <Image
                className="avatar-visit"
                avatar
                size="tiny"
                src={`http://localhost:5000/public/profile-pictures/${mainPicture}`}
              />
              <div className="middle-history">
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
                <span className="date-history">
                  Last message {this.findLastSince(date)}
                </span>
                <div className="text-history">{message}</div>
                <Icon
                  className="icon-history"
                  size="large"
                  name={
                    receiverRead
                      ? senderRead
                        ? "check circle outline"
                        : "circle outline"
                      : "circle"
                  }
                />
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

export default HistoryMessages;
