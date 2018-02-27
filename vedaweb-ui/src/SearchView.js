import React, { Component } from "react";
import { Row, Col, Collapse, Icon, Modal, Button, Input } from 'antd';

import SearchBlockList from "./SearchBlockList";
import SearchSettings from "./SearchSettings";

import './SearchView.css';

const Panel = Collapse.Panel;
const Search = Input.Search;



class SearchView extends Component {

    constructor(props){
        super(props);

        this.state = {
            simpleSearch: true,
            simpleSearchData: {},
            advancedSearchData: {},
            searchSettings: {}
        };

        this.switchSearchMode = this.switchSearchMode.bind(this);
        this.updateAdvancedSearchData = this.updateAdvancedSearchData.bind(this);
        this.updateSearchSettings = this.updateSearchSettings.bind(this);
    }

    switchSearchMode(e){
        this.setState = ({
            simpleSearch: e.target.activeKey === 'simple'
        });
    }

    updateAdvancedSearchData(data){
        this.setState = ({
            advancedSearchData: data
        });
    }

    updateSearchSettings(data){
        this.setState = ({
            searchSettings: data
        });
        console.log(JSON.stringify(data));
    }

    prepareAdvancedSearchData(){
        var data = [];
        //transform search block data
        for (const block of this.state.advancedSearchData){
            let b = {};
            for (const field of block.blockData){
                b[field.fieldName] = field.fieldValue;
            }
            data.push(b);
        }
        return data;
    }


    render() {

        const searchIcon = <Icon type="search" className="bold"/>;

        const customPanelStyle = {
            background: '#fff',
            'WebkitBoxShadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        'MozBoxShadow': '0px 0px 5px 0px rgba(0,0,0,0.2)',
	        'boxShadow': '0px 0px 5px 0px rgba(0,0,0,0.2)'
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
            <div id="search-view" key="search-view">
                <Modal
                width={768}
                visible={this.props.visible}
                title={titleHTML}
                maskStyle={customMaskStyle}
                bodyStyle={customBodyStyle}
                onCancel={this.props.onClose}
                style={{top: 20}}
                footer={null} >

                    <Collapse accordion defaultActiveKey="simple">

                        <Panel header="Simple Search" key="simple" style={customPanelStyle}>
                            <Search
                            placeholder="search input"
                            style={{ width: 200, marginTop: '.1em' }}
                            />
                        </Panel>

                        <Panel header="Advanced search" key="advanced" style={customPanelStyle}>
                            <SearchBlockList
                            onUpdateSearchData={this.updateAdvancedSearchData}
                            grammarData={this.props.uiData.grammar} />
                        </Panel>

                    </Collapse>

                    <SearchSettings
                    bookRange={this.props.uiData.books.length}
                    books={this.props.uiData.books}
                    onSearchSettingsChanged={this.updateSearchSettings}/>

                    <Row id="search-view-buttons">
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

export default SearchView;