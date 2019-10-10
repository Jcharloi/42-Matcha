import * as React from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import {
  Input,
  Form,
  Button,
  Icon,
  Card,
  Message,
  Header
} from "semantic-ui-react";
import { connect } from "react-redux";
import history from "../../helpers/history";
import Axios from "axios";
import {
  updateUserAuth,
  insertUserProfile,
  connectSocket
} from "../../redux/actions/actions";
import { Dispatch } from "redux";

interface Props {
  dispatch: Dispatch;
}

interface State {
  userName: string;
  password: string;
  message: string | null;
  loading: boolean;
  validated: boolean;
}

class SignIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      message: null,
      loading: false,
      validated: false
    };
  }

  async componentDidMount() {
    if (window.location.search === "?register=true") {
      this.setState({
        validated: true,
        message:
          "Congratulations, you validated your account ! You can now connect to start matching 👍"
      });
    } else if (window.location.search === "?register=false") {
      this.setState({
        validated: false,
        message:
          "Uh, it seems like you already validated your account, try to connect now !"
      });
    }
  }

  logIn = async () => {
    this.setState({ loading: true });
    const { valid, message } = validForm(this.state);
    if (valid) {
      let { message, ...body } = { ...this.state };
      await Axios.post("http://localhost:5000/connection", body)
        .then(({ data: { message, token, userInfos } }) => {
          if (message === "Connected") {
            localStorage.setItem("token", token);
            localStorage.setItem("user_name", this.state.userName);
            if (
              !userInfos.message &&
              !userInfos.pictures.message &&
              !userInfos.tags.message
            ) {
              let isCompleted = false;
              if (
                userInfos.city &&
                userInfos.gender &&
                userInfos.presentation &&
                userInfos.pictures.length > 0 &&
                userInfos.tags.length > 0
              ) {
                isCompleted = true;
              }
              this.props.dispatch(insertUserProfile(userInfos));
              this.props.dispatch(
                updateUserAuth({ isAuth: true, isCompleted })
              );
              const socket = io("http://localhost");
              this.props.dispatch(connectSocket(socket));
              history.push("/profile");
            } else {
              this.setState({ message, validated: false, loading: false });
            }
          } else {
            this.setState({ message, validated: false, loading: false });
          }
        })
        .catch(error => console.error(error));
    } else {
      this.setState({ message, validated: false, loading: false });
    }
  };

  setUserName = (userName: string) => {
    this.setState({ userName });
  };

  setPassword = (password: string) => {
    this.setState({ password });
  };

  public render() {
    const { loading } = this.state;

    return (
      <Form onSubmit={this.logIn}>
        <Card fluid className="form">
          <Card.Content>
            <div className="paddingForm">
              <Header as="h1">Welcome back !</Header>
              <Form.Field>
                <Input
                  type="text"
                  placeholder="Username"
                  required
                  icon="user"
                  onChange={({ target: { value } }) => {
                    this.setUserName(value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  type="password"
                  required
                  placeholder="Password"
                  icon="lock"
                  onChange={({ target: { value } }) => {
                    this.setPassword(value);
                  }}
                />
              </Form.Field>
            </div>
          </Card.Content>
          <Card.Content extra>
            <div className="formButtonContainer">
              <Button
                className="mFormButton"
                type="submit"
                animated
                disabled={loading}
                loading={loading}
              >
                <Button.Content visible>Log in</Button.Content>
                <Button.Content hidden>
                  Rock & <Icon name="heart" color="red" />
                </Button.Content>
              </Button>
              {this.state.message && (
                <Message
                  positive={this.state.validated}
                  negative={!this.state.validated}
                >
                  {this.state.message}
                </Message>
              )}
              <div className="formOptionalRoutes">
                <div>
                  <Link to="/reset-password">Forgot password ?</Link>
                </div>
                <div>
                  <Link to="/sign-up">Don't have an account ? Register</Link>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </Form>
    );
  }
}

function validForm({
  userName,
  password
}: State): { valid: boolean; message: string } {
  if (!userName || !password) {
    return { valid: false, message: "You need to fill the fields correctly" };
  }
  return { valid: true, message: "" };
}

export default connect()(SignIn);
