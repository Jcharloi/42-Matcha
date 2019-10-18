import * as React from "react";
import Axios from "axios";
import { deleteUser, findLastSince } from "../../App";

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
    receiverId: string,
    user: { name: string; id: string; picture: string; lastConnection: string }
  ) => void;
  receiverId: string;
}

class HistoryMessages extends React.Component<Props, {}> {
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
              key={senderId === this.props.receiverId ? receiverId : senderId}
              style={{
                border: "1px solid rgb(209, 212, 214)",
                backgroundColor:
                  !receiverRead && senderId !== this.props.receiverId
                    ? "rgba(241, 239, 239, 0.952)"
                    : "white"
              }}
              onClick={() => {
                if (!receiverRead) {
                  this.readMessage(senderId, receiverId, messageId);
                }
                this.props.displayHistory(false, receiverId, {
                  name: senderName,
                  id:
                    senderId === this.props.receiverId ? receiverId : senderId,
                  picture: mainPicture,
                  lastConnection
                });
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
                      findLastSince(lastConnection).split(" ")[1] === "seconds"
                        ? "ring ring-color-online"
                        : "ring ring-color-offline"
                    }
                  ></div>
                </div>
                <span className="date-history">
                  Last message {findLastSince(date)}
                </span>
                <div className="text-history">
                  {senderId === this.props.receiverId ? "You : " : ""}
                  {message}
                </div>
                <Icon
                  className="icon-history"
                  size="large"
                  name={
                    receiverRead
                      ? senderRead
                        ? "check circle outline"
                        : "circle outline"
                      : senderId === this.props.receiverId
                      ? "circle outline"
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
