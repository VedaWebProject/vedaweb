import React, { Component } from "react";
import { BackTop, Spin, Icon } from 'antd';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Start from './Start';
import NotFound from './NotFound';
import Footer from './Footer';
import System from './System';

import "./css/App.css";

import uiDataStore from "./stores/uiDataStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom';
import SearchResults from "./SearchResults";

import Sanscript from 'sanscript';
import axios from 'axios';

import "./polyfills";
import Browserizr from 'browserizr'


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
        axios.get("/api/uidata")
        .then((response) => {
            uiDataStore.search = response.data.search;
            uiDataStore.meta = response.data.meta;
            uiDataStore.abbreviations = response.data.abbreviations;
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

        //alert if IE
        if (Browserizr.is_ie) {
            alert("We suspect you are using Internet Explorer as your web browser.\nUnfortunately, VedaWeb only works with modern web browsers. We recommend you to use Firefox, Chrome or something similar instead.");
        }

        //alert if mobile browser
        if (Browserizr.is_mobile) {
            alert("We suspect you are using a mobile device.\nUnfortunately, VedaWeb is not designed to work well on mobile devices. You may try to use a desktop browser instead.");
        }

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
                        <div>
                            <NavBar />
                            <Switch>
                                <Route path="/view/:by/:value" component={ContentView} />
                                <Route path="/results/:querydata" component={SearchResults} />
                                <Route path="/search" component={SearchView} />
                                <Route path="/system/:auth" component={System} />
                                <Route path="/home" component={Start} />
                                <Route path="/" exact={true} component={Start} />
                                <Route component={NotFound} />
                            </Switch>
                            <Footer/>
                            <BackTop />
                        </div>
                    }

                </div>

        );
    }
}

export default withRouter(view(App));