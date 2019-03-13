import React, { Component } from "react";
import { BackTop, Spin, Icon } from 'antd';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import BetaInfo from './BetaInfo';
import NotFound from './NotFound';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import System from './System';
import LegalNotice from './LegalNotice';
import PrivacyNotice from './PrivacyNotice';

import "./css/App.css";

import uiDataStore from "./stores/uiDataStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom';
import SearchResults from "./SearchResults";

import Sanscript from 'sanscript';
import axios from 'axios';

import "./polyfills";


class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false,
            error: undefined
        }

        //configure iso scheme for sanscript.js
        let iso = JSON.parse(JSON.stringify(Sanscript.schemes.iast));
        iso.vowels = 'a ā i ī u ū r̥ r̥̄ l̥ l̥̄ ē e ai ō o au'.split(' ');
        iso.other_marks = ['ṁ', 'ḥ', '~'];
        Sanscript.addRomanScheme('iso', iso);

        //set global default spinner indicator
        Spin.setDefaultIndicator(<Icon type="loading" spin style={{ fontSize: 38 }}/>);

        //load ui data
        this.loadUiData();
    }


    loadUiData(){
        axios.get(process.env.PUBLIC_URL + "/api/uidata")
        .then((response) => {
            uiDataStore.search = response.data.search;
            uiDataStore.meta = response.data.meta;
            uiDataStore.abbreviations = response.data.abbreviations;
            uiDataStore.layers = response.data.layers;
            searchMetaStore.scopeDataRaw = uiDataStore.search.meta.scopes;
            searchMetaStore.transliteration = uiDataStore.search.meta.transliterations[0].id;
            this.setState({
                isLoaded: true,
                error: undefined
            });
        })
        .catch((error) => {
            this.setState({
                isLoaded: true,
                error: error
            });
        });
    }

    
    render() {

        const { error, isLoaded } = this.state;

        if (isLoaded && error !== undefined)
            console.log(JSON.stringify(error));

        return (
                
                <div id="app">

                    { !isLoaded &&
                        <Spin
                        size="large"
                        spinning={!isLoaded}
                        className="spinner-loading"/>
                    }

                    {/* ERROR MESSAGE: FRONTEND UI DATA COULD NOT BE LOADED */}
                    { isLoaded && error !== undefined &&
                        <div className="error-msg">
                            <Icon type="frown-o" className="gap-right"/>
                            There was an error loading the application data. 
                            This could be due to a temporary server problem.
                        </div>
                    }

                    { isLoaded && error === undefined &&
                        <ErrorBoundary>
                            <NavBar />
                            <Switch>
                                <Route path="/view/:by/:value" component={ContentView} />
                                <Route path="/view" component={ContentView} />
                                <Route path="/results/:querydata" component={SearchResults} />
                                <Route path="/search" component={SearchView} />
                                <Route path="/system/:auth" component={System} />
                                <Route path="/legal" component={LegalNotice} />
                                <Route path="/privacy" component={PrivacyNotice} />
                                <Route path="/betafeedback" component={BetaInfo} />
                                <Route path="/home" component={ContentView} />
                                <Route path="/" exact={true} component={ContentView} />
                                <Route component={NotFound} />
                            </Switch>
                            <Footer/>
                            <BackTop />
                        </ErrorBoundary>
                    }

                </div>

        );
    }
}

export default withRouter(view(App));