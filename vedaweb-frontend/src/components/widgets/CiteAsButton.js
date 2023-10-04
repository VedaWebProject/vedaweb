import React, { Component } from "react";
import { Button, Modal, Icon } from 'antd';
import HtmlSnippet from "../utils/HtmlSnippet";


class CitaAsButton extends Component {

    constructor(props){
        super(props);
        this.state = {show: false};
    }

    render() {

        const QuoteSvg = () => (
            <svg
            viewBox="5 5 47 47"
            focusable="false"
            height="1em"
            fill="currentColor">
                <g>
                    <circle cx="18.5" cy="31.5" r="5.5"/>
                    <path d="M18.5,38c-3.584,0-6.5-2.916-6.5-6.5s2.916-6.5,6.5-6.5s6.5,2.916,6.5,6.5S22.084,38,18.5,38z
                        M18.5,27c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5s4.5-2.019,4.5-4.5S20.981,27,18.5,27z"/>
                </g>
                <g>
                    <circle cx="35.5" cy="31.5" r="5.5"/>
                    <path d="M35.5,38c-3.584,0-6.5-2.916-6.5-6.5s2.916-6.5,6.5-6.5s6.5,2.916,6.5,6.5S39.084,38,35.5,38z
                        M35.5,27c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5s4.5-2.019,4.5-4.5S37.981,27,35.5,27z"/>
                </g>
                <path d="M13,32c-0.553,0-1-0.447-1-1c0-7.72,6.28-14,14-14c0.553,0,1,0.447,1,1s-0.447,1-1,1
                    c-6.617,0-12,5.383-12,12C14,31.553,13.553,32,13,32z"/>
                <path d="M30,32c-0.553,0-1-0.447-1-1c0-7.72,6.28-14,14-14c0.553,0,1,0.447,1,1s-0.447,1-1,1
                    c-6.617,0-12,5.383-12,12C31,31.553,30.553,32,30,32z"/>
            </svg>
        );

        return (
            <>
                <Button
                onClick={() => this.setState({show: true})}
                type="default"
                size="large"
                title="Show citation details"
                style={{marginLeft: '1rem'}}>
                    <Icon component={QuoteSvg} />
                    Cite As
                </Button>

                <Modal
                title={null}
                centered
                footer={null}
                maskClosable={true}
                visible={this.state.show}
                okButtonProps={{style: {display: 'none'}}}
                cancelButtonProps={{style: {display: 'none'}}}
                onCancel={() => this.setState({show: false})}
                >

                    <HtmlSnippet id="citation"/>

                </Modal>
            </>
        );
    }
}

export default CitaAsButton;
