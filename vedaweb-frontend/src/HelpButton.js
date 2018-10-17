import React, { Component } from "react";
import { Icon, Modal } from 'antd';

class HelpButton extends Component {

    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        return (
            
            <span>
                <Icon
                type="question-circle"
                theme="twoTone"
                twoToneColor="#b9b9b9"
                onClick={this.showModal}/>
                
                <Modal
                title="Modal"
                centered
                footer={null}
                visible={this.state.visible}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="OK">
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                </Modal>
            </span>
        );

    }

}

export default HelpButton;