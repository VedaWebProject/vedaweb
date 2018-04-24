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

import appStateStore from "./stores/appStateStore";
import searchSimpleStore from "./stores/searchSimpleStore";
import searchAdvancedStore from "./stores/searchAdvancedStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom'


class App extends Component {

    constructor(props){
        super(props);

        searchSimpleStore.setFieldsData(UIData.search.textSearch.fields);  //DEV: load from server!
        searchAdvancedStore.setGrammarOptions(UIData.search.grammar); //DEV: load from server!
        searchMetaStore.setScopeData(UIData.search.books); //DEV: load from server!
        searchMetaStore.setTransliterationData(UIData.search.transliteration); //DEV: load from server!
    }

    
    render() {

        const searchViewActive = appStateStore.searchViewActive;

        return (
                <div id="app" className={ searchViewActive ? "blurred" : "" }>

                    <NavBar onClickOpenSearchView={() => appStateStore.openSearchView(true)} />

                    <Switch>
                        <Route path="/view/:by/:value" component={ContentView} />
                        <Route path="/" exact={true} component={Start} />
                        <Route component={NotFound} />
                    </Switch>

                    <Footer/>

                    <SearchView
                    visible={searchViewActive}
                    onClose={() => appStateStore.openSearchView(false)} />

                    <BackTop />

                </div>
        );
    }
}

export default withRouter(view(App));