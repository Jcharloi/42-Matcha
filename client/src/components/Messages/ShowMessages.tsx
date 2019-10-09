import * as React from "react";

import { Icon, TextArea } from "semantic-ui-react";
import "../../styles/stylesMessages.css";

interface Props {
  userName: string;
  userId: string;
  displayHistory: (
    displayHistory: boolean,
    userName: string,
    userId: string
  ) => void;
}

class ShowMessages extends React.Component<Props, {}> {
  findLastSince(lastseen: string) {
    if (lastseen !== "Just now") {
      lastseen = new Date(+lastseen * 1000).toISOString();
    }
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
      <div>
        <div className="container-message">
          <Icon
            className="icon-message"
            size="huge"
            name="long arrow alternate left"
            onClick={() => this.props.displayHistory(true, "", "")}
          />
          <div className="container-conv">
            {"JenniferCharlois"} and {"eef7d602-045f-4db3-92e2-afd6131f5a41"}
            <div className="message-typing">
              <TextArea className="textarea-message" />
              <Icon name="paper plane" size="big" className="send-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowMessages;
