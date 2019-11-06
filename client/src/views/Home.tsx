import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import { deleteUser } from "../App";
import InfiniteScroll from "react-infinite-scroller";

import TopMenu from "../components/TopMenu";
import UserCard from "../components/Match/UserCard";
import SortIndex from "../components/Match/SortIndex";
import FilterInterval from "../components/Match/FilterInterval";
import ModalFilter from "../components/Match/ModalFilter";

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
  isInterval: boolean;
  offset: number;
  hasMore: boolean;
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
      isInterval: false,
      offset: 0,
      hasMore: true,
      clearList: false,
      userMatchInfo: [],
      copyUserMatch: []
    };
  }
  timer!: NodeJS.Timeout;

  componentDidMount = () => {
    Axios.put("http://localhost:5000/home/get-users-by-preference/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      gender: this.props.gender,
      preference: this.props.orientation
    })
      .then(({ data: { message } }) => {
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
    this.setState({ isLoading: true, isInterval: true });
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
          this.setState({
            messageHome: message,
            isLoading: false,
            startAge,
            endAge,
            startLoc,
            endLoc,
            startPop,
            endPop,
            tagsName
          });
        }
      })
      .catch(err => console.error(err));
  };

  clearMatch = () => {
    this.setState({
      userMatchInfo: this.state.copyUserMatch,
      isInterval: false,
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      tagsName: []
    });
  };

  setLoading = () => {
    this.setState({ isLoading: true });
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  componentDidUpdate = () => {
    if (this.state.messageHome && this.timer) {
      clearTimeout(this.timer);
    }
    if (this.state.messageHome) {
      this.timer = setTimeout(() => this.setState({ messageHome: "" }), 4000);
    }
  };

  loadMatchedUsers = () => {
    if (!this.state.isLoading && !this.state.isInterval) {
      Axios.put("http://localhost:5000/home/load-users-match", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name"),
        offset: this.state.offset
      }).then(({ data: { validToken, newUsersMatchInfo } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          this.state.userMatchInfo.push(...newUsersMatchInfo);
          this.setState({
            copyUserMatch: this.state.userMatchInfo,
            userMatchInfo: this.state.userMatchInfo,
            hasMore: newUsersMatchInfo.length === 10,
            offset: this.state.offset + 10,
            isLoading: false
          });
        }
      });
    }
  };

  public render() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadMatchedUsers}
        hasMore={this.state.hasMore}
      >
        <TopMenu current="home" />
        <div className="topmenu-buffer"></div>
        <div className="container-sort">
          <SortIndex sortByIndex={this.sortByIndex} />
          <Divider className="divider-match" />
          <ModalFilter
            isLoading={this.state.isLoading}
            disableInfoText={true}
            clearMatch={this.clearMatch}
          >
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
              setLoading={this.setLoading}
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
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Home);
