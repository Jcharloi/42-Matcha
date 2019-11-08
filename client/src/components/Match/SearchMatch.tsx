import * as React from "react";
import Axios from "axios";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";
import { deleteUser } from "../../App";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

import TopMenu from "../TopMenu";
import UserCard from "./UserCard";
import SortIndex from "./SortIndex";
import FilterInterval from "./FilterInterval";
import ModalFilter from "./ModalFilter";

import "../../styles/stylesUserHome.css";
import { Divider } from "semantic-ui-react";

interface HState {
  startAge: number;
  endAge: number;
  startLoc: number;
  endLoc: number;
  startPop: number;
  endPop: number;
  previousPreference: string;
  preference: string;
  tagsName: Array<string>;
  isLoading: boolean;
  offset: number;
  filterLength: number;
  clearList: boolean;
  userMatchInfo: Array<User>;
  messageHome?: string;
}

class SearchMatch extends React.Component<User, HState> {
  constructor(props: User) {
    super(props);
    this.state = {
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      previousPreference: "Gender",
      preference: "Gender",
      tagsName: [],
      isLoading: true,
      offset: 0,
      filterLength: 0,
      clearList: false,
      userMatchInfo: []
    };
  }
  timer!: NodeJS.Timeout;
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  sortByIndex = (indexBy: string) => {
    if (this.state.userMatchInfo.length <= 0) {
      this.setState({
        messageHome:
          "There are no current matchers, please select your filters first"
      });
    } else {
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
              this._isMounted && this.setState({ userMatchInfo });
            }
            this._isMounted &&
              this.setState({ messageHome: message, isLoading: false });
          }
        })
        .catch(err => console.error(err));
    }
  };

  searchByInterval = (
    startAge: number,
    endAge: number,
    startLoc: number,
    endLoc: number,
    startPop: number,
    endPop: number,
    tagsName: Array<string>,
    preference: string
  ) => {
    Axios.put("http://localhost:5000/search/get-users-by-search/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      preference,
      startAge: startAge.toString(),
      endAge: endAge.toString(),
      startLoc: startLoc.toString(),
      endLoc: endLoc.toString(),
      startPop: startPop.toString(),
      endPop: endPop.toString(),
      tagsName
    })
      .then(({ data: { validToken, message, filterLength } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          this._isMounted &&
            this.setState({
              userMatchInfo: [],
              offset: 0,
              filterLength,
              messageHome: message,
              isLoading: false,
              startAge,
              endAge,
              startLoc,
              endLoc,
              startPop,
              endPop,
              preference,
              tagsName,
              previousPreference: preference
            });
        }
      })
      .catch(err => console.error(err));
  };

  setLoading = () => {
    this.setState({ isLoading: true });
  };

  clearMatch = async () => {
    await this.setState({
      isLoading: false,
      userMatchInfo: [],
      offset: 0,
      filterLength: 0,
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      preference: "Gender",
      tagsName: []
    });
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this._isMounted = false;
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
    if (!this.state.isLoading) {
      Axios.put("http://localhost:5000/search/load-users-search", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name"),
        offset: this.state.offset
      }).then(({ data: { validToken, newUsersMatchInfo } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          this._isMounted &&
            this.setState({
              userMatchInfo: newUsersMatchInfo,
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
        hasMore={this.state.filterLength - this.state.offset > 0}
      >
        <TopMenu current="search" />
        <div className="topmenu-buffer"></div>
        <div className="container-sort">
          <SortIndex sortByIndex={this.sortByIndex} />
          <Divider className="divider-match" />
          <ModalFilter
            isLoading={this.state.isLoading}
            disableInfoText={false}
            clearMatch={this.clearMatch}
          >
            <FilterInterval
              startAge={this.state.startAge}
              endAge={this.state.endAge}
              startLoc={this.state.startLoc}
              endLoc={this.state.endLoc}
              startPop={this.state.startPop}
              endPop={this.state.endPop}
              preference={this.state.preference}
              tagsName={this.state.tagsName}
              isSearch={true}
              byInterval={this.searchByInterval}
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

export default connect(mapStateToProps)(SearchMatch);
