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

  show = () => {
    this.setState({ visible: true, openedOnce: true });
  };
  close = () => this.setState({ visible: false });

  public render() {
    const { visible } = this.state;
    return (
      <div>
        <Button
          className="basic black open_button"
          onClick={this.show}
          size="medium"
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
                      openedOnce: false
                    });
                    this.props.clearMatch();
                    this.close();
                  }}
                >
                  <i className="close icon"></i>
                  Clear
                </button>
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
