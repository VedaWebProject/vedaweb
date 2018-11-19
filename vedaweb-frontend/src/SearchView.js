import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse } from 'antd';

import SearchGrammar from "./SearchGrammar";
import SearchScopeContainer from "./SearchScopeContainer";
import SearchTransliteration from "./SearchTransliteration";
import SearchScopeIndicator from "./SearchScopeIndicator";
import SearchMetaFilterList from "./SearchMetaFilterList";
import HelpButton from "./HelpButton";

import SanscriptAccents from './SanscriptAccents';

import './css/SearchView.css';

import { view } from 'react-easy-state';

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import searchGrammarStore from "./stores/searchGrammarStore";

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class SearchView extends Component {

    constructor(props){
        super(props);
        this.switchMode = this.switchMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        document.title = "VedaWeb | Advanced Search";
    }

    switchMode(key){
        if (key !== "help")
            searchMetaStore.mode = key;
    }

    handleSubmit(e){
        let jsonData = {
            mode: searchMetaStore.mode,
            scopes: searchMetaStore.scopes,
            meta: searchMetaStore.meta
        };
        
        if (searchMetaStore.mode === "grammar"){
            jsonData["blocks"] = JSON.parse(JSON.stringify(searchGrammarStore.data.blocks));

            for (let block of jsonData.blocks){
                block.form = SanscriptAccents.t(block.form, searchMetaStore.transliteration, "iso");
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

        this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData), true));
    }

    handleReset(e){
        searchMetaStore.reset();
        searchGrammarStore.reset();
    }


    render() {

        //TEMP DEV
        const customPanelStyle = {
            background: '#fafafa',
            borderRadius: 2,
            marginBottom: 24,
            border: '1px solid #b4b1ae',
            overflow: 'hidden',
            fontSize: '18px'
        };

        const searchTransliterationPanelHeader =
            <div>
                {"Selected Transliteration: "}
                <span className="red">
                    {uiDataStore.search.meta.transliterations
                        .filter(t => t.id === searchMetaStore.transliteration)[0].name}
                </span>
            </div>

        const searchScopePanelHeader =
            <div>
                {"Delimit Search Range: "}
                <span className="red">
                    <SearchScopeIndicator />
                </span>
            </div>

        const customMetaFilterPanelHeader =
            <div>
                Meta Filters: 
                {searchMetaStore.hasMetas() ?
                    <span className="red"> Adressee ({searchMetaStore.meta.hymnAddressee.length}),
                        Group ({searchMetaStore.meta.hymnGroup.length}),
                        Strata ({searchMetaStore.meta.strata.length})
                    </span>
                    : <span className="red"> none</span>
                }
            </div>


        return (

            <Row
            type="flex"
            justify="center"
            id="search-view"
            className="page-content"
            key="search-view">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">
                        <h4>Advanced Search</h4>

                        <h3><Icon type="edit" className="gap-right"/>Input Transliteration</h3>
                        <Collapse bordered={false}>
                            <Panel
                            header={searchTransliterationPanelHeader}
                            key={"transliteration"}
                            style={customPanelStyle}
                            forceRender={true}>
                                <HelpButton type="transliteration" />
                                <SearchTransliteration/>
                            </Panel>
                        </Collapse> 
                        
                        <h3><Icon type="search" className="gap-right"/>What are you searching for?</h3>
                        <Tabs
                        onChange={this.switchMode}
                        type="card"
                        id="search-mode-selector"
                        tabBarGutter={8}
                        className="bottom-gap">
                            <TabPane tab="Grammar Search" key="grammar">
                                <SearchGrammar />
                            </TabPane>
                            {/* <TabPane tab="Simple Search" key="simple">
                                <SearchSimple/>
                            </TabPane> */}
                            <TabPane tab="Other Search" key="somemode">
                                <div className="search-container">
                                    More search modes will follow ...
                                </div>
                            </TabPane>
                        </Tabs>

                        <h3><Icon type="tool" className="gap-right"/>Additional Search Settings</h3>
                        <Collapse bordered={false}>
                            <Panel
                            header={searchScopePanelHeader}
                            key="scope"
                            style={customPanelStyle}
                            forceRender={true}>
                                <HelpButton type="searchScope" />
                                <SearchScopeContainer/>
                            </Panel>

                            <Panel
                            header={customMetaFilterPanelHeader}
                            key="metafilters"
                            style={customPanelStyle} >
                                <HelpButton type="searchMetaFilters" />
                                <SearchMetaFilterList
                                label="Hymn Addressees"
                                placeholder="all Addressees"
                                items={uiDataStore.meta.hymnAddressee}
                                selected={searchMetaStore.meta.hymnAddressee}
                                handleChange={v => {searchMetaStore.meta.hymnAddressee = v}}/>
                                <SearchMetaFilterList
                                label="Hymn Groups"
                                placeholder="all Groups"
                                items={uiDataStore.meta.hymnGroup}
                                selected={searchMetaStore.meta.hymnGroup}
                                handleChange={v => {searchMetaStore.meta.hymnGroup = v}}/>
                                <SearchMetaFilterList
                                label="Verse Strata"
                                placeholder="all Strata"
                                items={uiDataStore.meta.strata}
                                selected={searchMetaStore.meta.strata}
                                handleChange={v => {searchMetaStore.meta.strata = v}}/>
                            </Panel>
                        </Collapse>

                        <Row>
                            <Col span={24} className="content-right">
                                <Button
                                icon="delete"
                                size="large"
                                className={"secondary-font"}
                                htmlType="reset"
                                onClick={this.handleReset}>
                                    Reset
                                </Button>

                                <Button
                                type="primary"
                                icon="search"
                                size="large"
                                className={"secondary-font gap-left-big"}
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