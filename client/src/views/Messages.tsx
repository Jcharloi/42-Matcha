import * as React from "react";
import Axios from "axios";
import { deleteUser } from "../App";
import { State } from "../redux/types/types";
import { connect } from "react-redux";
import TopMenu from "../components/TopMenu";
import HistoryMessages from "../components/Messages/HistoryMessages";
import ShowMessage from "../components/Messages/ShowMessages";
import { socket } from "../helpers/socket";
import { User, NumberOf } from "../models/models";
import { store } from "../redux/store";
import { updateNumberOf } from "../redux/actions/actions";

import "../styles/stylesMessages.css";
import { Label, Icon } from "semantic-ui-react";

interface Props {
  littleMessages: boolean;
  user: User;
  otherUser: User;
  numberOf: NumberOf;
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
        this.props.user.user_name
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
            this.receiveAllMessages();
          }
        }
      })
      .catch(e => {
        console.error(e.message);
      });
  };

  readMessage = (
    senderName: string,
    receiverName: string | null,
    unReadMessages: Array<string>
  ) => {
    Axios.put("http://localhost:5000/message/read-message", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      senderName,
      receiverName,
      unReadMessages
    })
      .then(({ data: { validToken, validated } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            store.dispatch(
              updateNumberOf({
                numberNotifications: this.props.numberOf.numberNotifications,
                numberMessages: this.props.numberOf.numberMessages - 1
              })
            );
          }
        }
      })
      .catch(e => {
        console.log(e.message);
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
            let unReadMessages: Array<string> = [];
            this.state.allMessages.map(
              ({ messageId, sentPosition, receiverRead }) => {
                if (!receiverRead && sentPosition !== this.props.user.user_id) {
                  unReadMessages.push(messageId);
                }
              }
            );
            if (unReadMessages.length > 0) {
              this.readMessage(
                senderName,
                this.props.user.user_name,
                unReadMessages
              );
            }
            let key = "";
            for (
              let i = 0;
              i <
              (senderName.length <= (receiverName ? receiverName.length : 0)
                ? senderName.length
                : receiverName
                ? receiverName.length
                : 0);
              i++
            ) {
              key += String.fromCharCode(
                (receiverName ? receiverName.charCodeAt(i) : 0) ^
                  senderName.charCodeAt(i)
              );
            }
            socket.emit("create-room", key);
          } else {
            this.getAllMessages();
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
    }
  };

  receiveAllMessages = () => {
    socket.on("New history", this.initNewHistory);
  };

  componentDidUpdate = (_: any, prevState: MState) => {
    if (
      !this.state.isLoading &&
      prevState.historyUsers !== this.state.historyUsers
    ) {
      this.state.historyUsers.map((history, index) => {
        if (
          !history.receiverRead &&
          history.senderId !== this.props.user.user_id
        ) {
          store.dispatch(
            updateNumberOf({
              numberNotifications: this.props.numberOf.numberNotifications,
              numberMessages: ++index
            })
          );
        }
        return;
      });
    }
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
            {this.props.numberOf.numberMessages > 0 && (
              <Label className="label-notif" color="red">
                {this.props.numberOf.numberMessages}
              </Label>
            )}
          </div>
        )}
        {!this.props.littleMessages ? (
          <div className="topmenu-buffer"></div>
        ) : null}
        {!this.state.isLoading && this.state.displayHistory && (
          <HistoryMessages
            users={this.state.historyUsers}
            numberOf={this.props.numberOf}
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
  return {
    user: state.user,
    otherUser: state.otherUser,
    numberOf: state.numberOf
  };
};

export default connect(mapStateToProps)(Messages);
