import * as React from "react";
import "../styles/stylesUserProgressBar.css";

import { State } from "../redux/types/types";
import { connect } from "react-redux";

interface Props {
  progressBarPercent?: string;
}

class ProgressBar extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="bar-progress">
        <div
          className="ui indicating progress progressing"
          data-percent={this.props.progressBarPercent}
        >
          <div
            className="bar"
            style={{ width: `${this.props.progressBarPercent}%` }}
            color="violet"
          />
          <div className="label">
            Popularity score : {this.props.progressBarPercent}%
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    progressBarPercent: state.user.score
  };
};

export default connect(mapStateToProps)(ProgressBar);
