import * as React from "react";
import { Header, Modal, Button, Icon } from "semantic-ui-react";
import Axios from "axios";
import { deleteUser } from "../../App";
import history from "../../helpers/history";

interface State {
  visible: boolean;
  messageRemove: string;
}

class RemoveAccount extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
      messageRemove: ""
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  handleModalVisibility = (visible: boolean) => {
    this.setState({ visible });
  };

  handleAction = () => {
    Axios.put("http://localhost:5000/admin/ban-user", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name"),
      targetUserName: localStorage.getItem("user_name")
    }).then(({ data: { validToken, validated, message } }) => {
      if (validToken === false) {
        deleteUser();
      } else {
        if (validated) {
          history.push("/");
        } else {
          this._isMounted &&
            this.setState({ visible: false, messageRemove: message });
        }
      }
    });
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
              Want to remove your account ?
            </div>
          }
          open={this.state.visible}
          basic
          size="small"
        >
          <Header icon="hourglass half" content="What now ?" />
          <Modal.Content>
            <p>
              Removing your account means you won't have access to our
              application anymore. <br />
              You will need to create an other account to match again, this
              action is permanent. Are you sure ?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="cancel-button"
              basic
              inverted
              onClick={() => this.handleModalVisibility(false)}
            >
              <Icon name="remove" /> No, I prefer to stay
            </Button>
            <Button
              basic
              color="red"
              inverted
              onClick={() => this.handleAction()}
            >
              <Icon name="trash" /> Yes, remove my account
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default RemoveAccount;
