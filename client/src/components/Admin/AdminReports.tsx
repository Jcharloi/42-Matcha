import * as React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";
import { deleteUser } from "../../App";

import TopMenu from "../TopMenu";

import { Divider } from "semantic-ui-react";

class AdminReports extends React.Component {
  public render() {
    return (
      <div>
        <TopMenu current="home" />
        XD
      </div>
    );
  }
}

export default AdminReports;
