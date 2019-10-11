import * as React from "react";
import Axios from "axios";
import { deleteUser } from "../App";
import { State } from "../redux/types/types";
import { connect } from "react-redux";
import TopMenu from "../components/TopMenu";
import HistoryMessages from "../components/Messages/HistoryMessages";
import ShowMessage from "../components/Messages/ShowMessages";
import { User } from "../models/models";

import "../styles/stylesMessages.css";

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

class Messages extends React.Component<User, MState> {
  constructor(props: User) {
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
    Axios.put("http://localhost:5000/message/get-all-messages", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      receiverId: this.props.user_id
    })
      .then(({ data: { validToken, validated, usersMessage } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({ historyUsers: usersMessage, isLoading: false });
          }
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };

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
            displayHistory={this.displayHistory}
          />
        )}
        {!this.state.isLoading && !this.state.displayHistory && (
          <ShowMessage
            sender={this.state.sender}
            receiverId={this.props.user_id}
            displayHistory={this.displayHistory}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Messages);
