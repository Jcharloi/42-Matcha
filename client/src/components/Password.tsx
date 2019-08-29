import * as React from "react";
import Axios from "axios";

import { Button, Header, Icon } from "semantic-ui-react";
import "../styles/stylesUserPassword.css";

interface State {
  currentPassword: string | null;
  newPassword: string | null;
  messagePassword?: string | null;
}

class Password extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentPassword: null,
      newPassword: null
    };
  }

  public render() {
    return (
      <div className="media-container">
        <div className="title-container">
          <Header as="h1" dividing>
            My password
          </Header>
        </div>
        <div className="container-password">
          <div className="block">
            <Icon name="user secret" size="large" color="black" />
            <input
              className="input-value"
              type="password"
              placeholder="Current password"
              onChange={({ target: { value } }) =>
                this.setState({ currentPassword: value })
              }
            />
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="user secret" size="large" color="black" />
            <input
              className="input-value"
              type="password"
              placeholder="New password"
              onChange={({ target: { value } }) =>
                this.setState({ newPassword: value })
              }
            />
          </div>
          <Button
            className="ui primary button button-valid-edit"
            onClick={async () => {
              const valid = validPasswordForm(
                this.state.newPassword,
                this.state.currentPassword
              );
              if (!valid.valid) {
                this.setState({ messagePassword: valid.message });
              } else {
                await Axios.put(
                  "http://localhost:5000/profile/change-password",
                  {
                    currentPassword: this.state.currentPassword,
                    newPassword: this.state.newPassword,
                    userName: localStorage.getItem("user_name"),
                    token: localStorage.getItem("token")
                  }
                )
                  .then(({ data: { message } }) => {
                    this.setState({ messagePassword: message });
                  })
                  .catch(error => console.error(error));
              }
            }}
          >
            Change my password
          </Button>
          {this.state.messagePassword && (
            <div>{this.state.messagePassword}</div>
          )}
        </div>
      </div>
    );

    function validPasswordForm(
      newPassword: string | null,
      currentPassword: string | null
    ): { valid: boolean; message?: string } {
      if (!newPassword || !currentPassword) {
        return {
          valid: false,
          message: "You need to provide the both fields"
        };
      }
      let regex = new RegExp(
        /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
      );
      if (!regex.test(newPassword)) {
        return {
          valid: false,
          message:
            "Your new password needs to be 8+ characters and contain at least 1 caps, 1 lowercase AND 1 number or special char"
        };
      }
      return { valid: true };
    }
  }
}

export default Password;
