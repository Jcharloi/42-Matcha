import * as React from "react";
import TopMenu from "../components/TopMenu";

class Home extends React.Component {
  public render() {
    return (
      <div>
        <TopMenu current="home" />
        Je suis sur la page Home
      </div>
    );
  }
}

export default Home;
