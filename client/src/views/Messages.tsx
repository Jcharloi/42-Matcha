import * as React from "react";
import Axios from "axios";
import { deleteUser } from "../App";
import { State } from "../redux/types/types";
import { connect } from "react-redux";
import TopMenu from "../components/TopMenu";
import HistoryMessages from "../components/Messages/HistoryMessages";
import ShowMessage from "../components/Messages/ShowMessages";
import { socket } from "../helpers/socket";
import { User } from "../models/models";

import "../styles/stylesMessages.css";
import { Label, Icon } from "semantic-ui-react";

interface Props {
  littleMessages: boolean;
  user: User;
  otherUser: User;
}

interface MState {
  displayLittle: boolean;
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
    picture: string;
  }>;
  unreadMessages: number;
  allMessages: Array<{
    message: string;
    messageId: string;
    date: string;
    sentPosition: string;
    receiverRead: boolean;
    senderRead: boolean;
  }>;
  sender: {
    senderName: string;
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
      displayLittle: true,
      isLoading: true,
      displayHistory: true,
      historyUsers: [],
      unreadMessages: 0,
      allMessages: [],
      receiverId: "",
      sender: { senderName: "", id: "", picture: "", lastConnection: "" }
    };
  }

  componentDidMount = () => {
    if (
      window.location.pathname &&
      window.location.pathname.search("/messages/") !== -1
    ) {
      this.getMessagesPeople(
        decodeURIComponent(window.location.pathname.split("/")[2]),
        localStorage.getItem("user_name")
      );
    } else {
      this.getAllMessages();
    }
  };

  getAllMessages = () => {
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
            this.setState({
              isLoading: false,
              displayHistory: true,
              historyUsers: usersMessage
            });
            this.state.historyUsers.map(history => {
              if (!history.receiverRead) {
                this.setState({
                  unreadMessages: this.state.unreadMessages + 1
                });
              }
              return;
            });
            this.receiveAllMessages();
          }
        }
      })
      .catch(e => {
        console.error(e.message);
      });
  };

  getMessagesPeople = (senderName: string, receiverName: string | null) => {
    Axios.put("http://localhost:5000/message/get-messages-people", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      senderName,
      receiverName
    })
      .then(({ data: { validToken, validated, allMessages, user } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({
              isLoading: false,
              displayHistory: false,
              allMessages,
              sender: user
            });
          }
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };

  initNewHistory = (
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
      picture: string;
    }>
  ) => {
    if (this.state.historyUsers !== historyReceived) {
      this.setState({
        historyUsers: historyReceived
      });
      this.state.historyUsers.map(history => {
        if (!history.receiverRead) {
          this.setState({
            unreadMessages: this.state.unreadMessages + 1
          });
        }
        return;
      });
    }
  };

  receiveAllMessages = () => {
    socket.on("New history", this.initNewHistory);
  };

  componentWillUnmount = () => {
    socket.removeListener("New history", this.initNewHistory);
  };

  handleDisplayLittle = () => {
    this.setState({ displayLittle: this.state.displayLittle ? false : true });
  };

  public render() {
    return (
      <div>
        {!this.props.littleMessages ? (
          <TopMenu current="messages" />
        ) : (
          <div
            className="container-top-messages"
            onClick={this.handleDisplayLittle}
          >
            <Icon name="mail" /> Your personal messages
            {this.state.unreadMessages > 0 && (
              <Label className="label-notif" color="red">
                {this.state.unreadMessages}
              </Label>
            )}
          </div>
        )}
        {!this.state.isLoading && this.state.displayHistory && (
          <HistoryMessages
            users={this.state.historyUsers}
            displayLittle={this.state.displayLittle}
            littleMessages={this.props.littleMessages}
            receiverId={this.props.user.user_id}
            getMessagesPeople={this.getMessagesPeople}
          />
        )}
        {!this.state.isLoading && !this.state.displayHistory && (
          <ShowMessage
            sender={this.state.sender}
            allMessages={this.state.allMessages}
            displayLittle={this.state.displayLittle}
            littleMessages={this.props.littleMessages}
            receiverId={this.props.user.user_id}
            getAllMessages={this.getAllMessages}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return { user: state.user, otherUser: state.otherUser };
};

export default connect(mapStateToProps)(Messages);
