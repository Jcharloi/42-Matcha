import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";
import { deleteUser } from "../../App";

import TopMenu from "../TopMenu";

import { Divider } from "semantic-ui-react";
import { thisExpression } from "@babel/types";

interface AState {
  rows: Array<{ reporting_user_id: string; reported_user_id: string }>;
}

class AdminReports extends React.Component<{}, AState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rows: []
    };
  }
  componentDidMount = () => {
    Axios.put(`http://localhost:5000/admin/get-reports`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    }).then(({ data: { validated, rows } }) => {
      if (validated) {
        this.setState(rows);
      }
    });
  };
  public render() {
    console.log(this.state.rows);
    return (
      <div>
        <TopMenu current="home" />
        tout doux
      </div>
    );
  }
}

export default AdminReports;
