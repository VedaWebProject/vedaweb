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

        console.log(JSON.stringify(jsonData));

        this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData)));
    }


    render() {

        const panelStyle = {fontFamily: "Dosis", fontSize: "120%"};
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

            <div className="page-content" key="search-view">
                <div className="card">
                    <div id="search-view">
                        <h4>Advanced Search</h4>

                        <h3 className="top-gap-big">
                            <Icon type="setting" className="gap-right"/>
                            Settings
                        </h3>

                        <Collapse>

                            <Panel
                            header={searchTransliterationPanelHeader}
                            key={"1" + searchMetaStore.transliteration.name}
                            style={panelStyle}
                            forceRender={true}>
                                <div style={panelContentStyle}>
                                    <SearchTransliteration/>
                                </div>
                            </Panel>

                            <Panel
                            header={searchScopePanelHeader}
                            key="2"
                            style={panelStyle}
                            forceRender={true}>
                                <SearchScopeContainer/>
                            </Panel>
                        </Collapse>

                        <h3 className="top-gap-big">
                            <Icon type="search" className="gap-right"/>
                            What are you searching for?
                        </h3>
                        
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
                </div>
            </div>
        );

    }

}

export default withRouter(view(SearchView));