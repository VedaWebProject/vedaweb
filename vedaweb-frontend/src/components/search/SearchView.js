import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse, Checkbox } from 'antd';

import SearchGrammar from "./grammar/SearchGrammar";
import SearchMetrical from "./metrical/SearchMetrical";
import SearchScopeContainer from "./settings/SearchScopeContainer";
import SearchTransliteration from "./settings/SearchTransliteration";
import SearchScopeIndicator from "./settings/SearchScopeIndicator";
import SearchMetaFilterList from "./settings/SearchMetaFilterList";
import HelpButton from "../widgets/HelpButton";

import './SearchView.css';

import { view } from 'react-easy-state';

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import stateStore from "../../stateStore";

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class SearchView extends Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        document.title = "VedaWeb | Advanced Search";
    }

    handleSubmit(e){
        let query = stateStore.search[stateStore.search.meta.mode].getQuery();
        query.mode = stateStore.search.meta.mode;
        query.scopes = stateStore.search.meta.scopes;
        query.meta = stateStore.search.meta.meta;
        query.accents = stateStore.settings.accents;

        query.scopes = query.scopes.filter(scope => (
            (scope.fromBook + scope.toBook + scope.fromHymn + scope.toHymn) > 0
        ));
        
        this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(query)));
    }

    handleReset(e){
        stateStore.search.meta.reset();
        stateStore.search.grammar.reset();
        stateStore.search.metrical.reset();
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
                {stateStore.search.meta.hasMetas() ?
                    <span className="red"> Adressee ({stateStore.search.meta.meta.hymnAddressee.length}),
                        Group ({stateStore.search.meta.meta.hymnGroup.length}),
                        Strata ({stateStore.search.meta.meta.strata.length})
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
                        <h1>Advanced Search</h1>

                        <div data-tour-id="search-settings">
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
                                    onChange={e => stateStore.settings.accents = e.target.checked}
                                    checked={stateStore.settings.accents} >
                                        Accent-sensitive
                                    </Checkbox>
                                </Col>
                            </Row>
                        </div>

                        <h3 className="top-gap-big"><Icon type="search" className="gap-right"/>What are you searching for?</h3>

                        <Tabs
                        data-tour-id="search-modes"
                        onChange={(key) => stateStore.search.meta.mode = key}
                        activeKey={stateStore.search.meta.mode}
                        type="card"
                        id="search-mode-selector"
                        tabBarGutter={8}
                        className="bottom-gap">
                            <TabPane tab="Grammar Search" key="grammar">
                                <SearchGrammar />
                            </TabPane>
                            <TabPane tab="Metrical Search" key="metrical">
                                <SearchMetrical />
                            </TabPane>
                        </Tabs>

                        <h3 className="top-gap"><Icon type="filter" className="gap-right"/>Additional search filters</h3>

                        <div data-tour-id="search-filters">
                            <Collapse
                            bordered={false}>
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
                                    placeholder="All Addressees"
                                    items={stateStore.ui.meta.hymnAddressee}
                                    selected={stateStore.search.meta.meta.hymnAddressee}
                                    handleChange={v => {stateStore.search.meta.meta.hymnAddressee = v}}/>
                                    <SearchMetaFilterList
                                    label="Hymn Groups"
                                    placeholder="All Groups"
                                    items={stateStore.ui.meta.hymnGroup}
                                    selected={stateStore.search.meta.meta.hymnGroup}
                                    handleChange={v => {stateStore.search.meta.meta.hymnGroup = v}}/>
                                    <SearchMetaFilterList
                                    label="Stanza Strata"
                                    placeholder="All Strata"
                                    items={stateStore.ui.meta.strata}
                                    itemLabels={stateStore.ui.abbreviations.strata}
                                    selected={stateStore.search.meta.meta.strata}
                                    handleChange={v => {stateStore.search.meta.meta.strata = v}}/>
                                    <SearchMetaFilterList
                                    label="Stanza Type"
                                    placeholder="All Stanza Types"
                                    items={stateStore.ui.meta.stanzaType}
                                    itemLabels={stateStore.ui.abbreviations.stanzaType}
                                    selected={stateStore.search.meta.meta.stanzaType}
                                    handleChange={v => {stateStore.search.meta.meta.stanzaType = v}}/>
                                </Panel>
                            </Collapse>
                        </div>

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