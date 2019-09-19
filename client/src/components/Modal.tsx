import React, { Component } from "react";
import { Button, Header, Image, Modal, Transition } from "semantic-ui-react";
import FilterInterval from "../components/FilterInterval";
import "../styles/stylesUserHome.css";

interface Props {
  clearMatch(): void;
}

class ModalExample extends React.Component<Props> {
  state = { visible: false };
  show = () => this.setState({ visible: true });
  close = () => this.setState({ visible: false });
  public render() {
    console.log(this.props.children);
    const { visible } = this.state;
    return (
      <div>
        <Button
          className="open_button"
          primary
          onClick={this.show}
          size="large"
        >
          <i className="align justify icon"></i>
          Filters
        </Button>
        <Transition visible={visible} animation="fly down" duration={600}>
          <Modal
            open={visible}
            onClose={this.close}
            // trigger={<Button>Show Modal</Button>}
            centered={false}
            size="large"
          >
            <Modal.Content>{this.props.children}</Modal.Content>
            <Modal.Actions>
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
                Clear filters
              </button>

              <Button positive onClick={this.close}>
                Ok
              </Button>
            </Modal.Actions>
          </Modal>
        </Transition>
      </div>
    );
  }
}

export default ModalExample;
