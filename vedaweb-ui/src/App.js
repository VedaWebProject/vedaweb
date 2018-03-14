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
import { view } from 'react-easy-state';


class App extends Component {

    constructor(props){
        super(props);

        searchSimpleStore.setFieldsData(UIData.search.textSearch.fields);  //DEV: load from server!
        searchAdvancedStore.setGrammarOptions(UIData.search.grammar); //DEV: load from server!
        searchMetaStore.setScopeData(UIData.search.books); //DEV: load from server!
        searchMetaStore.setTransliterationData(UIData.search.transliteration); //DEV: load from server!
    }

    
    render() {

        const searchViewActive = searchMetaStore.searchViewActive;

        return (

            <div id="app" className={ searchViewActive ? "blurred" : "" }>

                <NavBar onClickOpenSearchView={() => searchMetaStore.openSearchView(true)} />

                <ContentView/>

                <Footer/>

                <SearchView
                visible={searchViewActive}
                onClose={() => searchMetaStore.openSearchView(false)} />

            </div>

        );
    }
}

export default view(App);