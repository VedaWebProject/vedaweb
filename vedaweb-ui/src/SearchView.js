import React, { Component } from "react";
import { Row, Col, Collapse, Icon, Modal, Button, Input } from 'antd';

import SearchBlockList from "./SearchBlockList";
import SearchSettings from "./SearchSettings";

import './css/SearchView.css';

const Panel = Collapse.Panel;
const Search = Input.Search;



class SearchView extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchMode: 'simple',
            simpleSearchData: {},
            advancedSearchData: {},
            searchSettings: {}
        };

        this.onChangeSearchMode = this.onChangeSearchMode.bind(this);
        this.updateAdvancedSearch = this.updateAdvancedSearch.bind(this);
        this.updateSearchSettings = this.updateSearchSettings.bind(this);
    }

    onChangeSearchMode(mode){
        this.setState = ({
            searchMode: mode
        });
    }

    updateAdvancedSearch(data){
        //this.props.onUpdateAdvancedSearch(data);
        console.log(JSON.stringify(data));
    }

    updateSearchSettings(data){
        this.setState = ({
            searchSettings: data
        });
        console.log(JSON.stringify(data));
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
            background: '#aa9',
            paddingBottom: '0px'
        };

        const customMaskStyle = {
            background: 'rgba(0,0,0,0.4)'
        };

        const titleHTML = <div>{searchIcon} Search</div>;
        
        return (
            <div id="search-view" key="search-view">
                <Modal
                id="search-view"
                width={768}
                visible={this.props.visible}
                title={titleHTML}
                maskStyle={customMaskStyle}
                bodyStyle={customBodyStyle}
                onCancel={this.props.onClose}
                style={{top: 20}}
                footer={null} >

                    <Collapse
                    accordion
                    defaultActiveKey="simple"
                    onChange={this.onChangeSearchMode}>

                        <Panel header="Simple Search" key="simple" style={customPanelStyle}>
                            <Search
                            placeholder="search input"
                            style={{ width: 200, marginTop: '.1em' }}
                            />
                        </Panel>

                        <Panel header="Advanced Search" key="advanced" style={customPanelStyle}>
                            <SearchBlockList
                            onUpdate={this.updateAdvancedSearch}
                            grammarData={this.props.uiData.grammar} />
                        </Panel>

                    </Collapse>

                    <SearchSettings
                    bookRange={this.props.uiData.books.length}
                    books={this.props.uiData.books}
                    transliteration={this.props.uiData.transliteration}
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