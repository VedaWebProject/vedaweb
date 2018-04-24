import React, { Component } from "react";
import { Row, Col, Affix, Switch, Icon } from 'antd';
import Spinner from "./Spinner";

import "./css/ContentView.css";

import { Link, withRouter } from 'react-router-dom';

import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

import scrollToComponent from 'react-scroll-to-component';


class ContentView extends Component {

    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        console.log("componentDidMount: " + JSON.stringify(this.props));
        this.loadData(this.props.match.params.by, this.props.match.params.value);
    }

    componentWillReceiveProps(newProps){
        console.log("componentWillReceiveProps: " + JSON.stringify(newProps));
        this.loadData(newProps.match.params.by, newProps.match.params.value);
    }

    loadData(by, value){
        this.setState({
            isLoaded: false
        });

        setTimeout((function() {
            fetch("/api/document/" + by + "/" + value)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
        }).bind(this), 500);
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
            <Row
            id="content-view"
            className="page-content"
            type="flex"
            justify="center">

                <Col span={16} className="content">
                    {/** LOADING SPINNER **/}
                    {!isLoaded &&
                        <Spinner/>
                    }

                    {/** CONTENT **/}
                    {isLoaded && !error &&
                        <div className="card">

                            <div className="content-plain content-block">
                                <div className="location">
                                    <Link to={"/view/index/" + (data.index - 1)} className="location-controls">
                                        <Icon type="left"/>
                                    </Link>
                                    <span className="location-display">
                                    {
                                        (data.book + "").padStart(2, "0") + " . " +
                                        (data.hymn + "").padStart(3, "0") + " . " +
                                        (data.verse + "").padStart(2, "0")
                                    }
                                    </span>
                                    <Link to={"/view/index/" + (data.index + 1)} className="location-controls">
                                        <Icon type="right"/>
                                    </Link>
                                </div>
                                {data.padas.map(pada => (
                                    <span key={"p_plain_" + pada.index}>{pada.form}<br/></span>
                                ))}
                            </div>

                            {appStateStore.viewFilter.grammar &&
                                <div
                                className="glossing content-block"
                                ref={this.scrollTo}>
                                    <h4>Grammatical Glossing</h4>
                                    {data.padas.map(pada => (
                                        <div
                                        className="glossing-line"
                                        key={"p_" + pada.index}>

                                            {pada.tokens.map(token => (
                                                <div
                                                className="glossing-token"
                                                key={"t_" + token.index}>
                                                    {token.form}
                                                    <br/>
                                                    <div className="glossing-annotation">
                                                        {token.lemma}
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ))}
                                </div>
                            }

                            {appStateStore.viewFilter.translations &&
                                <div
                                className="content-block"
                                ref={this.scrollTo}>
                                    <h4>Translations</h4>
                                    {data.translations.map(translation => (
                                        <div key={"trans_" + translation.source}>
                                            <span className="bold">{translation.language.toUpperCase()}</span>
                                            <span className="first-cap"> ({translation.source})</span><br/>
                                            <span className="italic">{translation.translation}</span>
                                        </div>
                                    ))}
                                </div>
                            }

                        </div>
                    }
                </Col>
                
                <Col lg={6} md={8}>
                    <Affix offsetTop={10}>
                        <div className="card-nobox">
                            <h4>View Filters</h4>
                            <div className="view-filter">
                                <Switch
                                defaultChecked
                                onChange={(e) => this.filterChange("grammar", e)}
                                disabled={!isLoaded}
                                checked={appStateStore.viewFilter.grammar} />
                                Grammar Glossings
                            </div>
                            <div className="view-filter">
                                <Switch
                                defaultChecked
                                onChange={(e) => this.filterChange("translations", e)}
                                disabled={!isLoaded}
                                checked={appStateStore.viewFilter.translations} />
                                Translations
                            </div>
                            <div className="view-filter">
                                <Switch disabled={!isLoaded} />
                                Something
                            </div>
                            <div className="view-filter">
                                <Switch disabled={!isLoaded} />
                                Something else
                            </div>
                        </div>
                    </Affix>
                </Col>
                
            </Row>
            
        );
    }
}

export default withRouter(view(ContentView));