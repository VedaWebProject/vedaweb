import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import logo from "./img/logo.png";

const helpTexts = {
    transliteration: {
        title: "Input Transliteration",
        content:
            <div>
                <p>This is a sample paragraph.</p>
                <p>And this is, too.</p>
            </div>
    }
};


class HelpButton extends Component {

    state = { visible: false }

    showModal = () => {
        if (helpTexts.hasOwnProperty(this.props.type)){
            this.setState({
                visible: true,
            });
        } else {
            console.log("Error: '" + this.props.type + "' is not a valid help text type, so i won't open the help view.")
        }
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
                    {helpTexts[this.props.type].title}
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
                    {helpTexts[this.props.type].content}
                </Modal>
            </span>
        );

    }

}

export default HelpButton;