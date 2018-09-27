import React, { Component } from "react";
import { Row, Col, Affix, Switch, Spin, Select, Button, Icon } from 'antd';

import ContentLocation from "./ContentLocation";
import ErrorMessage from "./ErrorMessage";

import "./css/ContentView.css";

import { withRouter } from 'react-router-dom';

import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';

import axios from 'axios';

const Option = Select.Option;


class ContentView extends Component {

    constructor(props) {
        super(props)
        this.state ={
            data: {},
            viewBy: null,
            viewValue: null,
            isLoaded: false
        }
    }

    componentDidMount() {
        this.loadData(this.props.match.params.by, this.props.match.params.value);
    }

    componentDidUpdate() {
        if (this.props.match.params.by !== this.state.viewBy
                || this.props.match.params.value !== this.state.viewValue){
            this.loadData(this.props.match.params.by, this.props.match.params.value);
        }
    }

    // componentWillReceiveProps(newProps){
    //     if (this.propsChanged(newProps)){
    //         this.loadData(newProps.match.params.by, newProps.match.params.value);
    //     }
    // }

    propsChanged(newProps){
        return JSON.stringify(this.props) !== JSON.stringify(newProps);
    }

    loadData(by, value){
        this.setState({
            isLoaded: false,
            error: undefined,
            viewBy: by,
            viewValue: value
        });

        axios.get("/api/document/" + by + "/" + value)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    filterChange(target, checked){
        if (checked) appStateStore.viewScrollTo = true;
        appStateStore.viewFilter[target] = checked;
    }

    scrollTo(component){
        if (appStateStore.viewScrollTo){
            scrollToComponent(component);
            appStateStore.viewScrollTo = false;
        }
    }
    

    render() {
        const { error, isLoaded, data } = this.state;
        const exportOptions = ["PDF","XML","TEI-XML","Text"];

        return (
            <Spin
            size="large"
            delay={200}
            spinning={!isLoaded} >

                <div className="page-content">

                    {/** ERROR **/}
                    { isLoaded && error !== undefined &&
                        <ErrorMessage/>
                    }

                    {/** LOADED, NO ERROR **/}
                    { error === undefined &&

                        <Row
                        id="content-view"
                        type="flex"
                        justify="center">

                            <Col span={18} className="content">

                                {/** CONTENT **/}

                                { data.padas !== undefined && error === undefined &&

                                    <div>
                                        <div className="content-plain content-block card">

                                            <ContentLocation
                                                currIndex={data.index}
                                                locationBook={data.book}
                                                locationHymn={data.hymn}
                                                locationVerse={data.verse} />

                                            {data.padas.map(pada => (
                                                <div className="bottom-gap-small" key={"p_plain_" + pada.index}>
                                                    <span key={"p_plain_line" + pada.index} className="pada-line">{pada.line}</span>
                                                    <span key={"p_plain_form" + pada.index} className="pada-form">{pada.form}</span><br/>
                                                </div>
                                            ))}
                                        </div>

                                        {appStateStore.viewFilter.devanagari &&
                                            <div
                                            className="content-block card deva-font"
                                            ref={this.scrollTo}>
                                                <h4>Devanagari (Detlef)</h4>
                                                {data.versions.filter(v => v.language === 'deva').map(v => (
                                                    v.form.map(line => (
                                                        <div>{line}</div>
                                                    ))
                                                ))}
                                            </div>
                                        }

                                        {appStateStore.viewFilter.grammar &&
                                            <div
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Morphological Glossing</h4>
                                                {data.padas.map(pada => (
                                                    <div
                                                    className="glossing-line"
                                                    key={"p_" + pada.index}>

                                                        <span key={"p_gloss_line" + pada.index} className="pada-line">
                                                            {pada.line}
                                                        </span>

                                                        {pada.tokens.map(token => (
                                                            <div
                                                            className="glossing-token"
                                                            key={"t_" + token.index}>
                                                                {token.form}
                                                                <br/>
                                                                <div className="glossing-annotation">
                                                                    <a href="http://vedaweb.uni-koeln.de">{token.lemma}</a>
                                                                    {
                                                                        "." +
                                                                        (token.grammar.case === undefined ? "" :
                                                                        (token.grammar.case + ".")) +

                                                                        (token.grammar.number === undefined ? "" :
                                                                        (token.grammar.number + ".")) +

                                                                        (token.grammar.gender === undefined ? "" :
                                                                        (token.grammar.gender))
                                                                    }
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                ))}
                                            </div>
                                        }

                                        {appStateStore.viewFilter.translations &&
                                            <div
                                            className="content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Translations</h4>
                                                {data.translations.map(translation => (
                                                    <div key={"trans_" + translation.source} className="translation">
                                                        <span className="bold">{
                                                            translation.language.toUpperCase() === "DE" ? "German" :
                                                            translation.language.toUpperCase() === "EN" ? "English" :
                                                            translation.language.toUpperCase() === "FR" ? "French" : "?"
                                                        }</span>
                                                        <span className="first-cap"> ({translation.source})</span>
                                                        <br/>
                                                        <div className="italic">
                                                            {translation.form.map(line => (
                                                                <div>{line}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        }

                                        {appStateStore.viewFilter.dictionary &&
                                            <div
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Dictionary (Grassmann)</h4>
                                                <div className="dict-links">
                                                    {data.padas.map(pada => (
                                                        pada.tokens.map((token, i) => (
                                                            <div key={token + i}>
                                                                {token.form + " (\u2192 "}
                                                                <a className="dict-link" href="http://vedaweb.uni-koeln.de">
                                                                    {token.lemma}
                                                                </a>{")"}
                                                            </div>
                                                        ))
                                                    ))}
                                                </div>
                                            </div>
                                        }

                                        {appStateStore.viewFilter.metaInfo &&
                                            <div
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Meta Info</h4>
                                                <span className="bold gap-right">Hymn Addressee:</span>{data.hymnAddressee}<br/>
                                                <span className="bold gap-right">Hymn Group:</span>{data.hymnGroup}<br/>
                                                <span className="bold gap-right">Strata:</span>{data.strata}<br/>
                                            </div>
                                        }

                                        {/*
                                        {appStateStore.viewFilter.something1 &&
                                            <div
                                            className="content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Something</h4>
                                                Something...
                                            </div>
                                        }

                                        {appStateStore.viewFilter.something2 &&
                                            <div
                                            className="content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Something else</h4>
                                                Something else...
                                            </div>
                                        }
                                        */}

                                    </div>
                                }
                            </Col>
                            
                            <Col span={6}>
                                <Affix offsetTop={10}>
                                    <div className="card">
                                        <h4><Icon type="filter" className="gap-right"/> View Filters</h4>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("devanagari", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.devanagari}
                                            size="small" />
                                            Devanagari
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("grammar", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.grammar}
                                            size="small" />
                                            Morphological Glossing
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("translations", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.translations}
                                            size="small" />
                                            Translations
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("dictionary", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.dictionary}
                                            size="small" />
                                            Dictionary
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("metaInfo", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.metaInfo}
                                            size="small" />
                                            Meta Info
                                        </div>
                                        {/*
                                        <div className="view-filter">
                                            <Switch
                                            onChange={(e) => this.filterChange("something1", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.something1}
                                            size="small" />
                                            Something
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            onChange={(e) => this.filterChange("something2", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.something2}
                                            size="small" />
                                            Something else
                                        </div>
                                        */}
                                    </div>

                                    <div className="card">
                                        <h4><Icon type="export" className="gap-right"/>Export</h4>
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                defaultValue={"PDF"}
                                                onSelect={(value) => console.log("Export triggered: " + value)}
                                                style={{width:"100%"}}
                                                className="secondary-font">
                                                    {exportOptions.map((eOpt, i) => (
                                                        <Option
                                                        key={'eOpt_' + i}
                                                        value={eOpt}
                                                        className="secondary-font">
                                                            {eOpt}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                            <Col span={2} offset={1}>
                                                <Button
                                                type="secondary"
                                                icon="download"
                                                onClick={() => {alert("Export functionality doesn't exist, yet.")}} />
                                            </Col>
                                        </Row>
                                    </div>
                                </Affix>
                            </Col>
                            
                        </Row>
                    }
                </div>
            </Spin>
        );
    }
}

export default withRouter(view(ContentView));