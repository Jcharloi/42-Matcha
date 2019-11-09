import * as React from "react";
import TopMenu from "../TopMenu";
import history from "../../helpers/history";
import "../../styles/stylesRedirect.css";

class IsCompleted extends React.Component {
  render() {
    let style = {
      height: "70px"
    };
    return (
      <div className="main-container">
        <TopMenu />
        <div style={style}></div>
        <h1>You did not completed your profile :(</h1>
        <h2>
          We need you to complete your profile (with some tags and a picture of
          you) so we can match you with others !
        </h2>
        <button
          className="ui button"
          onClick={() => {
            history.push("/profile");
          }}
        >
          Complete my profile
        </button>
      </div>
    );
  }
}

export default IsCompleted;
