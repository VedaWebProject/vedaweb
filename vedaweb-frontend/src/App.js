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

import uiDataStore from "./stores/uiDataStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom'
import SearchResults from "./SearchResults";

import Sanscript from 'sanscript';


class App extends Component {

    constructor(props){
        super(props);

        uiDataStore.search = UIData.search;  //DEV: load from server!
        searchMetaStore.setScopeData(uiDataStore.search.meta.scopes);

        //TEMP DEV: configure iso scheme for sanscript.js
        let iso = JSON.parse(JSON.stringify(Sanscript.schemes.iast));
        iso.vowels = 'a ā i ī u ū r̥ r̥̄ l̥ l̥̄ ē e ai ō o au'.split(' ');
        iso.other_marks = ['ṁ', 'ḥ', '~'];
        Sanscript.addRomanScheme('iso', iso);
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