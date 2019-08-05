import * as React from "react";
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
// import Axios from "axios";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import { login } from "../redux/actions/auth";
import history from "../helpers/history";

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
    // this.props.dispatch(login(this.state.userName, this.state.password));
    history.push("/profile");
    this.setState({ loading: true });
    // const { valid, message } = validForm(this.state);
    // if (valid) {
    //   let { message, ...body } = { ...this.state };

    //         this.setState({ message, validated: true, loading: false });
    //       } else {
    //         this.setState({ message, validated: false, loading: false });
    //       }
    //     })
    //     .catch(error => console.error(error));
    // } else {
    //   this.setState({ message, validated: false, loading: false });
    // }
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
                    this.setState({ userName: value });
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
                    this.setState({ password: value });
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

// function validForm({
//   userName,
//   password
// }: State): { valid: boolean; message: string } {
//   if (!userName || !password) {
//     return { valid: false, message: "You need to fill the fields correctly" };
//   }
//   return { valid: true, message: "" };
// }

export default connect()(SignIn);
