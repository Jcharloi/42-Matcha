import * as React from "react";
import { Button, Modal, Transition } from "semantic-ui-react";

import "../styles/stylesUserHome.css";

interface Props {
  disableInfoText: boolean;
  clearMatch(): void;
}

class ModalFilter extends React.Component<Props> {
  state = { visible: false, openedOnce: this.props.disableInfoText };

  show = () => {
    this.setState({ visible: true });

    this.setState({ openedOnce: true });
  };
  close = () => this.setState({ visible: false });

  public render() {
    const { visible } = this.state;

    // if (this.props.disableInfoText == true) {
    //   this.setState({ openedOnce: true });
    // }
    // console.log;
    return (
      <div>
        <Button
          className="open_button"
          primary
          onClick={this.show}
          size="large"
          color="pink"
        >
          <i className="align justify icon"></i>
          Filter by
        </Button>
        <Transition visible={visible} animation="fly down" duration={600}>
          <Modal
            open={visible}
            onClose={this.close}
            centered={false}
            size="large"
          >
            <Modal.Header className="modal-header">
              Who do you want to see today ?
            </Modal.Header>
            <Modal.Content>{this.props.children}</Modal.Content>
            <Modal.Actions>
              <div className="button-modal">
                <Button positive onClick={this.close}>
                  <i className="check icon"></i>
                  Ok
                </Button>
                <button
                  className="negative ui button"
                  onClick={() => {
                    this.setState({
                      list: []
                    });
                    this.props.clearMatch();
                  }}
                >
                  <i className="close icon"></i>
                  Clear
                </button>
              </div>
            </Modal.Actions>
          </Modal>
        </Transition>
        {this.state.openedOnce ? null : <p>Use filters to display profiles</p>}
      </div>
    );
  }
}

export default ModalFilter;
