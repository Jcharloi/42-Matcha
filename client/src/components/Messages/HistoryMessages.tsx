import * as React from "react";
import { findLastSince } from "../../App";
import { NumberOf } from "../../models/models";

import { Image, Icon } from "semantic-ui-react";
import "../../styles/stylesMessages.css";

interface Props {
  displayLittle: boolean;
  littleMessages: boolean;
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
    picture: string;
  }>;
  numberOf: NumberOf;
  receiverId: string;
  getMessagesPeople: (senderName: string, receiverName: string | null) => void;
}

class HistoryMessages extends React.Component<Props, {}> {
  public render() {
    return (
      <div
        className={
          !this.props.littleMessages
            ? "container-history"
            : "container-history-little"
        }
        style={{
          display: this.props.displayLittle ? "flex" : "none"
        }}
      >
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
            picture
          }) => (
            <div
              className={
                !this.props.littleMessages
                  ? "container-user"
                  : "container-user-little"
              }
              key={senderId === this.props.receiverId ? receiverId : senderId}
              style={{
                border: "1px solid rgb(209, 212, 214)",
                backgroundColor:
                  !receiverRead && senderId !== this.props.receiverId
                    ? "rgba(241, 239, 239, 0.952)"
                    : "white"
              }}
              onClick={() => {
                this.props.getMessagesPeople(
                  senderName,
                  localStorage.getItem("user_name")
                );
              }}
            >
              <Image
                className="avatar-visit"
                avatar
                size={!this.props.littleMessages ? "tiny" : undefined}
                src={`http://localhost:5000/public/profile-pictures/${picture}`}
              />
              <div className="middle-history">
                <div className="name-container">
                  <div className="name">{senderName}</div>
                  <div className="container-ring">
                    <div
                      className={
                        findLastSince(lastConnection).split(" ")[1] ===
                        "seconds"
                          ? "ring ring-color-online"
                          : "ring ring-color-offline"
                      }
                    ></div>
                  </div>
                  <span className="date-history">
                    {!this.props.littleMessages
                      ? `Last message ${findLastSince(date)}`
                      : findLastSince(date)}
                  </span>
                </div>
                <div
                  className={
                    !this.props.littleMessages
                      ? "container-text-history"
                      : "container-text-history-little"
                  }
                >
                  <div className="text-history">
                    {senderId === this.props.receiverId ? "You : " : ""}
                    {message}
                  </div>
                  <Icon
                    className={
                      !this.props.littleMessages
                        ? "icon-history"
                        : "icon-history-little"
                    }
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
            </div>
          )
        )}
      </div>
    );
  }
}

export default HistoryMessages;
