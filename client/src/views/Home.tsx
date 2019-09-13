import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import TopMenu from "../components/TopMenu";
import UserCard from "../components/UserCard";

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
  userMatchInfo: [
    {
      id: string;
      name: string;
      city: string;
      age: string;
      connection: string;
      gender: string;
      popularityScore: string;
      pictures: [
        {
          path: string;
          date: string;
          main: boolean;
        }
      ];
      tags: [
        {
          tag_id: string;
          name: string;
          custom: boolean;
        }
      ];
    }
  ];
  messageHome?: string;
}

class Home extends React.Component<Props, HState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      userMatchInfo: [
        {
          id: "",
          name: "",
          city: "",
          age: "",
          connection: "",
          gender: "",
          popularityScore: "",
          pictures: [
            {
              path: "",
              date: "",
              main: false
            }
          ],
          tags: [
            {
              tag_id: "",
              name: "",
              custom: false
            }
          ]
        }
      ]
    };
  }

  componentWillMount() {
    Axios.post("http://localhost:5000/home/get-users-by-preference/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      gender: this.props.gender,
      preference: this.props.orientation
    })
      .then(({ data: { validated, message, userMatchInfo } }) => {
        if (validated) {
          this.setState({ userMatchInfo });
        }
        this.setState({ messageHome: message, isLoading: false });
      })
      .catch(err => console.error(err));
  }

  callApiIndexed(indexBy: string) {
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
  }

  public render() {
    return (
      <div>
        <TopMenu current="home" />
        <div>
          <button
            className="ui button"
            onClick={() => this.callApiIndexed("Age")}
          >
            Age
          </button>
          <button
            className="ui button"
            onClick={() => this.callApiIndexed("Localisation")}
          >
            Localisation
          </button>
          <button
            className="ui button"
            onClick={() => this.callApiIndexed("Popularity")}
          >
            Popularity
          </button>
          <button
            className="ui button"
            onClick={() => this.callApiIndexed("Tags")}
          >
            Tags
          </button>
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
