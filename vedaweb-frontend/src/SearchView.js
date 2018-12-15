import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse, Checkbox } from 'antd';

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
            meta: searchMetaStore.meta,
            accents: searchMetaStore.accents
        };
        
        if (searchMetaStore.mode === "grammar"){
            jsonData["blocks"] = JSON.parse(JSON.stringify(searchGrammarStore.data.blocks));
            
            //remove empty blocks
            jsonData.blocks = jsonData.blocks.filter(block => !this.isBlockEmpty(block));
            

            for (let block of jsonData.blocks){
                block.form = SanscriptAccents.t(block.form, searchMetaStore.transliteration, "iso");
                //make fields direct props of block
                for (let field of block.fields){
                    if (field.value !== undefined && field.value.length > 0)
                        block[field.name] = field.value;
                }
                //cleanup
                delete block.fields;
                delete block.id;
            }
        }

        jsonData.scopes = jsonData.scopes.filter(scope => (
            (scope.fromBook + scope.toBook + scope.fromHymn + scope.toHymn) > 0
        ));

        this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(jsonData)));
    }

    isBlockEmpty(block){
        return (block.form === undefined || block.form.length === 0)
            && block.fields.filter(field => field.value.length > 0).length === 0;
    }

    handleReset(e){
        searchMetaStore.reset();
        searchGrammarStore.reset();
    }


    render() {

        const customPanelStyle = {
            background: '#fafafa',
            borderRadius: 2,
            marginBottom: 24,
            border: '1px solid #b4b1ae',
            overflow: 'hidden',
            fontSize: '18px'
        };

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

                        <h3 className="top-gap-big">
                            <Icon type="tool" className="gap-right"/>
                            General settings (applies to all searches)
                        </h3>
                        <Row className="bottom-gap">
                            <Col span={8}>
                                Input transliteration:
                                <HelpButton inline type="transliteration" style={{marginLeft: '1rem'}} />
                            </Col>
                            <Col span={16}>
                                <SearchTransliteration/>
                            </Col>
                        </Row>
                        <Row className="bottom-gap">
                            <Col span={8}>
                                Accent-sensitive search:
                                <HelpButton inline type="accentSensitive" style={{marginLeft: '1rem'}} />
                            </Col>
                            <Col span={16}>
                                <Checkbox
                                onChange={e => searchMetaStore.setAccents(e.target.checked)}
                                checked={searchMetaStore.accents} >
                                    Accent-sensitive
                                </Checkbox>
                            </Col>
                        </Row>
                        
                        <h3 className="top-gap-big"><Icon type="search" className="gap-right"/>What are you searching for?</h3>
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

                        <h3 className="top-gap"><Icon type="filter" className="gap-right"/>Additional search filters</h3>
                        <Collapse bordered={false}>
                            <Panel
                            header={searchScopePanelHeader}
                            key="scope"
                            style={customPanelStyle}
                            forceRender={true}>
                                <HelpButton align="left" type="searchScope" />
                                <SearchScopeContainer/>
                            </Panel>

                            <Panel
                            header={customMetaFilterPanelHeader}
                            key="metafilters"
                            style={customPanelStyle} >
                                <HelpButton align="left" type="searchMetaFilters" />
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
                                label="Stanza Strata"
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