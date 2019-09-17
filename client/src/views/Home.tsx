import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { UserMatchInfos } from "../models/models";

import TopMenu from "../components/TopMenu";
import UserCard from "../components/UserCard";
import SortIndex from "../components/SortIndex";
import SortInterval from "../components/SortInterval";

import "../styles/stylesUserHome.css";

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

class Home extends React.Component<Props, HState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      clearList: false,
      userMatchInfo: [],
      copyUserMatch: []
    };
  }

  componentWillMount = () => {
    Axios.post("http://localhost:5000/home/get-users-by-preference/", {
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
    Axios.post("http://localhost:5000/home/sort-by-index", {
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

  sortByInterval = (
    index: string,
    start: number,
    end: number,
    tagsName: Array<string>
  ) => {
    console.log(tagsName);
    Axios.post("http://localhost:5000/home/sort-by-interval/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      userMatchInfo: this.state.copyUserMatch,
      index,
      start: start.toString(),
      end: end.toString(),
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
    return (
      <div>
        <TopMenu current="home" />
        <div>
          <SortIndex sortByIndex={this.sortByIndex} />
          <SortInterval
            sortByInterval={this.sortByInterval}
            clearMatch={this.clearMatch}
          />
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

export default connect(mapStateToProps)(Home);
