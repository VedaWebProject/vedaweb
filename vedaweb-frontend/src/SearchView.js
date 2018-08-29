import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse } from 'antd';

import SearchGrammar from "./SearchGrammar";
import SearchSimple from "./SearchSimple";
import SearchScopeContainer from "./SearchScopeContainer";
import SearchTransliteration from "./SearchTransliteration";
import SearchScopeIndicator from "./SearchScopeIndicator";

import Sanscript from 'sanscript';

import './css/SearchView.css';

import { view } from 'react-easy-state';

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import searchMetaStore from "./stores/searchMetaStore";
import searchGrammarStore from "./stores/searchGrammarStore";

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class SearchView extends Component {

    constructor(props){
        super(props);
        this.switchMode = this.switchMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    switchMode(key){
        if (key !== "help")
            searchMetaStore.mode = key;
    }

    handleSubmit(e){
        let jsonData = {
            mode: searchMetaStore.mode,
            scopes: searchMetaStore.scopes
        };
        
        if (searchMetaStore.mode === "grammar"){
            jsonData["blocks"] = JSON.parse(JSON.stringify(searchGrammarStore.data.blocks));

            for (let block of jsonData.blocks){
                block.form = Sanscript.t(block.form, searchMetaStore.transliteration.id, "iso");
                for (let field of block.fields){
                    if (field.value.length > 0)
                        block[field.name] = field.value
                }
                delete block.fields;
                delete block.id;
            }
        }

        this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData)));
    }


    render() {

        //TEMP DEV
        const customPanelStyle = {
            background: '#fafafa',
            borderRadius: 2,
            marginBottom: 24,
            border: '1px solid #ddc',
            overflow: 'hidden',
            fontFamily: 'Dosis, sans-serif',
            fontSize: '18px'
        };

        const panelContentStyle = {padding: 12};

        const helpText = <div className="search-container">
                            <h4>VedaVeb Search Modes</h4>
                            This document describes the holy search 
                            modes as they were handed down for generations.<br/>
                            There is a simple one and a more complex one. Choose from 
                            your options wisely.<br/>If these enlightened words are not 
                            verbose enough for you, please feel free to call our hotline:<br/>
                            +49 221 S-A-N-S-K-R-I-T
                        </div>;

        const searchTransliterationPanelHeader =
            <div>
                {"Input Transliteration: "}
                <span className="red trans-font">
                    {searchMetaStore.transliteration.name}
                </span>
            </div>

        const searchScopePanelHeader =
            <div>
                {"Search Scope: "}
                <span className="red trans-font">
                    <SearchScopeIndicator />
                </span>
            </div>


        return (

            <Row id="search-view" className="page-content" key="search-view">

                <Col xl={12}>
                    <div className="card">
                        <h4>
                            <Icon type="search" className="gap-right"/>
                            Advanced Search
                        </h4>
                        
                        <Tabs
                        onChange={this.switchMode}
                        type="card"
                        id="search-mode-selector"
                        tabBarGutter={8}>
                            <TabPane tab="Grammar Search" key="grammar">
                                <SearchGrammar />
                            </TabPane>
                            <TabPane tab="Simple Search" key="simple">
                                <SearchSimple/>
                            </TabPane>
                            <TabPane tab="Other Search" key="somemode">
                                <div className="search-container">
                                Some other search mode...
                                </div>
                            </TabPane>
                            <TabPane tab={<Icon type="question"/>} key="help">
                                {helpText}
                            </TabPane>
                        </Tabs>

                        <Row>
                            <Col span={12} offset={12} className="content-right">
                                <Button
                                icon="search"
                                size="large"
                                className={"secondary-font"}
                                onClick={this.handleSubmit}>
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    
                    </div>
                </Col>

                <Col xl={12}>
                    <div className="card">
                        <h4>
                            <Icon type="paper-clip" className="gap-right"/>
                            Search Settings
                        </h4>

                        <Collapse bordered={false}>

                            <Panel
                            header={searchTransliterationPanelHeader}
                            key={"1" + searchMetaStore.transliteration.name}
                            style={customPanelStyle}
                            forceRender={true}>
                                <div style={panelContentStyle}>
                                    <SearchTransliteration/>
                                </div>
                            </Panel>

                            <Panel
                            header={searchScopePanelHeader}
                            key="2"
                            style={customPanelStyle}
                            forceRender={true}>
                                <SearchScopeContainer/>
                            </Panel>
                        </Collapse>
                    </div>
                </Col>

            </Row>
        );

    }

}

export default withRouter(view(SearchView));