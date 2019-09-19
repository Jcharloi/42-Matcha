import * as React from "react";
import Axios from "axios";
import { State } from "../redux/types/types";
import { UserMatchInfos } from "../models/models";

import TopMenu from "../components/TopMenu";
import UserCard from "../components/UserCard";
import SortIndex from "../components/SortIndex";
import FilterInterval from "../components/FilterInterval";
import ModalFilter from "../components/ModalFilter";

import "../styles/stylesUserHome.css";
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
      isLoading: true,
      clearList: false,
      userMatchInfo: [],
      copyUserMatch: []
    };
  }

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
      .then(({ data: { validated, message, userMatchInfo } }) => {
        if (validated) {
          this.setState({ userMatchInfo });
        }
        this.setState({ messageHome: message, isLoading: false });
      })
      .catch(err => console.error(err));
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
      .then(({ data: { validated, message, userMatchInfo } }) => {
        if (validated) {
          this.setState({ userMatchInfo });
        }
        this.setState({ messageHome: message, isLoading: false });
      })
      .catch(err => console.error(err));
  };

  clearMatch = () => {
    this.setState({ userMatchInfo: this.state.copyUserMatch });
  };

  public render() {
    var openedOnce = false;
    return (
      <div>
        <TopMenu current="search" />
        <div className="container-sort">
          <SortIndex sortByIndex={this.sortByIndex} />
          <Divider className="divider-match" />
          <ModalFilter disableInfoText={false} clearMatch={this.clearMatch}>
            <FilterInterval
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
