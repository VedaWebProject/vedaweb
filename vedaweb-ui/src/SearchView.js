import React, { Component } from "react";
import { Row, Col, Collapse, Icon, Modal, Button, Input } from 'antd';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'

const Panel = Collapse.Panel;
const Search = Input.Search;



class SearchView extends Component {


    render() {

        const searchIcon = <Icon type="search" style={{"fontWeight": "bold"}}/>;

        const customPanelStyle = {
            background: '#fff',
            '-webkit-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        '-moz-box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        'box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.2)'
        };

        const customBodyStyle = {
            background: '#bba'
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

                    <Collapse accordion defaultActiveKey="simple">

                        <Panel header="Simple Search" key="simple" style={customPanelStyle}>
                            <Search
                            placeholder="search input"
                            onSearch={value => console.log(value)}
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

                    <div id="search-submit-button-wrapper">
                        <Button icon="search" size="large">Search</Button>
                    </div>

                </Modal>
            </div>
        );

    }
}

export default SearchView;