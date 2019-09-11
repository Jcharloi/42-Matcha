import * as React from "react";
import TopMenu from "../components/TopMenu";
import UserCard from "../components/UserCard";

import "../styles/stylesUserHome.css";
import Axios from "axios";
import { StringLiteralTypeAnnotation } from "@babel/types";
interface Props {
  mail: string;
}

interface PState {
  userMatchInfo: {
    id: string;
    name: string;
    city: string;
    age: string;
    connection: string;
    pictures: {
      path: string;
      date: string;
      main: boolean;
    };
  };
}

class Home extends React.Component<Props, PState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userMatchInfo: {
        id: "",
        name: "",
        city: "",
        age: "",
        connection: "",
        pictures: {
          path: "",
          date: "",
          main: false
        }
      }
    };
  }
  callAPI() {
    Axios.post("http://localhost:5000/home/get-users-by-preference/")
      // .then(res => res.text())
      .then(data => {
        this.setState({ userMatchInfo: data.data.userMatchInfo });
      })
      .catch(err => err);
  }
  componentWillMount() {
    this.callAPI();
  }

  public render() {
    console.log(this.state.userMatchInfo);
    return (
      <div>
        <TopMenu current="home" />
        {/* {this.state.userMatchInfo.map(name, id => ( */}
        {/* <p>{this.state.userMatchInfo.id}</p>> ))} */}
        <p>test</p>
      </div>
    );
  }
}

export default Home;
