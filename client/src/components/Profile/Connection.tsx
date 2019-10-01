import * as React from "react";

import "../../styles/stylesUserConnection.css";

interface Props {
  connection: string;
}

class Connection extends React.Component<Props, {}> {
  find_last_since(lastseen: string) {
    var dateSeen: any = new Date(lastseen);
    var dateNow: any = new Date();
    var plural: string = "s";

    var seconds = Math.floor((dateNow - dateSeen) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 31);
    if (minutes === 1 || hours === 1 || days === 1 || months === 1) plural = "";

    if (months) return months.toString() + " month" + plural + " ago";
    if (days) return days.toString() + " day" + plural + " ago";
    if (hours) return hours.toString() + " hour" + plural + " ago";
    if (minutes) return minutes.toString() + " minute" + plural + " ago";
    return "just now";
  }

  public render() {
    return (
      <div className="connection-container">
        <div
          className={
            this.find_last_since(this.props.connection) !== "just now" ||
            !this.props.connection
              ? "ring ring-color-online"
              : "ring ring-color-offline"
          }
        />
        <div className="text">
          {!this.props.connection
            ? `Online now`
            : `Last seen ${this.find_last_since(this.props.connection)}`}
        </div>
      </div>
    );
  }
}

export default Connection;
