import React, { Component } from "react";

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./css/App.css";
import UIData from './ui-data.js';

class App extends Component {

    constructor(props){
        super(props);

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
                <SearchView visible={searchViewActive} onClose={this.closeSearchView} uiData={UIData.search} />
            </div>
        );
    }
}

export default App;