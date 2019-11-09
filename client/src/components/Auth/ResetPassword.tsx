import * as React from "react";
import {
  Input,
  Form,
  Button,
  Icon,
  Card,
  Message,
  Header
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Axios from "axios";

interface State {
  mail: string;
  message: string | null;
  passwordDisplay: boolean;
  password?: string;
  uniqueId?: string;
  loading: boolean;
  validated: boolean;
}

class ResetPassword extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      mail: "",
      message: null,
      passwordDisplay: false,
      loading: false,
      validated: false
    };
  }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    const url = window.location.search;
    if (url && url === "?reset=false") {
      this.setState({
        passwordDisplay: false,
        message: "Sorry, this id does not exist anymore"
      });
    } else if (url) {
      this.setState({
        passwordDisplay: true
      });
      this.setState({ uniqueId: url.substring(url.indexOf("=") + 1) });
    }
  }

  resetPasswordSendMail = async () => {
    this.setState({ loading: true });
    const { valid, message } = validMail(this.state.mail);
    if (valid) {
      await Axios.put("http://localhost:5000/reset-password", {
        mail: this.state.mail
      })
        .then(({ data: { message, validated } }) => {
          this._isMounted && this.setState({ message, validated });
        })
        .catch(error => console.error(error));
    } else {
      this.setState({ message });
    }
    this.setState({ loading: false });
  };

  resetPasswordSendPassword = async () => {
    this.setState({ loading: true });
    const { valid, message } = validPassword(this.state.password);
    if (valid) {
      let { message, passwordDisplay, mail, loading, validated, ...body } = {
        ...this.state
      };
      await Axios.put("http://localhost:5000/new-password", body)
        .then(({ data: { redirect, message } }) => {
          this._isMounted && this.setState({ message, validated: redirect });
          if (redirect) {
            setTimeout(
              () => window.location.replace("http://localhost:3000/sign-in"),
              3000
            );
          }
        })
        .catch(error => console.error(error));
    } else {
      this.setState({ message });
    }
    this.setState({ loading: false });
  };

  setMail = (mail: string) => {
    this.setState({ mail });
  };

  setPassword = (password: string) => {
    this.setState({ password });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  public render() {
    return (
      <Form
        onSubmit={
          this.state.passwordDisplay
            ? this.resetPasswordSendPassword
            : this.resetPasswordSendMail
        }
      >
        {this.state.validated ? (
          <Card className="form" fluid>
            <Card.Content>
              <Header as="h1">Don't worry !</Header>
              <Message positive>{this.state.message}</Message>
            </Card.Content>
          </Card>
        ) : (
          <Card fluid className="form">
            <Card.Content>
              <div className="paddingForm">
                <Header as="h1">Forgot your password ?</Header>
                {!this.state.passwordDisplay ? (
                  <Form.Field>
                    <Input
                      type="email"
                      required
                      placeholder="Email address"
                      icon="mail"
                      onChange={({ target: { value } }) => this.setMail(value)}
                    />
                  </Form.Field>
                ) : (
                  <Form.Field>
                    <Input
                      type="password"
                      required
                      placeholder="Password"
                      icon="lock"
                      onChange={({ target: { value } }) => {
                        this.setPassword(value);
                      }}
                      maxLength="20"
                    />
                  </Form.Field>
                )}
              </div>
            </Card.Content>
            <Card.Content extra>
              <div className="formButtonContainer">
                <Button
                  className="mFormButton"
                  type="submit"
                  animated
                  disabled={this.state.loading}
                  loading={this.state.loading}
                >
                  <Button.Content visible>Reset Password</Button.Content>
                  <Button.Content hidden>
                    Bring back my <Icon name="heart" color="red" />
                  </Button.Content>
                </Button>
                {!this.state.passwordDisplay && (
                  <div className="formOptionalRoutes">
                    <Link to="/sign-in">Remember it now ? Sign In</Link>
                  </div>
                )}
                {this.state.message && (
                  <Message negative>{this.state.message}</Message>
                )}
              </div>
            </Card.Content>
          </Card>
        )}
      </Form>
    );
  }
}

function validMail(mail: string): { valid: boolean; message: string } {
  let regex = new RegExp(
    /^(([^<>()\],;:\s@]+(\.[^<>()\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i
  );
  if (!mail || !regex.test(String(mail).toLowerCase())) {
    return {
      valid: false,
      message:
        "This email address does not exists, perhaps you spelled it wrong ? Also, be sure you validated your account before"
    };
  }
  return { valid: true, message: "" };
}

function validPassword(password?: string): { valid: boolean; message: string } {
  let regex = new RegExp(
    /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
  );
  if (!password || password.length > 20 || !regex.test(password)) {
    return {
      valid: false,
      message:
        "Your new password needs to be 8+ < 20 characters and containing at least 1 caps, 1 lowercase AND 1 number or special char"
    };
  }
  return { valid: true, message: "" };
}

export default ResetPassword;
