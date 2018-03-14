import React, { Component } from "react";
import { Row, Col, Modal, Button } from 'antd';

import SearchHeader from "./SearchHeader";
import SearchSimple from "./SearchSimple";
import SearchAdvanced from "./SearchAdvanced";
import SearchScope from "./SearchScope";
import SearchTransliteration from "./SearchTransliteration";

import './css/SearchView.css';

import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';


class SearchView extends Component {

    render() {

        const mode = searchMetaStore.mode;

        const customBodyStyle = {
            background: '#eed',
            padding: '1rem'
        };

        const customMaskStyle = {
            background: 'rgba(0,0,0,0.4)'
        };

        return (
            <div id="search-view" key="search-view">
                <Modal
                id="search-view"
                width={768}
                visible={this.props.visible}
                title={<SearchHeader/>}
                maskStyle={customMaskStyle}
                bodyStyle={customBodyStyle}
                onCancel={this.props.onClose}
                style={{top: 20}}
                footer={null} >

                    <SearchTransliteration/>

                    <hr/>
                    
                    <SearchScope/>

                    <hr/>
                    
                    <span className="bold">What are you searching for?</span>
                    <SearchSimple active={mode === 'simple'}/>
                    <SearchAdvanced active={mode === 'advanced'}/>

                    <Row>
                        <Col span={12} className="content-left">
                            <Button icon="cross" size="large" onClick={this.props.onClose}>Close</Button>
                        </Col>
                        <Col span={12} className="content-right">
                            <Button icon="search" size="large">Search</Button>
                        </Col>
                    </Row>

                </Modal>
            </div>
        );

    }

}

export default view(SearchView);