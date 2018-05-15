import React, { Component } from "react";
import { Row, Col, Affix, Switch, Spin, Icon } from 'antd';

import ContentLocation from "./ContentLocation";
import ErrorMessage from "./ErrorMessage";

import "./css/ContentView.css";

import Sanscript from 'sanscript';  

import { withRouter } from 'react-router-dom';

import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';

import axios from 'axios';


class ContentView extends Component {

    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        this.loadData(this.props.match.params.by, this.props.match.params.value);
    }

    componentWillReceiveProps(newProps){
        if (this.propsChanged(newProps)){
            this.loadData(newProps.match.params.by, newProps.match.params.value);
        }
    }

    propsChanged(newProps){
        return JSON.stringify(this.props) !== JSON.stringify(newProps);
    }

    loadData(by, value){
        this.setState({
            isLoaded: false,
            error: undefined
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

        return (
            <Spin
            size="large"
            indicator={<Icon type="loading" spin style={{ fontSize: 38 }}/>}
            delay={200}
            spinning={!isLoaded}>

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
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Devanagari transliteration</h4>
                                                {data.padas.map(pada => (
                                                    <div className="bottom-gap-small" key={"p_plain_" + pada.index}>
                                                        <span key={"p_plain_line" + pada.index} className="pada-line">{pada.line}</span>
                                                        <span key={"p_plain_form" + pada.index} className="pada-form">{Sanscript.t(pada.form, "iso", "devanagari")}</span><br/>
                                                    </div>
                                                ))}
                                            </div>
                                        }

                                        {appStateStore.viewFilter.grammar &&
                                            <div
                                            className="glossing content-block card"
                                            ref={this.scrollTo}>
                                                <h4>Grammatical Glossing</h4>
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
                                                                    {
                                                                        token.lemma + "." +

                                                                        (token.grammar.case === undefined ? "" :
                                                                        (token.grammar.case + ".")) +

                                                                        (token.grammar.number === undefined ? "" :
                                                                        (token.grammar.number + ".")) +

                                                                        (token.grammar.gender === undefined ? "" :
                                                                        (token.grammar.gender + "."))
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
                                                    <div key={"trans_" + translation.source}>
                                                        <span className="bold">{
                                                            translation.language.toUpperCase() === "DE" ? "German" :
                                                            translation.language.toUpperCase() === "EN" ? "English" :
                                                            translation.language.toUpperCase() === "FR" ? "French" : "?"
                                                        }</span>
                                                        <span className="first-cap"> ({translation.source})</span><br/>
                                                        <span className="italic">{translation.translation}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        }

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

                                    </div>
                                }
                            </Col>
                            
                            <Col span={6}>
                                <Affix offsetTop={10}>
                                    <div className="card-nobox">
                                        <h4>View Filters</h4>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("devanagari", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.devanagari} />
                                            Devanagari transliteration
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("grammar", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.grammar} />
                                            Grammar Glossings
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            defaultChecked
                                            onChange={(e) => this.filterChange("translations", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.translations} />
                                            Translations
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            onChange={(e) => this.filterChange("something1", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.something1} />
                                            Something
                                        </div>
                                        <div className="view-filter">
                                            <Switch
                                            onChange={(e) => this.filterChange("something2", e)}
                                            disabled={!isLoaded || error !== undefined}
                                            checked={appStateStore.viewFilter.something2} />
                                            Something else
                                        </div>
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