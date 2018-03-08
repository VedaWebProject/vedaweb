import React, { Component } from "react";

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./css/App.css";

import UIData from './ui-data.js'; //DEV: load from server!

import searchTransliterationStore from "./stores/searchTransliterationStore";
import searchAdvancedStore from "./stores/searchAdvancedStore";
import searchScopeStore from "./stores/searchScopeStore";

class App extends Component {

    constructor(props){
        super(props);

        searchTransliterationStore.setTransliterationOptions(UIData.search.transliteration); //DEV: load from server!
        searchAdvancedStore.setGrammarOptions(UIData.search.grammar); //DEV: load from server!
        searchScopeStore.setScopeOptions(UIData.search.books); //DEV: load from server!

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