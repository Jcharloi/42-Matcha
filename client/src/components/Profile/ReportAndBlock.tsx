import * as React from "react";

import "../../styles/stylesUserReport.css";
import { Modal, Button, Header, Icon } from "semantic-ui-react";
import Axios from "axios";
import { deleteUser } from "../../App";
import history from "../../helpers/history";

interface Props {
  name: string;
  gender: string;
  id: string;
}

interface State {
  visible: boolean;
  chosenGender: string;
  messageReport?: string;
}

class ReportAndBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      chosenGender:
        this.props.gender === "Woman"
          ? "her"
          : this.props.gender === "Man"
          ? "him"
          : "it"
    };
  }
  timer!: any;
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  handleModalVisibility = (visible: boolean) => {
    this.setState({ visible });
  };

  handleAction = async (action: string) => {
    await Axios.post("http://localhost:5000/profile/sanctioning-user", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      action,
      targetUserId: this.props.id
    })
      .then(({ data: { validToken, validated, message } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this._isMounted &&
              this.setState({ visible: false, messageReport: message });
            history.push("/home");
          }
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  };

  componentDidUpdate = () => {
    if (this.state.messageReport && !this.timer) {
      this.timer = setTimeout(() => this.setState({ messageReport: "" }), 4000);
    }
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
    this.timer = null;
    this._isMounted = false;
  };

  public render() {
    return (
      <div className="setting-container">
        <Modal
          trigger={
            <div
              className="title-report"
              onClick={() => {
                this.handleModalVisibility(true);
              }}
            >
              Having an issue with {this.props.name} ?
            </div>
          }
          open={this.state.visible}
          basic
          size="small"
        >
          <Header icon="hourglass half" content="What now ?" />
          <Modal.Content>
            <p>
              It seems like you are having an issue with {this.props.name} !
              <br />
              <br />
              You can simply ignore this person, but if this person is seriously
              bothering you
              <br />- Block {this.state.chosenGender} : Means you won't
              see&nbsp;
              {this.props.name}'s profile anymore.
              <br />- Report {this.state.chosenGender} : Is {this.props.name} a
              fake account ?
              <br />
              <br />
              Remember that both actions are permanent, so please chose
              carefully.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="cancel-button"
              basic
              inverted
              onClick={() => this.handleModalVisibility(false)}
            >
              <Icon name="remove" /> Cancel
            </Button>
            <Button
              basic
              color="red"
              inverted
              onClick={() => this.handleAction("Report")}
            >
              <Icon name="bullhorn" /> Report
            </Button>
            <Button
              basic
              color="red"
              inverted
              onClick={() => this.handleAction("Block")}
            >
              <Icon name="ban" /> Block
            </Button>
          </Modal.Actions>
        </Modal>
        {this.state.messageReport && (
          <div className="toast-message ui floating message">
            <p>{this.state.messageReport}</p>
          </div>
        )}
      </div>
    );
  }
}

export default ReportAndBlock;
