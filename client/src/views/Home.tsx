import * as React from "react";
import TopMenu from "../components/TopMenu";
import UserCard from "../components/UserCard";

import "../styles/stylesUserHome.css";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { store } from "../redux/store";
import { StringLiteralTypeAnnotation } from "@babel/types";
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

interface PState {
  userMatchInfo: [
    {
      id: string;
      name: string;
      city: string;
      age: string;
      connection: string;
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
}

class Home extends React.Component<Props, PState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userMatchInfo: [
        {
          id: "",
          name: "",
          city: "",
          age: "",
          connection: "",
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
  callAPI() {
    Axios.post("http://localhost:5000/home/get-users-by-preference/", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      gender: this.props.gender,
      preference: this.props.orientation
    })
      // .then(res => res.text())
      .then(({ data: { userMatchInfo } }) => {
        this.setState({ userMatchInfo: userMatchInfo });
      })
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }
  componentWillMount() {
    this.callAPI();
  }

  public render() {
    console.log(this.state.userMatchInfo);
    return (
      <div>
        <TopMenu current="home" />
        {this.state.userMatchInfo.map(crayon => (
          <UserCard key={crayon.id.toString()} userInfo={crayon} />
        ))}
      </div>
    );
  }
}
const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(Home);
