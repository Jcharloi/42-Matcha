import * as React from "react";
import Axios from "axios";
import { State } from "../../redux/types/types";
import { UserMatchInfos } from "../../models/models";
import { deleteUser } from "../../App";

import TopMenu from "../TopMenu";
import UserCard from "./UserCard";
import SortIndex from "./SortIndex";
import FilterInterval from "./FilterInterval";
import ModalFilter from "./ModalFilter";

import "../../styles/stylesUserHome.css";
import { connect } from "react-redux";
import { Divider } from "semantic-ui-react";

interface Props {
  user_id: string;
  mail: string;
  user_name: string;
  last_name: string;
  first_name: string;
  birthday: string;
  gender: string;
  orientation: string;
  presentation: string;
  score: string;
  city: string;
  pictures: any;
  tags: any;
}

interface HState {
  startAge: number;
  endAge: number;
  startLoc: number;
  endLoc: number;
  startPop: number;
  endPop: number;
  preference: string;
  tagsName: Array<string>;
  isLoading: boolean;
  clearList: boolean;
  userMatchInfo: Array<UserMatchInfos>;
  copyUserMatch: Array<UserMatchInfos>;
  messageHome?: string;
}

class SearchMatch extends React.Component<Props, HState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startAge: 18,
      endAge: 100,
      startLoc: 0,
      endLoc: 1000,
      startPop: 0,
      endPop: 100,
      preference: "Man",
      tagsName: [],
      isLoading: true,
      clearList: false,
      userMatchInfo: [],
      copyUserMatch: []
    };
  }

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
              this.setState({ userMatchInfo });
            }
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
      preference,
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
      preference: "Man",
      tagsName: []
    });
  };

  public render() {
    return (
      <div>
        <TopMenu current="search" />
        <div className="container-sort">
          <SortIndex sortByIndex={this.sortByIndex} />
          <Divider className="divider-match" />
          <ModalFilter disableInfoText={false} clearMatch={this.clearMatch}>
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
            />
          </ModalFilter>
        </div>
        {!this.state.isLoading &&
          this.state.userMatchInfo.map(user => (
            <UserCard key={user.id} userInfo={user} />
          ))}
        {this.state.messageHome && (
          <div className="toast-message ui blue floating message">
            <p>{this.state.messageHome}</p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(SearchMatch);
