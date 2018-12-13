import React, { Component } from "react";
import { Row, Col, Affix, Spin, Button, Icon, Drawer, Badge, Radio, Modal } from 'antd';

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
import layersInfoImg from "./img/layersInfo.png";

const RadioGroup = Radio.Group;


class ContentView extends Component {

    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false,
            filtersVisible: false,
            exportVisible: false
        }
    }

    componentDidMount() {
        if (this.props.match.params.by === undefined
            || this.props.match.params.value === undefined){
            this.props.history.push("/view/index/0");
        } else {
            this.loadData(this.props.match.params.by, this.props.match.params.value);
        }
        this.infoModal();
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

        axios.get(process.env.PUBLIC_URL + "/api/document/" + by + "/" + value)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
                });
                //set page title
                document.title = "VedaWeb | " +
                    ((response.data.id !== undefined)
                        ? "Stanza " + response.data.book + "." + response.data.hymn + "." + response.data.verse
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

    filterChange(target, show){
        if (show) uiDataStore.viewScrollTo = true;
        uiDataStore.toggleLayer(target, show);
    }

    scrollTo(component){
        if (uiDataStore.viewScrollTo){
            scrollToComponent(component, {align:'middle'});
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

    infoModal(){
        if (uiDataStore.firstTime){
            Modal.info({
                icon: <Icon type="export"/>,
                title: 'Please Note:',
                centered: true,
                content: (
                <div>
                    By clicking this button on the right side of the screen, you can choose what you want to see (text versions, translations, morphological glossings, etc.).<br/><br/>
                    <div style={{textAlign: 'center'}}>
                        <img src={layersInfoImg} alt="" style={{border:'1px solid #aaa'}}/>
                    </div><br/>
                    <span className="light-grey">By the way, you will see this message only once per visit.</span>
                </div>
                ),
                onOk() {uiDataStore.firstTime = false},
            });
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
                        <div>
                            <Row>

                                <Col span={24}>
                                    <div className="card-nobox">
                                        { data.book !== undefined &&
                                            <div className="v-middle">
                                                <ContentLocation
                                                key={'loc_' + data.id}
                                                currIndex={data.index}
                                                currId={data.id}
                                                book={data.book}
                                                hymn={data.hymn}
                                                verse={data.verse}
                                                hymnAbs={data.hymnAbs} />
                                        
                                                <span className="bold gap-left-big">Hymn addressee: </span>
                                                <span className="text-font">{data.hymnAddressee}</span>
                                                <span className="bold gap-left-big">Hymn group: </span>
                                                <span className="text-font">{data.hymnGroup}</span>
                                                <span className="bold gap-left-big">Hymn #: </span>
                                                <span className="text-font">{data.hymnAbs}</span>
                                            </div>
                                        }
                                    </div>
                                </Col>

                                {/** CONTENT **/}
                                <Col span={21}>

                                    { data.versions !== undefined &&
                                        <div>
                                            {/* <div className="content-plain content-block card">
                                                <h4 title={"Rigveda, book " + data.book + ", hymn " + data.hymn + ", verse " + data.verse}>
                                                    {('0' + data.book).slice(-2)}.
                                                    {('00' + data.hymn).slice(-3)}.
                                                    {('0' + data.verse).slice(-2)}
                                                    <HelpButton type="zurichIso" inline style={{marginLeft:'.5rem'}}/>
                                                </h4>
                                                {data.padas.map(pada => (
                                                    <div className="bottom-gap-small" key={"p_plain_" + pada.index}>
                                                        <span key={"p_plain_line" + pada.index} className="pada-line">{pada.line}</span>
                                                        <span key={"p_plain_form" + pada.index} className="pada-form text-font">{pada.form}</span><br/>
                                                    </div>
                                                ))}
                                            </div> */}

                                            {uiDataStore.isLayerVisible('version_') &&
                                                <div
                                                className="content-plain content-block card"
                                                ref={this.scrollTo}>
                                                    <h4 className="inline-block">Text Versions</h4>

                                                    {uiDataStore.layers.filter(l => l.id.startsWith('version_')
                                                        && l.id !== 'version_' && l.show).map(version => {
                                                            let v = data.versions.find(x => x.id === version.id);
                                                            return <div
                                                                    key={"v_" + v.id}
                                                                    className="translation"
                                                                    ref={this.scrollTo}>
                                                                        <span className="bold gap-right">{version.label}</span>
                                                                        <HelpButton inline type={v.id}/>
                                                                        <div
                                                                        className={"gap-left " + (v.language === "deva" ? "deva-font" : "text-font")}>
                                                                            {v.form.map((line, i) => (
                                                                                <div key={"trans_" + i}>
                                                                                    {v.applyKeys ?
                                                                                        <span className="red gap-right">{String.fromCharCode(i + 97)} </span>
                                                                                        : ''
                                                                                    }
                                                                                    {line}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                    })}
                                                </div>
                                            }

                                            {uiDataStore.isLayerVisible('translation_')
                                                && data.versions.filter(v => (
                                                    v.id.startsWith('translation_') && uiDataStore.isLayerVisible(v.id))
                                                ).length > 0 &&

                                                <div
                                                className="content-plain content-block card"
                                                ref={this.scrollTo}>
                                                    <h4 className="inline-block">Translations</h4>

                                                    {uiDataStore.layers.filter(
                                                        l => l.id.startsWith('translation_')
                                                        && l.id !== 'translation_'
                                                        && uiDataStore.isLayerVisible(l.id)).map(l => {
                                                            let translation = data.versions.find(v => v.id === l.id);
                                                            return translation === undefined ? "" :
                                                            <div
                                                            key={"t_" + translation.source}
                                                            className="translation"
                                                            ref={this.scrollTo}>
                                                                <span className="bold">{translation.source} </span>({translation.language})
                                                                <HelpButton inline type={l.id} style={{marginLeft:'.5rem'}}/>
                                                                <div className="text-font gap-left">
                                                                    {translation.form.map((line, i) => (
                                                                        <div key={"trans_" + i}>{line}</div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                    })}
                                                </div>
                                            }

                                            {uiDataStore.isLayerVisible('glossing_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h4>
                                                        Morphological Glossing
                                                        <HelpButton type="zurichGlossing" inline style={{marginLeft:'.5rem'}}/>
                                                    </h4>
                                                    {data.padas.map(pada => (
                                                        <div
                                                        className="glossing-line"
                                                        key={"p_" + pada.index}>

                                                            <span key={"p_gloss_line" + pada.index} className="pada-line text-font">
                                                                {pada.id}
                                                            </span>

                                                            {pada.grammarData.map(token => (
                                                                <div
                                                                className="glossing-token text-font"
                                                                key={"t_" + token.index}>
                                                                    {token.form}
                                                                    <br/>
                                                                    <div className="glossing-annotation">
                                                                        {this.cleanLemmaString(token.lemma)}
                                                                        {
                                                                            Object.keys(token.props).map(key => (
                                                                                key !== "lemma type" && key !== "position" &&
                                                                                <span key={"t_" + token.index + "_" + key}>
                                                                                    .{token.props[key]}
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

                                            {uiDataStore.isLayerVisible('dictionaries_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h4>Dictionaries</h4>
                                                    <DictionaryView
                                                    key={'dict_' + data.id}
                                                    data={data.padas}/>
                                                </div>
                                            }

                                            {uiDataStore.isLayerVisible('metaInfo_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h4>Stanza Meta</h4>

                                                    <table style={{width:'auto'}}>
                                                        <tbody>
                                                        <tr>
                                                            <td><HelpButton inline float align="right" type="metaAdrGroup"/></td>
                                                            <td>
                                                                <span className="bold gap-right">Hymn Addressee:</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {data.hymnAddressee}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><HelpButton inline float align="right" type="metaAdrGroup"/></td>
                                                            <td>
                                                                <span className="bold gap-right">Hymn Group:</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {data.hymnGroup}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><HelpButton inline float align="right" type="metaStrata"/></td>
                                                            <td>
                                                                <span className="bold gap-right">Strata (Arnold):</span>
                                                            </td>
                                                            <td className="text-font">
                                                                {this.resolveAbbrevationToHTML(data.strata, "strata")}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><HelpButton inline float align="right" type="metaLabels"/></td>
                                                            <td>
                                                                <span className="bold gap-right">Pada Labels</span>
                                                            </td>
                                                            <td>
                                                                {data.padas.map(pada => (
                                                                    <div key={pada.index}>
                                                                        <div style={{display:"inline-block", verticalAlign:"top"}} className="bold red gap-right">{pada.id}:</div>
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
                                
                                <Col span={3}>

                                    <Affix offsetTop={10}>
                                        <div
                                        className="card red flex-center btn-aside"
                                        title="Show view selectors"
                                        onClick={() => this.setState({filtersVisible: true})}
                                        style={{
                                            cursor:'pointer',
                                            textAlign:'center',
                                            padding:'1rem .5rem',
                                            minHeight: '100px'
                                        }}>
                                            <Badge
                                            showZero
                                            style={{backgroundColor:'#931111'}}
                                            count={uiDataStore.layers.filter(l => l.id.endsWith('_') && l.show).length}>
                                                <div style={{textAlign:'center', fontSize:'20px', lineHeight: '1.2',}}>
                                                    <Icon type="eye" style={{fontSize:'24px'}}/><br/>
                                                    Select Views
                                                </div>
                                            </Badge>
                                        </div>

                                        <div
                                        className="card red flex-center btn-aside"
                                        title="Show export options"
                                        onClick={() => this.setState({exportVisible: true})}
                                        style={{
                                            cursor:'pointer',
                                            fontSize:'20px',
                                            padding:'1rem .5rem',
                                            minHeight: '100px'
                                        }}>
                                            <div style={{textAlign:'center', fontSize:'20px', lineHeight: '1.2',}}>
                                                <Icon type="export" style={{fontSize:'24px'}}/><br/>
                                                Export
                                            </div>
                                        </div>
                                    </Affix>

                                </Col>
                            </Row>
                        </div>
                    }

                    <Drawer
                    title={<h4 style={{marginBottom:'0'}}><Icon type="eye" className="gap-right"/> Select Views</h4>}
                    placement="right"
                    width="480"
                    closable={true}
                    onClose={() => this.setState({filtersVisible: false})}
                    visible={this.state.filtersVisible}
                    style={{padding:'.5rem 1.5rem'}}>

                        {/* LAYER SWITCHES */}
                        { data.versions !== undefined && uiDataStore.layers.map(l => (
                            <ContentFilterSwitch
                            key={'switch_' + l.id}
                            label={l.label}
                            size={l.id.endsWith('_') ? "default" : "small"}
                            disabled={!l.id.endsWith('_') && data.versions.find(v => v.id === l.id) === undefined}
                            checked={l.show}
                            onChange={(e) => this.filterChange(l.id, e)} />
                        )) }

                        {/* 
                        <ContentFilterSwitch
                        label="Text Versions"
                        checked={true}
                        onChange={(e) => this.filterChange("text_versions", e)} />

                        <ContentFilterSwitch
                        label="Devanagari"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.devanagari}
                        onChange={(e) => this.filterChange("devanagari", e)} />

                        <ContentFilterSwitch
                        label="Padapatha"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.padapatha}
                        onChange={(e) => this.filterChange("padapatha", e)} />

                        <ContentFilterSwitch
                        label="Sasa Patha"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.sasapatha}
                        onChange={(e) => this.filterChange("sasapatha", e)} />

                        <ContentFilterSwitch
                        label="Van Nooten, Holland"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.vnh}
                        onChange={(e) => this.filterChange("vnh", e)} />

                        <ContentFilterSwitch
                        label="Aufrecht"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.aufrecht}
                        onChange={(e) => this.filterChange("aufrecht", e)} />

                        

                        <ContentFilterSwitch
                        label="Translations"
                        disabled={uiDataStore.areTranslationsVisible()}
                        checked={uiDataStore.areTranslationsVisible()}
                        onChange={() => this.filterChange("translations_", false)} />

                        <ContentFilterSwitch
                        label="EN (Griffith)"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.griffith}
                        onChange={(e) => this.filterChange("griffith", e)} />

                        <ContentFilterSwitch
                        label="FR (Renou)"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.renou}
                        onChange={(e) => this.filterChange("renou", e)} />

                        <ContentFilterSwitch
                        label="DE (Geldner)"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.geldner}
                        onChange={(e) => this.filterChange("geldner", e)} />

                        <ContentFilterSwitch
                        label="DE (Grassmann)"
                        size="small"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.grassmann}
                        onChange={(e) => this.filterChange("grassmann", e)} />

                        
                        
                        <ContentFilterSwitch
                        label="Morphological Glossing"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.glossing}
                        onChange={(e) => this.filterChange("glossing", e)} />

                        <ContentFilterSwitch
                        label="Dictionary"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.dictionary}
                        onChange={(e) => this.filterChange("dictionary", e)} />

                        <ContentFilterSwitch
                        label="Meta Tags"
                        disabled={!isLoaded || error !== undefined}
                        checked={uiDataStore.viewFilter.metaInfo}
                        onChange={(e) => this.filterChange("metaInfo", e)} /> */}
                    </Drawer>


                    <Drawer
                    title={<h4 style={{marginBottom:'0'}}><Icon type="export" className="gap-right"/>Export</h4>}
                    placement="right"
                    width="400"
                    closable={true}
                    onClose={() => this.setState({exportVisible: false})}
                    visible={this.state.exportVisible}
                    style={{padding:'.5rem 1.5rem'}}>
                        
                        <RadioGroup
                        onChange={(e) => console.log("Export format selected: " + e.target.value)}
                        defaultValue={"PDF"}>
                            {exportOptions.map((eOpt, i) => (
                                <Radio
                                key={'eOpt_' + i}
                                value={eOpt}
                                style={{ display: 'block', height: '30px', lineHeight: '30px' }}>
                                    {eOpt}
                                </Radio>
                            ))}
                        </RadioGroup>
                    
                        <Button
                        block
                        type="primary"
                        icon="download"
                        style={{marginTop:'2rem'}}
                        onClick={() => {alert("Export functionality doesn't exist, yet.")}}>
                            Export
                        </Button>
                            
                    </Drawer>

                </div>
                
            </Spin>
        );
    }
}

export default withRouter(view(ContentView));