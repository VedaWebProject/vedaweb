import React, { Component } from "react";
import { Modal, Input, Button } from 'antd';
import axios from 'axios';
import logo from './img/logo.png';

import RichTextEditor from 'react-rte';
import "./css/FeedbackModal.css";

const modalHeader = <div className="secondary-font red bold">
                <img
                src={logo}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span style={{verticalAlign:"middle"}}>Beta Feedback</span>
            </div>;

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };



class FeedbackModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            error: undefined,
            sentFeedback: false,
            senderName: '',
            message: RichTextEditor.createValueFromString('','html')
        }
        this.close = this.close.bind(this);
        this.sendFeedback = this.sendFeedback.bind(this);
    }

    sendFeedback(){
        this.setState({
            isLoaded: false,
            error: undefined,
            sentFeedback: false
        });

        axios.post("api/feedback", {senderName: this.state.senderName, message: this.state.message.toString('html')})
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    error: undefined,
                    sentFeedback: true
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error,
                    sentFeedback: false
                });
            });
    }

    close(){
        this.setState({
            isLoaded: true,
            error: undefined,
            sentFeedback: false,
            senderName: '',
            message: RichTextEditor.createValueFromString('','html')
        });
        this.props.onCancel();
    }

    render() {

        const {isLoaded, error, sentFeedback, message, senderName} = this.state;

        const footer = [
            <Button key="cancel" onClick={this.close}>Close</Button>,
            <Button key="submit" type="primary" loading={!isLoaded} onClick={this.sendFeedback} disabled={sentFeedback}>
              Send
            </Button>,
          ];

        return (
            
            <Modal
            title={modalHeader}
            destroyOnClose
            centered
            footer={footer}
            onCancel={this.close}
            visible={this.props.visible}>

                {!sentFeedback &&
                    <div>
                        <Input
                        value={senderName}
                        onChange={e => this.setState({senderName: e.target.value})}
                        placeholder="Your name"/>
                        <br/><br/>
                        <RichTextEditor
                        toolbarConfig={toolbarConfig}
                        lines={8}
                        placeholder="Your feedback message"
                        value={message}
                        onChange={v => this.setState({message: v})}
                        editorClassName="feedback-editor"/>
                    </div>
                }

                {sentFeedback && isLoaded && error === undefined &&
                    <div>
                        <span className="bold">Thank you for your feedback!</span>
                    </div>
                }

            </Modal>
            
        );
    }
}

export default FeedbackModal;