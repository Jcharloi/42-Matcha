import * as React from "react";
import TopMenu from "../components/TopMenu";
import "../styles/stylesUserHome.css";
class Home extends React.Component {
  public render() {
    return (
      <div>
        <TopMenu current="home" />
        Je suis sur la page Home
        <div className="ui card">
          <div className="image">
            <img
              className="profile-pic"
              src="http://localhost:5000/public/profile-pictures/tracteur.jpg"
            />
          </div>
          <div className="content">
            <a className="header">psim</a>
            <div className="meta">
              <span className="date">Offline since 1 month</span>
            </div>
            <div className="description">I liek eggs XD</div>
          </div>
          <div className="extra content">
            <a>
              <i className="road icon"></i>
              42 km
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
