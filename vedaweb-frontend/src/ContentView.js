import React, { Component } from "react";
import { Row, Col, Affix, Switch, Spin, Select, Button, Icon } from 'antd';

import ContentLocation from "./ContentLocation";
import ErrorMessage from "./ErrorMessage";
import showNote from "./Note";

import "./css/ContentView.css";

import { withRouter } from 'react-router-dom';

import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';

import axios from 'axios';
import uiDataStore from "./stores/uiDataStore";

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

    resolveAbbrevationToHTML(abb, cat){
        return abb.split('').map(key => (
            <span>
                <span className="bold secondary-font">{key}</span>
                <span> - {uiDataStore.abbrevations[cat][key]}</span><br/>
            </span>
        ));
    }

    openDict(lemma, ref){
        showNote(lemma, "TODO: content of ref '" + ref + "'");
    }

    cleanLemmaString(lemma){
        if (typeof lemma === 'string' || lemma instanceof String){
            lemma = lemma.replace(/\s?\d/g,'');
            if (lemma.startsWith('\u221A') && lemma.charAt(lemma.length - 1) === '-'){
                lemma = lemma.substr(0, lemma.length - 1);
            }
        }
        return lemma.trim();
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
                                                                    {this.cleanLemmaString(token.lemma)}
                                                                    {
                                                                        Object.keys(token.grammar).map(key => (
                                                                            <span key={"t_" + token.index + "_" + key}>
                                                                                .{token.grammar[key]}
                                                                            </span>
                                                                        ))
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
                                                {data.padas.map(pada => (
                                                    pada.tokens.map((token, i) => (
                                                        <div key={token + i}>
                                                            {token.form + " ("}
                                                            <span className="bold">{token.lemma}</span>
                                                            {token.lemmaRef.map((ref, i) => (
                                                                <a
                                                                className="dict-link"
                                                                onClick={e => this.openDict(token.lemma, ref)}>
                                                                    <Icon type="eye-o"/>
                                                                    {(i+1) + " "}
                                                                </a>
                                                            ))}
                                                            {")"}
                                                        </div>
                                                    ))
                                                ))}
                                            </div>
                                        }

                                        {appStateStore.viewFilter.metaInfo &&
                                            <div
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Meta Info</h4>

                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="bold gap-right secondary-font">Hymn Addressee:</span>
                                                        </td>
                                                        <td>
                                                            {data.hymnAddressee}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="bold gap-right secondary-font">Hymn Group:</span>
                                                        </td>
                                                        <td>
                                                            {data.hymnGroup}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="bold gap-right secondary-font">Strata:</span>
                                                        </td>
                                                        <td>
                                                            {this.resolveAbbrevationToHTML(data.strata, "strata")}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="bold gap-right secondary-font">Pada Labels:</span>
                                                        </td>
                                                        <td>
                                                            {data.padas.map(pada => (
                                                                <div>
                                                                    <div style={{display:"inline-block", verticalAlign:"top"}} className="bold red secondary-font gap-right">{pada.line}:</div>
                                                                    <div style={{display:"inline-block", verticalAlign:"top"}}>{this.resolveAbbrevationToHTML(pada.label, "label")}</div>
                                                                </div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        }

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