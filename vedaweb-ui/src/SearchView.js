import React, { Component } from "react";
import { Row, Col, Collapse, Icon, Modal, Button } from 'antd';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'

const Panel = Collapse.Panel;



class SearchView extends Component {


    render() {

        const searchIcon = <Icon type="search" style={{"fontWeight": "bold"}}/>;

        const customPanelStyle = {
            background: '#fff'
        };

        const customBodyStyle = {
            background: '#665'
        };
        
        return (

            <div id="search-view">

                <Modal
                width={768}
                visible={this.props.visible}
                title={<div>{searchIcon} Search</div>}
                maskStyle={{"backgroundColor":"rgba(0,0,0,0.4)"}}
                bodyStyle={customBodyStyle}
                onCancel={this.props.onClose}
                style={{ top: 20}}
                footer={null} >

                    <Collapse accordion defaultActiveKey="simple" bordered={false}>

                        <Panel header="Simple Search" key="simple" style={customPanelStyle}>
                            <p>Ein Rabe geht im Feld spazieren...</p>
                        </Panel>

                        <Panel header="Advanced search" key="advanced" style={customPanelStyle}>
                            <SearchBlockList/>
                        </Panel>

                    </Collapse>

                    <Row>
                        {/*Search Meta*/}
                    </Row>

                    <div id="search-submit-button-wrapper">
                        <Button icon="search" size="large">Search</Button>
                    </div>

                </Modal>

            </div>

        );
    }
}

export default SearchView;