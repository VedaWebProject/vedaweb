import React, { Component } from "react";
import { Row, Col, Collapse, Icon, Modal, Button, Input } from 'antd';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'

const Panel = Collapse.Panel;
const Search = Input.Search;



class SearchView extends Component {

    constructor(props){
        super(props);

        this.state = {
            simpleSearch: true
        };

        this.switchSearchMode = this.switchSearchMode.bind(this);
    }

    switchSearchMode(e){
        this.state = {
            simpleSearch: e.target.activeKey == 'simple'
        };
    }


    render() {

        const searchIcon = <Icon type="search" style={{"fontWeight": "bold"}}/>;

        const customPanelStyle = {
            background: '#fff',
            '-webkit-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        '-moz-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        'box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)'
        };

        const customBodyStyle = {
            background: '#bba',
            paddingBottom: '0px'
        };

        const customMaskStyle = {
            background: 'rgba(0,0,0,0.4)'
        };

        const titleHTML = <div>{searchIcon} Search</div>;
        
        return (
            <div id="search-view">
                <Modal
                width={768}
                visible={this.props.visible}
                title={titleHTML}
                maskStyle={customMaskStyle}
                bodyStyle={customBodyStyle}
                onCancel={this.props.onClose}
                style={{ top: 20}}
                footer={null} >

                    <Collapse accordion defaultActiveKey="simple">

                        <Panel header="Simple Search" key="simple" style={customPanelStyle}>
                            <Search
                            placeholder="search input"
                            style={{ width: 200, marginTop: '.1em' }}
                            />
                        </Panel>

                        <Panel header="Advanced search" key="advanced" style={customPanelStyle}>
                            <SearchBlockList/>
                        </Panel>

                    </Collapse>

                    <Row>
                        {/*Search Meta*/}
                    </Row>

                    <Row id="search-view-buttons">
                        <Col span={16} className="content-left">
                            <Button icon="cross" size="large">Close</Button>
                        </Col>
                        <Col span={4} className="content-right">
                            <Button icon="rollback" size="large">Reset</Button>
                        </Col>
                        <Col span={4} className="content-right">
                            <Button icon="search" size="large">Search</Button>
                        </Col>
                    </Row>

                </Modal>
            </div>
        );

    }
}

export default SearchView;