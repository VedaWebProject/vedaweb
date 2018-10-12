import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse } from 'antd';

import SearchGrammar from "./SearchGrammar";
import SearchScopeContainer from "./SearchScopeContainer";
import SearchTransliteration from "./SearchTransliteration";
import SearchScopeIndicator from "./SearchScopeIndicator";

import SanscriptAccents from './SanscriptAccents';

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
                block.form = SanscriptAccents.t(block.form, searchMetaStore.transliteration.id, "iso");
                for (let field of block.fields){
                    if (field.value.length > 0)
                        block[field.name] = field.value
                }
                delete block.fields;
                delete block.id;
            }
        }

        jsonData.scopes = jsonData.scopes.filter(scope => (
            (scope.fromBook + scope.toBook + scope.fromHymn + scope.toHymn) > 0
        ));

        this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData)));
    }


    render() {

        //TEMP DEV
        const customPanelStyle = {
            background: '#fafafa',
            borderRadius: 2,
            marginBottom: 24,
            border: '1px solid #c9bbac',
            overflow: 'hidden',
            fontFamily: 'Dosis, sans-serif',
            fontSize: '18px'
        };

        const panelContentStyle = {padding: 12};

        const helpText = <div className="search-container">
                            <h3>VedaVeb Advanced Search Modes</h3>
                            In the future, this place might be home to a detailed explanation of the different search modes.
                        </div>;

        const searchTransliterationPanelHeader =
            <div>
                {"Input Method: "}
                <span className="red trans-font">
                    {searchMetaStore.transliteration.name}
                </span>
            </div>

        const searchScopePanelHeader =
            <div>
                {"Delimit Search Range: "}
                <span className="red trans-font">
                    <SearchScopeIndicator />
                </span>
            </div>


        return (

            <Row
            type="flex"
            justify="center"
            id="search-view"
            className="page-content"
            key="search-view">

                <Col xl={12}>
                    <div className="card">
                        <h4>
                            <Icon type="search" className="gap-right"/>
                            Advanced Search
                        </h4>

                        <Collapse bordered={false}>
                            <Panel
                            header={searchTransliterationPanelHeader}
                            key={"transliteration"}
                            style={customPanelStyle}
                            forceRender={true}>
                                <div style={panelContentStyle}>
                                    <SearchTransliteration/>
                                </div>
                            </Panel>
                        </Collapse> 
                        
                        <Tabs
                        onChange={this.switchMode}
                        type="card"
                        id="search-mode-selector"
                        tabBarGutter={8}>
                            <TabPane tab="Grammar Search" key="grammar">
                                <SearchGrammar />
                            </TabPane>
                            {/* <TabPane tab="Simple Search" key="simple">
                                <SearchSimple/>
                            </TabPane> */}
                            <TabPane tab="Other Search" key="somemode">
                                <div className="search-container">
                                    More additional search modes will follow ...
                                </div>
                            </TabPane>
                            <TabPane tab={<Icon type="question"/>} key="help">
                                {helpText}
                            </TabPane>
                        </Tabs>

                        <Collapse bordered={false}>
                            <Panel
                            header={searchScopePanelHeader}
                            key="scope"
                            style={customPanelStyle}
                            forceRender={true}>
                                <SearchScopeContainer/>
                            </Panel>
                        </Collapse>

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
            </Row>
        );

    }

}

export default withRouter(view(SearchView));