import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";
import UserCard from "../components/Match/UserCard";
import SortIndex from "../components/Match/SortIndex";
import FilterInterval from "../components/Match/FilterInterval";
import ModalFilter from "../components/Match/ModalFilter";
import Messages from "./Messages";

import { Divider } from "semantic-ui-react";
import "../styles/stylesUserHome.css";

interface HState {
  startAge: number;
  endAge: number;
  startLoc: number;
  endLoc: number;
  startPop: number;
  endPop: number;
  tagsName: Array<string>;
  isLoading: boolean;
  clearList: boolean;
  userMatchInfo: Array<User>;
  copyUserMatch: Array<User>;
  messageHome?: string;
}

class Home extends React.Component<User, HState> {
  constructor(props: User) {
    super(props);
    this.state = {
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      tagsName: [],
      isLoading: true,
      clearList: false,
      userMatchInfo: [],
      copyUserMatch: []
    };
  }

  componentDidMount = () => {
    Axios.put("http://localhost:5000/home/get-users-by-preference/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      gender: this.props.gender,
      preference: this.props.orientation
    })
      .then(({ data: { validated, message, userMatchInfo } }) => {
        if (validated) {
          this.setState({ userMatchInfo, copyUserMatch: userMatchInfo });
        }
        this.setState({ messageHome: message, isLoading: false });
      })
      .catch(err => console.error(err));
  };

  sortByIndex = (indexBy: string) => {
    const userAge =
      new Date().getFullYear() - +this.props.birthday.split("/")[2];
    Axios.put("http://localhost:5000/home/sort-by-index", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      index: indexBy,
      age: userAge.toString(),
      userMatchInfo: this.state.userMatchInfo
    })
      .then(({ data: { validToken, validated, message, userMatchInfo } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({ userMatchInfo });
          }
          this.setState({ messageHome: message, isLoading: false });
        }
      })
      .catch(err => console.error(err));
  };

  filterByInterval = (
    startAge: number,
    endAge: number,
    startLoc: number,
    endLoc: number,
    startPop: number,
    endPop: number,
    tagsName: Array<string>
  ) => {
    Axios.put("http://localhost:5000/home/filter-by-interval/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      userMatchInfo: this.state.copyUserMatch,
      startAge: startAge.toString(),
      endAge: endAge.toString(),
      startLoc: startLoc.toString(),
      endLoc: endLoc.toString(),
      startPop: startPop.toString(),
      endPop: endPop.toString(),
      tagsName
    })
      .then(({ data: { validToken, validated, message, userMatchInfo } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({ userMatchInfo });
          }
          this.setState({ messageHome: message, isLoading: false });
        }
      })
      .catch(err => console.error(err));
    this.setState({
      startAge,
      endAge,
      startLoc,
      endLoc,
      startPop,
      endPop,
      tagsName
    });
  };

  clearMatch = () => {
    this.setState({
      userMatchInfo: this.state.copyUserMatch,
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      tagsName: []
    });
  };

  public render() {
    return (
      <div>
        <TopMenu current="home" />
        <div className="container-sort">
          <SortIndex sortByIndex={this.sortByIndex} />
          <Divider className="divider-match" />
          <ModalFilter disableInfoText={true} clearMatch={this.clearMatch}>
            <FilterInterval
              startAge={this.state.startAge}
              endAge={this.state.endAge}
              startLoc={this.state.startLoc}
              endLoc={this.state.endLoc}
              startPop={this.state.startPop}
              endPop={this.state.endPop}
              preference={""}
              tagsName={this.state.tagsName}
              isSearch={false}
              byInterval={this.filterByInterval}
              clearMatch={this.clearMatch}
            />
          </ModalFilter>
        </div>
        <div className="container-all-match">
          {!this.state.isLoading &&
            this.state.userMatchInfo.map(user => (
              <UserCard key={user.user_id} userInfo={user} />
            ))}
        </div>
        {this.state.messageHome && (
          <div className="toast-message ui floating message">
            <p>{this.state.messageHome}</p>
          </div>
        )}
        <div className="container-little-messages">
          <Messages littleMessages={true} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Home);
