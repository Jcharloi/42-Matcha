import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { User } from "../models/models";
import { deleteUser } from "../App";

import TopMenu from "../components/TopMenu";

import { Divider, List, Image } from "semantic-ui-react";
import "../styles/stylesUserVisits.css";

interface VState {
  userVisitsInfo: Array<{
    visiting_user_id: string;
    visited_user_id: string;
    date: string;
    user_name: string;
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
  public render() {
    return (
      <div>
        <TopMenu current="home" />
        <List relaxed>
          {/* <List.Item>
            <Image
              className="avatar"
              avatar
              src="http://localhost:5000/public/profile-pictures/tchoupi.jpg"
            />
            <List.Content>
              <List.Header as="a">Daniel Louise</List.Header>
              <List.Description>
                Last seen watching{" "}
                <a>
                  <b>Arrested Development</b>
                </a>{" "}
                just now.
              </List.Description>
            </List.Content>
          </List.Item> */}
          {this.state.userVisitsInfo.map(pencil => (
            <List.Item>
              <Image
                className="avatar"
                avatar
                src="http://localhost:5000/public/profile-pictures/tchoupi.jpg"
              />
              <List.Content>
                <List.Header as="a">{pencil.user_name}</List.Header>
                <List.Description>
                  Visited your profile {pencil.date}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.user;
};

export default connect(mapStateToProps)(Visits);
