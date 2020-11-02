import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import helpIcon from "../../img/help.png";
import helpTexts from "./HelpTexts";
import "./HelpButton.css";



class HelpButton extends Component {

    state = { visible: false }

    showModal = (e) => {
        e.stopPropagation();
        if (helpTexts.hasOwnProperty(this.props.type)){
            this.setState({
                visible: true,
            });
        } else {
            console.log("Error: '" + this.props.type + "' is not a valid help text type, so i won't open the help view 🙅")
        }
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        if (this.props.hidden) return null;

        const modalHeader = !helpTexts.hasOwnProperty(this.props.type) ? "" :
            <div className="secondary-font red bold">
                <img
                src={helpIcon}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span className="font-big" style={{verticalAlign:"middle"}}>
                    {helpTexts[this.props.type].title}
                </span>
            </div>;

        const containerStyle = Object.assign({
            textAlign: this.props.align ? this.props.align : "right",
            float: this.props.float ? (this.props.align === undefined ? "right" : this.props.align) : "none",
            display: this.props.inline ? "inline" : "block"
        }, this.props.style);

        const iconStyle = Object.assign({
            verticalAlign: "middle",
            fontSize: "90%"
        }, this.props.iconStyle || {});


        return (
            
            <div style={containerStyle}>

                <div className="help-button-container" onClick={this.showModal}>

                    { this.props.label && (!this.props.labelPosition || this.props.labelPosition === "left") &&
                        <span className="help-button-label">{this.props.label}</span>
                    }

                    <Icon
                    type="question-circle"
                    theme="outlined"
                    className="help-button-icon"
                    style={iconStyle}
                    title={this.props.title || (helpTexts[this.props.type] ? "Show help: \"" + helpTexts[this.props.type].title + "\"" : "")} />

                    { this.props.label && this.props.labelPosition === "right" &&
                        <span className="help-button-label">{this.props.label}</span>
                    }

                </div>
                
                <Modal
                title={modalHeader}
                centered
                footer={null}
                maskClosable={true}
                visible={this.state.visible}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="OK">
                    {helpTexts[this.props.type] ? helpTexts[this.props.type].content : ""}
                </Modal>
            </div>
        );

    }

}

export default HelpButton;