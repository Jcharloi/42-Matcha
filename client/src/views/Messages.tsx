import * as React from "react";
import Axios from "axios";
import { deleteUser } from "../App";
import { State } from "../redux/types/types";
import { connect } from "react-redux";
import TopMenu from "../components/TopMenu";
import HistoryMessages from "../components/Messages/HistoryMessages";
import ShowMessage from "../components/Messages/ShowMessages";
import { User } from "../models/models";
import socket from "../helpers/socket";

import "../styles/stylesMessages.css";

interface Props {
  user: User;
  otherUser: User;
}

interface MState {
  isLoading: boolean;
  displayHistory: boolean;
  historyUsers: Array<{
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
  sender: {
    name: string;
    id: string;
    picture: string;
    lastConnection: string;
  };
  receiverId: string;
}

class Messages extends React.Component<Props, MState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      displayHistory: true,
      historyUsers: [],
      receiverId: "",
      sender: { name: "", id: "", picture: "", lastConnection: "" }
    };
  }

  componentDidMount = () => {
    if (
      window.location.pathname &&
      window.location.pathname.search("/messages/") !== -1
    ) {
      this.setState({
        isLoading: false,
        displayHistory: false,
        sender: {
          name: this.props.otherUser.user_name,
          id: this.props.otherUser.user_id,
          picture: this.props.otherUser.pictures[0].path,
          lastConnection: this.props.otherUser.connection
        }
      });
    } else {
      Axios.put("http://localhost:5000/message/get-all-messages", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name"),
        receiverId: this.props.user.user_id
      })
        .then(({ data: { validToken, validated, usersMessage } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              this.setState({ historyUsers: usersMessage, isLoading: false });
              this.receiveAllMessages();
            }
          }
        })
        .catch(e => {
          console.log(e.message);
        });
    }
  };

  receiveAllMessages = () => {
    socket.on(
      "New history",
      (
        historyReceived: Array<{
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
        }>
      ) => {
        if (this.state.historyUsers.length !== historyReceived.length) {
          this.setState({
            historyUsers: historyReceived
          });
        }
      }
    );
  };

  displayHistory = (
    displayHistory: boolean,
    receiverId: string,
    sender: {
      name: string;
      id: string;
      picture: string;
      lastConnection: string;
    }
  ): void => {
    this.setState({ displayHistory, receiverId, sender });
  };

  public render() {
    return (
      <div>
        <TopMenu current="messages" />
        {!this.state.isLoading && this.state.displayHistory && (
          <HistoryMessages
            users={this.state.historyUsers}
            receiverId={this.props.user.user_id}
            displayHistory={this.displayHistory}
          />
        )}
        {!this.state.isLoading && !this.state.displayHistory && (
          <ShowMessage
            sender={this.state.sender}
            receiverId={this.props.user.user_id}
            displayHistory={this.displayHistory}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return { user: state.user, otherUser: state.otherUser };
};

export default connect(mapStateToProps)(Messages);
