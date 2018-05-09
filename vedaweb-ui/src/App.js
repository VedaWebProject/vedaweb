import React, { Component } from "react";
import { BackTop } from 'antd';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Start from './Start';
import NotFound from './NotFound';
import Footer from './Footer';

import "./css/App.css";

import UIData from './ui-data.js'; //DEV: load from server!

import searchSimpleStore from "./stores/searchSimpleStore";
import searchGrammarStore from "./stores/searchGrammarStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom'
import SearchResults from "./SearchResults";


class App extends Component {

    constructor(props){
        super(props);

        searchSimpleStore.setFieldsData(UIData.search.textSearch.fields);  //DEV: load from server!
        searchGrammarStore.setGrammarOptions(UIData.search.grammar); //DEV: load from server!
        searchMetaStore.setScopeData(UIData.search.books); //DEV: load from server!
        searchMetaStore.setTransliterationData(UIData.search.transliteration); //DEV: load from server!
    }

    
    render() {

        return (
                <div id="app">

                    <NavBar />

                    <Switch>
                        <Route path="/view/:by/:value" component={ContentView} />
                        <Route path="/results/:querydata" component={SearchResults} />
                        <Route path="/search" component={SearchView} />
                        <Route path="/" exact={true} component={Start} />
                        <Route component={NotFound} />
                    </Switch>

                    <Footer/>

                    <BackTop />

                </div>
        );
    }
}

export default withRouter(view(App));