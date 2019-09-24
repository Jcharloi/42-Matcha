import * as React from "react";
import Axios from "axios";

import "../../styles/stylesUserPersonal.css";
import { Button, Icon, Header } from "semantic-ui-react";

import { connect } from "react-redux";
import { State } from "../../redux/types/types";
import { store } from "../../redux/store";
import { insertUserProfile, updateUserAuth } from "../../redux/actions/actions";
import { deleteUser, isProfileCompleted } from "../../App";

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
  latitude: number;
  longitude: number;
  ip: string;
  city: string;
  lastName: string;
  firstName: string;
  mail: string;
  day: string;
  month: string;
  year: string;
  messagePersonal?: string | null;
}

class Personal extends React.Component<Props, PState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      ip: "",
      city: this.props.city,
      lastName: this.props.last_name,
      firstName: this.props.first_name,
      mail: this.props.mail,
      day: this.props.birthday.split("/")[1],
      month:
        this.props.birthday.split("/")[0] === "Jan"
          ? "January"
          : this.props.birthday.split("/")[0] === "Feb"
          ? "February"
          : this.props.birthday.split("/")[0] === "Mar"
          ? "March"
          : this.props.birthday.split("/")[0] === "Apr"
          ? "April"
          : this.props.birthday.split("/")[0] === "May"
          ? "May"
          : this.props.birthday.split("/")[0] === "Jun"
          ? "June"
          : this.props.birthday.split("/")[0] === "Jul"
          ? "July"
          : this.props.birthday.split("/")[0] === "Aug"
          ? "August"
          : this.props.birthday.split("/")[0] === "Sep"
          ? "September"
          : this.props.birthday.split("/")[0] === "Oct"
          ? "October"
          : this.props.birthday.split("/")[0] === "Nov"
          ? "November"
          : this.props.birthday.split("/")[0] === "Dec"
          ? "December"
          : this.props.birthday.split("/")[0],
      year: this.props.birthday.split("/")[2]
    };
  }
  timer!: NodeJS.Timeout;

  async componentDidMount() {
    if (!this.state.city) {
      var getPosition = async (options = {}) => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
      };
      await getPosition()
        .then(async ({ coords: { latitude, longitude } }: any) => {
          this.setState({ latitude, longitude });
        })
        .catch(async () => {
          await Axios("http://api.ipify.org?format=jsonp&callback=?")
            .then(async data => {
              const dataSplit = data.data.split('"');
              this.setState({ ip: dataSplit[3] });
            })
            .catch(err => {
              console.error(err.message);
            });
        });

      await Axios.put("http://localhost:5000/profile/get-user-city", {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        ip: this.state.ip,
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name")
      })
        .then(({ data: { validated, userInfos } }) => {
          if (validated) {
            this.setState({
              city: userInfos.city
            });
            const newData = {
              ...this.props,
              city: this.state.city
            };
            store.dispatch(insertUserProfile(newData));
          }
        })
        .catch(error => console.error(error));
    }
  }

  getMonthFromString(mon: string) {
    var d = Date.parse(mon + "2, 2019");
    if (!isNaN(d)) {
      return new Date(d).getMonth() + 1;
    }
    return -1;
  }

  calculateAge(day: string, month: number, year: string) {
    var dob = new Date(+year, +month - 1, +day);
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  setLastName = (lastName: string) => {
    this.setState({ lastName });
  };

  setFirstName = (firstName: string) => {
    this.setState({ firstName });
  };

  setCity = (city: string) => {
    this.setState({ city });
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

  componentWillUnmount = () => {
    if (this.timer) clearTimeout(this.timer);
  };

  public render() {
    if (this.state.messagePersonal) {
      this.timer = setTimeout(
        () => this.setState({ messagePersonal: "" }),
        4000
      );
    }
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
    ];
    let days = [];
    for (let i = 1; i < 32; i++) {
      days[i - 1] = i;
    }
    let years = [];
    for (let i = 2001, j = 0; i > 1918; i--, j++) {
      years[j] = i;
    }
    return (
      <div className="media-container">
        <div className="title-container">
          <Header as="h1" dividing>
            Who am I ?
          </Header>
        </div>
        <div className="personal-container">
          <div className="block">
            <Icon name="address card" size="large" color="violet" />
            <input
              className="input-value"
              value={this.state.lastName}
              onChange={({ target: { value } }) => this.setLastName(value)}
            />
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="address card" size="large" color="violet" />
            <input
              className="input-value"
              value={this.state.firstName}
              onChange={({ target: { value } }) => this.setFirstName(value)}
            />
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="map marker alternate" size="large" color="blue" />
            <input
              className="input-value"
              defaultValue={this.state.city}
              onChange={({ target: { value } }) => this.setCity(value)}
            />
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="birthday" size="large" color="orange" />
            <span className="input-value">
              {this.calculateAge(
                this.state.day,
                this.getMonthFromString(this.state.month),
                this.state.year
              )}
              years old
            </span>
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="calendar alternate" size="large" color="orange" />
            <select
              required
              placeholder="Month"
              value={this.state.month}
              onChange={({ target: { value } }) => {
                this.setMonth(value);
              }}
            >
              <option value="" disabled>
                Month
              </option>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              required
              placeholder="Day"
              value={this.state.day}
              onChange={({ target: { value } }) => {
                this.setDay(value);
              }}
            >
              <option value="" disabled>
                Day
              </option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              required
              placeholder="Year"
              value={this.state.year}
              onChange={({ target: { value } }) => {
                this.setYear(value);
              }}
            >
              <option value="" disabled>
                Year
              </option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="ui divider" />
          <div className="block">
            <Icon name="mail" size="large" color="red" />
            <input
              className="input-value"
              value={this.state.mail}
              onChange={({ target: { value } }) => this.setMail(value)}
            />
          </div>
          <Button
            className="ui primary button button-valid-edit"
            onClick={async () => {
              const valid = validPersonalInfos(this.state);
              if (!valid.valid) {
                this.setState({ messagePersonal: valid.message });
              } else {
                await Axios.put(
                  "http://localhost:5000/profile/change-personal-infos",
                  {
                    city: this.state.city,
                    lastName: this.state.lastName,
                    firstName: this.state.firstName,
                    mail: this.state.mail,
                    month: this.state.month.substring(0, 3),
                    day: this.state.day,
                    year: this.state.year,
                    userName: localStorage.getItem("user_name"),
                    token: localStorage.getItem("token")
                  }
                )
                  .then(({ data: { validToken, message } }) => {
                    if (validToken === false) {
                      deleteUser();
                    } else {
                      const newData = {
                        ...this.props,
                        last_name: this.state.lastName,
                        first_name: this.state.firstName,
                        mail: this.state.mail,
                        birthday:
                          this.state.month.substring(0, 3) +
                          "/" +
                          this.state.day +
                          "/" +
                          this.state.year
                      };
                      store.dispatch(insertUserProfile(newData));
                      let isCompleted = isProfileCompleted(
                        this.props.city,
                        this.props.gender,
                        this.props.presentation,
                        this.props.pictures,
                        this.props.tags
                      );
                      store.dispatch(
                        updateUserAuth({ isAuth: true, isCompleted })
                      );
                      if (this.timer) clearTimeout(this.timer);
                      this.setState({ messagePersonal: message });
                    }
                  })
                  .catch(error => console.error(error));
              }
            }}
          >
            Change my informations
          </Button>
          {this.state.messagePersonal && (
            <div className="toast-message ui blue floating message">
              <p>{this.state.messagePersonal}</p>
            </div>
          )}
        </div>
      </div>
    );

    function validPersonalInfos({
      firstName,
      lastName,
      mail
    }: PState): { valid: boolean; message?: string } {
      if (!firstName || !lastName) {
        return {
          valid: false,
          message: "You need to provide all the fields"
        };
      }
      const validMail = validMailForm(mail);
      if (!validMail.valid) {
        return {
          valid: validMail.valid,
          message: validMail.messageValidMail
        };
      }

      return { valid: true };
    }

    function validMailForm(
      mail: string
    ): { valid: boolean; messageValidMail?: string } {
      let regex = new RegExp(
        /^(([^<>()\],;:\s@]+(\.[^<>()\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i
      );
      if (!mail || !regex.test(String(mail).toLowerCase())) {
        return {
          valid: false,
          messageValidMail: "You need to provide a valid email address"
        };
      }
      return { valid: true };
    }
  }
}

const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(Personal);
