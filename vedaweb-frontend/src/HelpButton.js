import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import logo from "./img/logo.png";

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

        const modalHeader =
            <div className="secondary-font red bold">
                <img
                src={logo}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span style={{verticalAlign:"middle"}}>
                    {this.props.title}
                </span>
            </div>;

        return (
            
            <span style={{float: this.props.align === undefined ? "right" : this.props.align}}>
                <Icon
                type="question-circle"
                theme="outlined"
                onClick={this.showModal}
                style={{cursor:"pointer"}}/>
                
                <Modal
                title={modalHeader}
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