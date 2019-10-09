import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../../redux/types/types";
import history from "../../helpers/history";
import { User } from "../../models/models";
import { deleteUser } from "../../App";

import TopMenu from "../TopMenu";

import { List, Image } from "semantic-ui-react";
import { thisExpression } from "@babel/types";

import "../../styles/stylesAdminReports.css";

interface AState {
  reportArray: Array<{ reporting_user: string; reported_user: string }>;
}

class AdminReports extends React.Component<{}, AState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      reportArray: []
    };
  }
  componentDidMount = () => {
    Axios.put(`http://localhost:5000/admin/get-reports`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validated, reportArray } }) => {
        if (validated) {
          // console.log;
          this.setState({ reportArray });
        }
      })
      .catch(err => console.error(err));
  };
  public render() {
    console.log(this.state.reportArray);
    return (
      <div>
        <TopMenu current="Reports" />
        <div className="reports-container">
          <List relaxed size="massive">
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
                      history.push(`/profile/${report.reporting_user}`);
                    }}
                  >
                    {report.reporting_user}
                  </List.Header>
                  <List.Description>reported</List.Description>
                  <List.Header
                    as="a"
                    onClick={() => {
                      history.push(`/profile/${report.reported_user}`);
                    }}
                  >
                    {report.reported_user}
                  </List.Header>
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
