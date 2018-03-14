import React, { Component } from "react";

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./css/App.css";

import UIData from './ui-data.js'; //DEV: load from server!

import searchSimpleStore from "./stores/searchSimpleStore";
import searchAdvancedStore from "./stores/searchAdvancedStore";
import searchMetaStore from "./stores/searchMetaStore";

class App extends Component {

    constructor(props){
        super(props);

        searchSimpleStore.setFieldsData(UIData.search.textSearch.fields);  //DEV: load from server!
        searchAdvancedStore.setGrammarOptions(UIData.search.grammar); //DEV: load from server!
        searchMetaStore.setScopeData(UIData.search.books); //DEV: load from server!
        searchMetaStore.setTransliterationData(UIData.search.transliteration); //DEV: load from server!

        this.state = {
            searchViewActive: false
        };

        this.openSearchView = this.openSearchView.bind(this);
        this.closeSearchView = this.closeSearchView.bind(this);
    }

    openSearchView(){
        this.setState({ searchViewActive: true});
    }

    closeSearchView(){
        this.setState({ searchViewActive: false});
    }

    render() {

        const { searchViewActive } = this.state;

        return (

            <div id="app" className={ searchViewActive ? "blurred" : "" }>
                <NavBar onClickOpenSearchView={this.openSearchView} />
                <ContentView/>
                <Footer/>
                <SearchView visible={searchViewActive} onClose={this.closeSearchView} />
            </div>

        );
    }
}

export default App;