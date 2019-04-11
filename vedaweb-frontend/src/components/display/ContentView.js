import React, { Component } from "react";
import { Row, Col, Affix, Spin, Button, Icon, Drawer, Badge, Radio, Modal } from 'antd';

import ContentLocation from "./ContentLocation";
import ContentFilterSwitch from "./ContentFilterSwitch";
import ErrorMessage from "../errors/ErrorMessage";


import "./ContentView.css";

import { withRouter } from 'react-router-dom';

import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';
//import layersInfoImg from "./img/layersInfo.png";

import axios from 'axios';
import stateStore from "../../state/stateStore";
import DictionaryView from "./DictionaryView";
import HelpButton from "../widgets/HelpButton";
import BetaInfoContent from "../static/BetaInfoContent";

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
            this.props.history.replace("/view/index/0");
        } else {
            this.loadData(this.props.match.params.by, this.props.match.params.value);
        }
        window.scrollTo(0, 0);
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
                        ? "Stanza " + response.data.book + "." + response.data.hymn + "." + response.data.stanza
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
        if (show) stateStore.ui.viewScrollTo = true;
        stateStore.ui.toggleLayer(target, show);
    }

    scrollTo(component){
        if (stateStore.ui.viewScrollTo){
            scrollToComponent(component, {align:'middle'});
            stateStore.ui.viewScrollTo = false;
        }
    }

    resolveAbbrevationToHTML(abb, cat){
        return abb.split('').map((key, i) => (
            <span key={"abb_" + i}>
                <span className="bold secondary-font">{key}</span>
                <span> - {stateStore.ui.abbreviations[cat][key]}</span><br/>
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

    capitalize(string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                                                stanza={data.stanza}
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

                                            {stateStore.ui.isLayerVisible('version_') &&
                                                <div
                                                className="content-plain content-block card"
                                                ref={this.scrollTo}>
                                                    <h1 className="inline-block">Text Versions</h1>

                                                    {stateStore.ui.layers.filter(l => l.id.startsWith('version_')
                                                        && l.id !== 'version_' && l.show).map(version => {
                                                            let v = data.versions.find(x => x.id === version.id);
                                                            return v === undefined ? "" :
                                                                <div
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

                                            {stateStore.ui.isLayerVisible('translation_')
                                                && data.versions.filter(v => (
                                                    v.id.startsWith('translation_') && stateStore.ui.isLayerVisible(v.id))
                                                ).length > 0 &&

                                                <div
                                                className="content-plain content-block card"
                                                ref={this.scrollTo}>
                                                    <h1 className="inline-block">Translations</h1>

                                                    {stateStore.ui.layers.filter(
                                                        l => l.id.startsWith('translation_')
                                                        && l.id !== 'translation_'
                                                        && stateStore.ui.isLayerVisible(l.id)).map(l => {
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

                                            {stateStore.ui.isLayerVisible('glossing_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h1>
                                                        Morphological Glossing
                                                        <HelpButton type="zurichGlossing" inline style={{marginLeft:'.5rem'}}/>
                                                    </h1>
                                                    {data.padas.map(pada => (
                                                        <div
                                                        className="glossing-line"
                                                        key={"p_" + pada.index}>

                                                            <span key={"p_gloss_line" + pada.index} className="pada-line text-font">
                                                                {pada.id}
                                                            </span>

                                                            {pada.grammarData.map(token => (
                                                                <div
                                                                className="glossing-token"
                                                                key={"t_" + token.index}>
                                                                    <span className="text-font-i">{token.form}</span>
                                                                    <br/>
                                                                    <div className="glossing-annotation text-font">
                                                                        {this.cleanLemmaString(token.lemma)}
                                                                        {
                                                                            stateStore.ui.search.grammar.tagsOrder
                                                                                .filter(tag => token.props[tag] !== undefined)
                                                                                .map(tag => (
                                                                                    tag !== "lemma type" && tag !== "position" &&
                                                                                    <span key={"t_" + token.index + "_" + tag} className="glossing-annotation-tags">
                                                                                        .{this.capitalize(token.props[tag])}
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

                                            {stateStore.ui.isLayerVisible('dictionaries_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h1>Dictionaries</h1>
                                                    <DictionaryView
                                                    key={'dict_' + data.id}
                                                    data={data.padas}/>
                                                </div>
                                            }

                                            {stateStore.ui.isLayerVisible('metaInfo_') &&
                                                <div
                                                className="glossing content-block card"
                                                ref={this.scrollTo}>
                                                    <h1>Stanza Meta</h1>

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
                                                                <span
                                                                className="bold gap-right"
                                                                title="Arnold, Edward Vernon. 'Sketch of the Historical Grammar of the Rig and Atharva Vedas'.
                                                                Journal of the American Oriental Society 18 (1897): 203–352.">
                                                                    Strata (Arnold):
                                                                </span>
                                                            </td>
                                                            <td className="text-font">
                                                                {this.resolveAbbrevationToHTML(data.strata, "strata")}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><HelpButton inline float align="right" type="metaLabels"/></td>
                                                            <td>
                                                                <span
                                                                title="provided by D. Gunkel and K. Ryan"
                                                                className="bold gap-right">
                                                                    Pada Labels
                                                                </span>
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
                                        data-tour-id="toggle-content"
                                        style={{
                                            cursor:'pointer',
                                            textAlign:'center',
                                            padding:'1rem .5rem',
                                            minHeight: '100px'
                                        }}>
                                            <Badge
                                            showZero
                                            style={{backgroundColor:'#931111'}}
                                            count={stateStore.ui.layers.filter(l => l.id.endsWith('_') && l.show).length}>
                                                <div style={{textAlign:'center', fontSize:'20px', lineHeight: '1.2',}}>
                                                    <Icon type="eye" style={{fontSize:'24px'}}/><br/>
                                                    Toggle Content
                                                </div>
                                            </Badge>
                                        </div>

                                        <div
                                        className="card red flex-center btn-aside"
                                        title="Show export options"
                                        onClick={() => this.setState({exportVisible: true})}
                                        data-tour-id="toggle-export"
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
                    title={<h1 style={{marginBottom:'0'}}><Icon type="eye" className="gap-right"/> Toggle Content</h1>}
                    placement="right"
                    width="auto"
                    closable={true}
                    onClose={() => this.setState({filtersVisible: false})}
                    visible={this.state.filtersVisible} >

                        {/* LAYER SWITCHES */}
                        { data.versions !== undefined && stateStore.ui.layers.map(l => (
                            <ContentFilterSwitch
                            key={'switch_' + l.id}
                            label={l.label}
                            size={l.id.endsWith('_') ? "default" : "small"}
                            disabled={!l.id.endsWith('_') && data.versions.find(v => v.id === l.id) === undefined}
                            checked={l.show}
                            onChange={(e) => this.filterChange(l.id, e)} />
                        )) }

                    </Drawer>


                    <Drawer
                    title={<h1 style={{marginBottom:'0'}}><Icon type="export" className="gap-right"/>Export</h1>}
                    placement="right"
                    width="auto"
                    closable={true}
                    onClose={() => this.setState({exportVisible: false})}
                    visible={this.state.exportVisible} >
                        
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

                {/** BETA INFO MODAL */}
                <Modal
                visible={stateStore.settings.firstVisit}
                title={null}
                centered
                maskClosable={true}
                onCancel={() => stateStore.settings.firstVisit = false}
                onOk={() => stateStore.settings.firstVisit = false}
                footer={null}>
                    <BetaInfoContent/>
                </Modal>

            </Spin>
        );
    }
}

export default withRouter(view(ContentView));