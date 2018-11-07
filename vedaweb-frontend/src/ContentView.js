import React, { Component } from "react";
import { Row, Col, Affix, Spin, Select, Button, Icon } from 'antd';

import ContentLocation from "./ContentLocation";
import ContentFilterSwitch from "./ContentFilterSwitch";
import ErrorMessage from "./ErrorMessage";


import "./css/ContentView.css";

import { withRouter } from 'react-router-dom';

import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';

import axios from 'axios';
import uiDataStore from "./stores/uiDataStore";
import DictionaryView from "./DictionaryView";
import HelpButton from "./HelpButton";

const Option = Select.Option;


class ContentView extends Component {

    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        if (this.props.match.params.by === undefined
            || this.props.match.params.value === undefined){
            this.props.history.push("/view/index/0");
        } else {
            this.loadData(this.props.match.params.by, this.props.match.params.value);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.by !== prevProps.match.params.by
                || this.props.match.params.value !== prevProps.match.params.value){
            this.loadData(this.props.match.params.by, this.props.match.params.value);
        }
    }

    propsChanged(newProps){
        return JSON.stringify(this.props) !== JSON.stringify(newProps);
    }

    loadData(by, value){
        this.setState({
            isLoaded: false,
            error: undefined,
        });

        axios.get("/api/document/" + by + "/" + value)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
                });
                //set page title
                document.title = "VedaWeb | " +
                    ((response.data.id !== undefined)
                        ? "Verse " + response.data.book + "." + response.data.hymn + "." + response.data.verse
                            + " | " + response.data.hymnGroup
                        : " Rigveda online");
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    filterChange(target, checked){
        if (checked) uiDataStore.viewScrollTo = true;
        uiDataStore.viewFilter[target] = checked;
    }

    scrollTo(component){
        if (uiDataStore.viewScrollTo){
            scrollToComponent(component, {align:'top'});
            uiDataStore.viewScrollTo = false;
        }
    }

    resolveAbbrevationToHTML(abb, cat){
        return abb.split('').map((key, i) => (
            <span key={"abb_" + i}>
                <span className="bold secondary-font">{key}</span>
                <span> - {uiDataStore.abbreviations[cat][key]}</span><br/>
            </span>
        ));
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
                        <div>
                            <Row>

                                {/** CONTENT **/}
                                <Col span={18}>

                                    <div className="card">
                                        { data.book !== undefined &&
                                            <div>
                                                <ContentLocation
                                                key={'loc_' + data.id}
                                                currIndex={data.index}
                                                currId={data.id}
                                                book={data.book}
                                                hymn={data.hymn}
                                                verse={data.verse} />
                                        
                                                <span className="bold gap-left-big">Hymn addressee: </span>
                                                <span className="text-font">{data.hymnAddressee}</span>
                                                <span className="bold gap-left-big">Hymn group: </span>
                                                <span className="text-font">{data.hymnGroup}</span>
                                            </div>
                                        }
                                    </div>

                                    { data.padas !== undefined &&
                                        <div>
                                            <div className="content-plain content-block card">
                                                <HelpButton type="zurichIso" float/>
                                                <h4 title={"Rigveda, book " + data.book + ", hymn " + data.hymn + ", verse " + data.verse}>
                                                    {('0' + data.book).slice(-2)}.
                                                    {('00' + data.hymn).slice(-3)}.
                                                    {('0' + data.verse).slice(-2)}
                                                </h4>
                                                {data.padas.map(pada => (
                                                    <div className="bottom-gap-small" key={"p_plain_" + pada.index}>
                                                        <span key={"p_plain_line" + pada.index} className="pada-line">{pada.line}</span>
                                                        <span key={"p_plain_form" + pada.index} className="pada-form text-font">{pada.form}</span><br/>
                                                    </div>
                                                ))}
                                            </div>

                                            {uiDataStore.viewFilter.devanagari &&
                                                <div
                                                className="content-plain content-block card deva-font"
                                                ref={this.scrollTo}>
                                                    <h4>Devanagari (Detlef)</h4>
                                                    {data.versions.filter(v => v.language === 'deva').map(v => (
                                                        v.form.map((line, i) => (
                                                            <div key={"deva_" + i}>{line}</div>
                                                        ))
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.padapatha &&
                                                <div
                                                className="content-plain content-block card text-font"
                                                ref={this.scrollTo}>
                                                    <h4>Padapatha</h4>
                                                    {data.versions.filter(v => v.source === 'Padapatha').map(v => (
                                                        v.form.map((line, i) => (
                                                            <div key={"padapatha_" + i}>{line}</div>
                                                        ))
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.sasapatha &&
                                                <div
                                                className="content-plain content-block card text-font"
                                                ref={this.scrollTo}>
                                                    <h4>Sasa Patha (Gunkel, Ryan)</h4>
                                                    {data.versions.filter(v => v.source === 'Sasa Patha (Gunkel, Ryan)').map(v => (
                                                        v.form.map((line, i) => (
                                                            <div key={"sasa_" + i}>{line}</div>
                                                        ))
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.vnh &&
                                                <div
                                                className="content-plain content-block card text-font"
                                                ref={this.scrollTo}>
                                                    <h4>Van Nooten, Holland</h4>
                                                    {data.versions.filter(v => v.source === 'Van Nooten, Holland').map(v => (
                                                        v.form.map((line, i) => (
                                                            <div key={"vnh_" + i}>{line}</div>
                                                        ))
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.aufrecht &&
                                                <div
                                                className="content-plain content-block card text-font"
                                                ref={this.scrollTo}>
                                                    <h4>Aufrecht</h4>
                                                    {data.versions.filter(v => v.source === 'Aufrecht').map(v => (
                                                        v.form.map((line, i) => (
                                                            <div key={"aufrecht_" + i}>{line}</div>
                                                        ))
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.glossing &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <HelpButton type="zurichGlossing" float/>
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
                                                                className="glossing-token text-font"
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

                                            {uiDataStore.viewFilter.translations &&
                                                <div
                                                className="content-block card"
                                                ref={this.scrollTo}>
                                                    <h4 className="inline-block">Translations</h4>

                                                    <ContentFilterSwitch
                                                    label="EN (Griffith)"
                                                    onChange={(e) => {uiDataStore.disabledTranslations["Griffith"] = !e}}
                                                    disabled={data.translations.filter(t => t.source === "Griffith").length === 0}
                                                    checked={!uiDataStore.disabledTranslations["Griffith"]}
                                                    inline={true} />

                                                    <ContentFilterSwitch
                                                    label="DE (Geldner)"
                                                    onChange={(e) => {uiDataStore.disabledTranslations["Geldner"] = !e}}
                                                    disabled={data.translations.filter(t => t.source === "Geldner").length === 0}
                                                    checked={!uiDataStore.disabledTranslations["Geldner"]} 
                                                    inline={true} />

                                                    <ContentFilterSwitch
                                                    label="DE (Grassmann)"
                                                    onChange={(e) => {uiDataStore.disabledTranslations["Grassmann"] = !e}}
                                                    disabled={data.translations.filter(t => t.source === "Grassmann").length === 0}
                                                    checked={!uiDataStore.disabledTranslations["Grassmann"]} 
                                                    inline={true} />

                                                    {data.translations.map(translation => (
                                                        !uiDataStore.disabledTranslations[translation.source] &&
                                                        <div key={"trans_" + translation.source} className="translation">
                                                            <span className="bold">{
                                                                translation.language.toUpperCase() === "DE" ? "German" :
                                                                translation.language.toUpperCase() === "EN" ? "English" :
                                                                translation.language.toUpperCase() === "FR" ? "French" : "?"
                                                            }</span>
                                                            <span className="first-cap"> ({translation.source})</span>
                                                            <br/>
                                                            <div className="text-font">
                                                                {translation.form.map((line, i) => (
                                                                    <div key={"trans_" + i}>{line}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.dictionary &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h4>Dictionary (Grassmann)</h4>
                                                    <DictionaryView
                                                    key={data.id}
                                                    data={data.padas}/>
                                                </div>
                                            }

                                            {uiDataStore.viewFilter.metaInfo &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h4>Meta Info</h4>

                                                    <table style={{width:'auto'}}>
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className="bold gap-right">Hymn Addressee:</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {data.hymnAddressee}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span className="bold gap-right">Hymn Group:</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {data.hymnGroup}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span className="bold gap-right">Strata (Arnold):</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {this.resolveAbbrevationToHTML(data.strata, "strata")}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span className="bold gap-right">Pada Labels (Gunkel, Ryan):</span>
                                                            </td>
                                                            <td>
                                                                {data.padas.map(pada => (
                                                                    <div>
                                                                        <div style={{display:"inline-block", verticalAlign:"top"}} className="bold red gap-right">{pada.line}:</div>
                                                                        <div style={{display:"inline-block", verticalAlign:"top"}} className="text-font">
                                                                            {this.resolveAbbrevationToHTML(pada.label, "label")}
                                                                        </div>
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

                                            <h5>Additional versions</h5>

                                            <ContentFilterSwitch
                                            label="Devanagari"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.devanagari}
                                            onChange={(e) => this.filterChange("devanagari", e)} />

                                            <ContentFilterSwitch
                                            label="Padapatha"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.padapatha}
                                            onChange={(e) => this.filterChange("padapatha", e)} />

                                            <ContentFilterSwitch
                                            label="Sasa Patha"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.sasapatha}
                                            onChange={(e) => this.filterChange("sasapatha", e)} />

                                            <ContentFilterSwitch
                                            label="Van Nooten, Holland"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.vnh}
                                            onChange={(e) => this.filterChange("vnh", e)} />

                                            <ContentFilterSwitch
                                            label="Aufrecht"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.aufrecht}
                                            onChange={(e) => this.filterChange("aufrecht", e)} />

                                            <h5>Metadata</h5>
                                            
                                            <ContentFilterSwitch
                                            label="Morphological Glossing"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.glossing}
                                            onChange={(e) => this.filterChange("glossing", e)} />

                                            <ContentFilterSwitch
                                            label="Translations"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.translations}
                                            onChange={(e) => this.filterChange("translations", e)} />

                                            <ContentFilterSwitch
                                            label="Dictionary"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.dictionary}
                                            onChange={(e) => this.filterChange("dictionary", e)} />

                                            <ContentFilterSwitch
                                            label="Meta Tags"
                                            disabled={!isLoaded || error !== undefined}
                                            checked={uiDataStore.viewFilter.metaInfo}
                                            onChange={(e) => this.filterChange("metaInfo", e)} />
                                            
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
                        </div>
                    }
                </div>
                
            </Spin>
        );
    }
}

export default withRouter(view(ContentView));