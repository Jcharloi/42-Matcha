import * as React from "react";
import Axios from "axios";

import { Redirect } from "react-router-dom";

import TopMenu from "../TopMenu";
import { store } from "../../redux/store";
import history from "../../helpers/history";

import { insertOtherProfile } from "../../redux/actions/actions";

import { List, Button } from "semantic-ui-react";

import "../../styles/stylesAdminReports.css";

interface AState {
  reportArray: Array<{ reporting_user: string; reported_user: string }>;
  newReportArray: Array<{ reporting_user: string; reported_user: string }>;
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
  componentDidMount = () => {
    Axios.put(`http://localhost:5000/admin/get-reports`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validated, reportArray } }) => {
        if (validated) {
          this.setState({ reportArray });
        }
      })
      .catch(err => console.error(err));
  };

  selectProfile = (otherUser: string) => {
    Axios.put(`http://localhost:5000/get-user-infos`, {
      userName: otherUser
    })
      .then(({ data: { validated, userInfos } }) => {
        if (validated) {
          store.dispatch(insertOtherProfile(userInfos));
          // console.log(userInfos);
          history.push(`/profile/` + userInfos.user_name);
        }
      })
      .catch(err => console.error(err));
  };

  banUser = async (targetUser: string) => {
    let targetUserId;
    await Axios.put(`http://localhost:5000/get-user-infos`, {
      userName: targetUser
    })
      .then(({ data: { validated, userInfos } }) => {
        if (validated) {
          targetUserId = userInfos.user_id;
        }
      })
      .catch(err => console.error(err));
    await console.log(targetUserId);
    await Axios.put(`http://localhost:5000/admin/ban-user`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token"),
      targetUserId: targetUserId
    })
      .then(() => {
        this.setState({
          reportArray: this.state.reportArray.filter(reports => {
            if (reports.reported_user !== targetUser) return true;
          })
        });
      })
      .catch(err => console.error(err));

    console.log(this.state.reportArray);
  };

  public render() {
    return (
      <div>
        <TopMenu current="Reports" />
        <div className="reports-container">
          <List relaxed size="massive">
            {/* {console.log(this.state.reportArray)} */}
            {this.state.reportArray.map((report, index) => (
              <List.Item key={index}>
                {/* <Image
                  className="avatar"
                  avatar
                  src={`http://localhost:5000/public/profile-pictures/${user.path}`}
                /> */}
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={() => {
                      this.selectProfile(report.reporting_user);
                    }}
                  >
                    {report.reporting_user}
                  </List.Header>
                  <List.Description>reported</List.Description>
                  <List.Header
                    as="a"
                    onClick={() => {
                      this.selectProfile(report.reported_user);
                    }}
                  >
                    <p className="reported_user_name">{report.reported_user}</p>
                  </List.Header>
                  <Button
                    onClick={() => {
                      this.banUser(report.reported_user);
                    }}
                    negative
                  >
                    Ban
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default AdminReports;
