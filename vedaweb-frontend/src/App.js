import React, { Component } from "react";
import { BackTop, Spin, Icon } from 'antd';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Start from './Start';
import NotFound from './NotFound';
import Footer from './Footer';

import "./css/App.css";

import uiDataStore from "./stores/uiDataStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import { Route, Switch, withRouter } from 'react-router-dom'
import SearchResults from "./SearchResults";

import Sanscript from 'sanscript';
import axios from 'axios';


class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false
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
            searchMetaStore.scopeDataRaw = uiDataStore.search.meta.scopes;
            this.setState({
                isLoaded: true
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

        return (

                <div id="app">

                    { !isLoaded &&
                        <Spin
                        size="large"
                        spinning={!isLoaded}
                        className="spinner-loading"/>
                    }

                    { isLoaded && error !== undefined &&
                        <h4>There was an error loading the application data.</h4>
                    }

                    { isLoaded && error === undefined &&
                        <div>
                            <NavBar />
                            <Switch>
                                <Route path="/view/:by/:value" component={ContentView} />
                                <Route path="/results/:querydata" component={SearchResults} />
                                <Route path="/search" component={SearchView} />
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