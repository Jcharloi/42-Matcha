import * as React from "react";
import TopMenu from "./TopMenu";

import "../styles/stylesUserHome.css";

class SearchMatch extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <TopMenu current="search" />
        <br />
        cc
      </div>
    );
  }
}

export default SearchMatch;
