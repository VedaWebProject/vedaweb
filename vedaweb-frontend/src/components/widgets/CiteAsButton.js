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
            <svg height="1em" focusable="false" fill="currentColor" viewBox="144 144 512 512">
                <g>
                    <path d="m292.84 254.2c-49.879-0.30078-94.363 41.617-94.363 94.363 0 52.094 42.27 94.363 94.363 94.363 2.6719 0 5.3398-0.20312 7.9609-0.40234-23.375 28.465-58.793 46.652-98.344 46.652v56.629c101.42 0 183.89-82.828 183.89-184.64 5.3867-57.535-39.805-106.61-93.508-106.96z"/>
                    <path d="m417.23 489.17v56.629c101.42 0 183.89-82.828 183.89-184.64 5.3906-57.535-39.852-106.66-93.508-106.96-49.879-0.30078-94.363 41.613-94.363 94.363 0 52.094 42.27 94.363 94.363 94.363 2.6719 0 5.3398-0.20312 7.9609-0.40234-23.43 28.461-58.848 46.648-98.344 46.648z"/>
                </g>
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
