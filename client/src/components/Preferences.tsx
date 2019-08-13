import * as React from "react";
import Axios from "axios";

import "../styles/stylesUserPreferences.css";
import { Button, TextArea, Form, Icon, Header } from "semantic-ui-react";

import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { store } from "../redux/store";
import { insertUserProfile } from "../redux/actions/actions";

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
  gender: string;
  orientation: string;
  bio: string;
  messagePreference?: string | null;
}

class Preferences extends React.Component<Props, PState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gender: this.props.gender,
      orientation: this.props.orientation,
      bio: this.props.presentation
    };
  }
  public render() {
    return (
      <div className="media-container">
        <div className="title-container-preferences">
          <Header as="h1" dividing>
            What I want you to know
          </Header>
        </div>
        <div className="container-preferences">
          <div className="preferences">
            <div>
              <Icon name="neuter" />
              <span className="text-preferences">I am a</span>
              <select
                value={this.state.gender ? this.state.gender : ""}
                onChange={({ target: { value } }) =>
                  this.setState({ gender: value })
                }
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Icon name="heart" color="red" />
              <span className="text-preferences">I'm interested by</span>
              <select
                value={this.state.orientation}
                onChange={({ target: { value } }) =>
                  this.setState({
                    orientation: value
                  })
                }
              >
                <option value="Heterosexual">Heterosexual</option>
                <option value="Homosexual">Homosexual</option>
                <option value="Bisexual">Bisexual</option>
              </select>
            </div>
          </div>
          <Form className="form-textarea">
            <TextArea
              className="bio"
              value={this.state.bio ? this.state.bio : ""}
              placeholder="Short description about yourself"
              onChange={({ target: { value } }: any) =>
                this.setState({ bio: value })
              }
            />
          </Form>
          <Button
            className="ui primary button button-edit-preferences"
            onClick={async () => {
              const valid = validPreferenceInfos(this.state);
              if (!valid.valid) {
                this.setState({
                  messagePreference: valid.message
                });
              } else {
                await Axios.put(
                  "http://localhost:5000/profile/change-preference-infos",
                  {
                    gender: this.state.gender,
                    orientation: this.state.orientation,
                    bio: this.state.bio,
                    userName: localStorage.getItem("user_name"),
                    token: localStorage.getItem("token")
                  }
                )
                  .then(({ data: { message } }) => {
                    const newData = {
                      ...this.props,
                      gender: this.state.gender,
                      orientation: this.state.orientation,
                      presentation: this.state.bio
                    };
                    store.dispatch(insertUserProfile(newData));
                    this.setState({
                      messagePreference: message
                    });
                  })
                  .catch(error => console.error(error));
              }
            }}
          >
            Change my preferences
          </Button>
          {this.state.messagePreference && (
            <div className="edit-text">{this.state.messagePreference}</div>
          )}
        </div>
      </div>
    );

    function validPreferenceInfos({
      gender,
      bio
    }: PState): { valid: boolean; message?: string } {
      if (!gender || !bio) {
        return {
          valid: false,
          message: "You need to enter all the fields"
        };
      }
      return { valid: true };
    }
  }
}

const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(Preferences);
