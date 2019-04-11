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

import GuidedTour from './GuidedTour';

import "./css/App.css";

import stateStore from "./stores/stateStore";
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
            error: undefined,
            tour: false
        }

        //configure iso scheme for sanscript.js
        let iso = JSON.parse(JSON.stringify(Sanscript.schemes.iast));
        iso.vowels = 'a ā i ī u ū r̥ r̥̄ l̥ l̥̄ ē e ai ō o au'.split(' ');
        iso.consonants = 'k kh g gh ṅ c ch j jh ñ ṭ ṭh ḍ ḍh ṇ t th d dh n p ph b bh m y r l v ś ṣ s h ḷ kṣ jñ'.split(' ');
        iso.other_marks = ['ṁ', 'ḥ', '~'];
        Sanscript.addRomanScheme('iso', iso);

        //set global default spinner indicator
        Spin.setDefaultIndicator(<Icon type="loading" spin style={{ fontSize: 38 }}/>);

        //load ui data
        this.loadUiData();
    }

    componentCleanup(){
        stateStore.save(stateStore);
    }

    componentDidMount(){
        stateStore.load(stateStore);
        window.addEventListener('beforeunload', this.componentCleanup);
    }
  
    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }


    loadUiData(){
        axios.get(process.env.PUBLIC_URL + "/api/uidata")
        .then((response) => {
            stateStore.ui.search = response.data.search;
            stateStore.ui.meta = response.data.meta;
            stateStore.ui.abbreviations = response.data.abbreviations;
            stateStore.ui.layers = response.data.layers;
            //stateStore.search.meta.scopeDataRaw = stateStore.ui.search.meta.scopes;
            //stateStore.settings.transliteration = stateStore.ui.search.meta.transliterations[0].id;
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

                    <GuidedTour
                    enabled={stateStore.settings.tour}
                    onCloseTour={() => stateStore.settings.tour = false}/>

                </div>

        );
    }
}

export default withRouter(view(App));