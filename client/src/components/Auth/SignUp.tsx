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
import Axios from "axios";

interface State {
  userName: string;
  mail: string;
  password: string;
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  message: string | null;
  loading: boolean;
  validated: boolean;
}

class SignUp extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userName: "",
      mail: "",
      password: "",
      firstName: "",
      lastName: "",
      day: "",
      month: "",
      year: "",
      message: null,
      loading: false,
      validated: false
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  register = async () => {
    this.setState({ loading: true });
    const { valid, messageValidForm } = validForm(this.state);
    if (valid) {
      let { message, loading, validated, ...body } = { ...this.state };
      await Axios.post("http://localhost:5000/inscription", body)
        .then(({ data: { message, validated } }) => {
          this._isMounted &&
            this.setState({ message, validated, loading: false });
        })
        .catch(error => console.error(error));
    } else {
      this.setState({ message: messageValidForm });
    }
    this.setState({ loading: false });
  };

  setLastName = (lastName: string) => {
    this.setState({ lastName });
  };

  setFirstName = (firstName: string) => {
    this.setState({ firstName });
  };

  setMonth = (month: string) => {
    this.setState({ month });
  };

  setDay = (day: string) => {
    this.setState({ day });
  };

  setYear = (year: string) => {
    this.setState({ year });
  };

  setMail = (mail: string) => {
    this.setState({ mail });
  };

  setUserName = (userName: string) => {
    this.setState({ userName });
  };

  setPassword = (password: string) => {
    this.setState({ password });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  public render() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ].map(month => ({
      text: month,
      value: month
    }));
    let days = [];
    for (let i = 1; i < 32; i++) {
      days[i - 1] = {
        text: i,
        value: i
      };
    }
    let years = [];
    for (let i = 2001, j = 0; i > 1918; i--, j++) {
      years[j] = {
        text: i,
        value: i
      };
    }

    return (
      <Form onSubmit={this.register}>
        {this.state.validated ? (
          <Card className="form" fluid>
            <Card.Content>
              <Header as="h1">Thank you for your registration !</Header>
              <Message positive>{this.state.message}</Message>
            </Card.Content>
          </Card>
        ) : (
          <Card className="form" fluid>
            <Card.Content>
              <div className="paddingForm">
                <Header as="h1">Get started !</Header>
                <Form.Group widths="equal">
                  <Form.Input
                    type="text"
                    required
                    fluid
                    placeholder="First name"
                    onChange={({ target: { value } }) => {
                      this.setFirstName(value);
                    }}
                  />
                  <Form.Input
                    type="text"
                    required
                    fluid
                    placeholder="Last name"
                    onChange={({ target: { value } }) => {
                      this.setLastName(value);
                    }}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Dropdown
                    fluid
                    required
                    placeholder="Month"
                    selection
                    options={months}
                    onChange={(e, { name, value }) => {
                      this.setMonth(String(value).substring(0, 3));
                    }}
                  />
                  <Form.Dropdown
                    fluid
                    required
                    placeholder="Day"
                    selection
                    options={days}
                    onChange={(e, { name, value }) => {
                      this.setDay(String(value));
                    }}
                  />
                  <Form.Dropdown
                    fluid
                    required
                    placeholder="Year"
                    selection
                    options={years}
                    onChange={(e, { name, value }) => {
                      this.setYear(String(value));
                    }}
                  />
                </Form.Group>
                <Form.Input
                  type="text"
                  required
                  fluid
                  placeholder="Username"
                  icon="user"
                  onChange={({ target: { value } }) => {
                    this.setUserName(value);
                  }}
                  maxLength="20"
                />
                <Form.Field>
                  <Input
                    type="email"
                    required
                    placeholder="Email address"
                    icon="mail"
                    onChange={({ target: { value } }) => {
                      this.setMail(value);
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
                    maxLength="20"
                  />
                </Form.Field>
              </div>
            </Card.Content>
            <Card.Content extra>
              <div className="formButtonContainer">
                <Button
                  disabled={this.state.loading}
                  loading={this.state.loading}
                  className="mFormButton"
                  type="submit"
                  animated
                >
                  <Button.Content visible>Register</Button.Content>
                  <Button.Content hidden>
                    Time to <Icon name="heart" color="red" />
                  </Button.Content>
                </Button>
                {this.state.message && (
                  <Message negative>{this.state.message}</Message>
                )}
                <div className="formOptionalRoutes">
                  <Link to="/sign-in">
                    Your account already exists ? Sign in
                  </Link>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </Form>
    );
  }
}

function validForm({
  userName,
  mail,
  password,
  firstName,
  lastName,
  day,
  month,
  year
}: State): { valid: boolean; messageValidForm: string } {
  if (
    !userName ||
    userName.length > 20 ||
    !firstName ||
    !lastName ||
    !day ||
    !month ||
    !year
  ) {
    return {
      valid: false,
      messageValidForm: "You need to fill the fields correctly"
    };
  }
  let regex = new RegExp(
    /^(([^<>()\],;:\s@]+(\.[^<>()\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i
  );
  if (!mail || !regex.test(String(mail).toLowerCase())) {
    return {
      valid: false,
      messageValidForm: "You need to provide a valid email address"
    };
  }
  regex = new RegExp(
    /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
  );
  if (!password || password.length > 20 || !regex.test(password)) {
    return {
      valid: false,
      messageValidForm:
        "Your password needs to be 8+ < 20 characters and containing at least 1 caps, 1 lowercase AND 1 number or special char"
    };
  }
  return { valid: true, messageValidForm: "" };
}

export default SignUp;
