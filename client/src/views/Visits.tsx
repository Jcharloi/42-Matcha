import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import history from "../helpers/history";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import "../styles/stylesUserVisits.css";

interface VState {
  userVisitsInfo: Array<{
    visiting_user_id: string;
    visited_user_id: string;
    date: string;
    user_name: string;
    path: string;
  }>;
}
class Visits extends React.Component<User, VState> {
  constructor(props: User) {
    super(props);
    this.state = {
      userVisitsInfo: []
    };
  }
  componentDidMount = () => {
    Axios.post("http://localhost:5000/profile/get-user-visits", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(
        ({
          data: { validated, message, rows: userVisitsInfo, validToken }
        }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              this.setState({ userVisitsInfo });
              console.log(userVisitsInfo);
            }
          }
        }
      )
      .catch(err => console.error(err));
  };

  find_last_since(lastseen: string) {
    lastseen = new Date(+lastseen * 1000).toISOString();
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
  public render() {
    // console.log(this.state.userVisitsInfo);
    return (
      <div>
        <TopMenu current="home" />
        <div className="visit-container">
          <List relaxed size="massive">
            {this.state.userVisitsInfo.map((pencil, index) => (
              <List.Item key={index}>
                <Image
                  className="avatar"
                  avatar
                  src={`http://localhost:5000/public/profile-pictures/${pencil.path}`}
                />
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={() => {
                      history.push(`/profile/${pencil.user_name}`);
                    }}
                  >
                    {pencil.user_name}
                  </List.Header>
                  <List.Description>
                    Visited your profile {this.find_last_since(pencil.date)}
                  </List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Visits);
