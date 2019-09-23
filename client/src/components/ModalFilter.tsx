import * as React from "react";
import { Button, Modal, Transition } from "semantic-ui-react";

import "../styles/stylesUserHome.css";

interface Props {
  disableInfoText: boolean;
  clearMatch(): void;
}

interface State {
  visible: boolean;
  openedOnce: boolean;
}

class ModalFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: false, openedOnce: this.props.disableInfoText };
  }

  showModal = () => {
    this.setState({ visible: true, openedOnce: true });
  };

  closeModal = () => this.setState({ visible: false });

  clearEverything = () => {
    this.setState({
      openedOnce: false
    });
    this.props.clearMatch();
    this.closeModal();
  };

  public render() {
    const { visible } = this.state;
    return (
      <div>
        <Button
          className="basic black open_button"
          onClick={this.showModal}
          size="medium"
        >
          <i className="align justify icon"></i>
          Filter by
        </Button>
        <Transition visible={visible} animation="fly down" duration={400}>
          <Modal
            open={visible}
            onClose={this.closeModal}
            centered={false}
            size="large"
          >
            <Modal.Header className="modal-header">
              Who do you want to see today ?
            </Modal.Header>
            <Modal.Content>{this.props.children}</Modal.Content>
            <Modal.Actions>
              <div className="button-modal">
                <Button positive onClick={this.closeModal}>
                  <i className="check icon"></i>
                  Ok
                </Button>
                <Button
                  negative
                  onClick={() => {
                    this.clearEverything();
                  }}
                >
                  <i className="close icon"></i>
                  Clear
                </Button>
              </div>
            </Modal.Actions>
          </Modal>
        </Transition>
        {this.state.openedOnce ? null : (
          <div className="text-search">
            Use filters to display some profiles (:
          </div>
        )}
      </div>
    );
  }
}

export default ModalFilter;
