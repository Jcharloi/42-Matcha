import * as React from "react";
import Axios from "axios";

import TopMenu from "../TopMenu";
import { Link } from "react-router-dom";
import { store } from "../../redux/store";
import history from "../../helpers/history";
import { deleteUser } from "../../App";
import { insertOtherProfile } from "../../redux/actions/actions";

import { Button, Feed, Popup, Icon } from "semantic-ui-react";

import "../../styles/stylesAdminReports.css";

interface AState {
  reportArray: Array<{ reporting_users: []; reported_user: string }>;
  newReportArray: Array<{ reporting_users: []; reported_user: string }>;
  redirect: string;
}

class AdminReports extends React.Component<{}, AState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      reportArray: [],
      newReportArray: [],
      redirect: ""
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;

    Axios.put(`http://localhost:5000/admin/get-reports`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validToken, validated, reportArray } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this._isMounted && this.setState({ reportArray });
          }
        }
      })
      .catch(err => console.error(err));
  };

  selectProfile = (otherUser: string) => {
    Axios.put(`http://localhost:5000/profile/get-user-infos`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetName: otherUser
    })
      .then(({ data: { validToken, validated, userInfos } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            store.dispatch(insertOtherProfile(userInfos));
            history.push(`/profile/${userInfos.user_name}`);
          }
        }
      })
      .catch(err => console.error(err));
  };

  banUser = (targetUser: string) => {
    Axios.put(`http://localhost:5000/profile/get-user-infos`, {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetName: targetUser
    })
      .then(({ data: { validToken, validated, userInfos } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            Axios.put(`http://localhost:5000/admin/ban-user`, {
              token: localStorage.getItem("token"),
              userName: localStorage.getItem("user_name"),
              targetUserName: userInfos.user_name
            })
              .then(() => {
                if (targetUser !== "IAmAnAdmin")
                  this._isMounted &&
                    this.setState({
                      reportArray: this.state.reportArray.filter(reports => {
                        if (reports.reported_user !== targetUser) return true;
                        return false;
                      })
                    });
              })
              .catch(err => console.error(err));
          }
        }
      })
      .catch(err => console.error(err));
  };

  reportNb = (targetUser: string) => {
    let report_nb = 0;
    this.state.reportArray.map(({ reported_user }) => {
      return reported_user === targetUser ? report_nb++ : report_nb;
    });
    return report_nb;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  public render() {
    return (
      <div>
        <TopMenu current="Reports" />
        <div className="topmenu-buffer"></div>
        <div className="reports-container">
          <Feed>
            {this.state.reportArray.map((report, index) => (
              <Feed.Event key={index} className="user-container">
                <Feed.Content className="feed-content">
                  <Feed.Content className="feed-content">
                    <div
                      className="link-feed"
                      onClick={() => {
                        this.selectProfile(report.reported_user);
                      }}
                    >
                      <Link to={`/profile/` + report.reported_user}>
                        <span className="reported_user_name">
                          {report.reported_user}
                        </span>
                        &nbsp;(has been reported {report.reporting_users.length}{" "}
                        times)
                      </Link>
                      <Popup
                        content={report.reporting_users + " "}
                        key={report.reported_user}
                        header={"Reporters"}
                        trigger={<Icon className="clipboard list" />}
                      />
                    </div>
                  </Feed.Content>
                  <Button
                    onClick={() => {
                      this.banUser(report.reported_user);
                    }}
                    negative
                  >
                    Ban
                  </Button>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        </div>
      </div>
    );
  }
}

export default AdminReports;
