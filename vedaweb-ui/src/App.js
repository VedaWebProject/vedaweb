import React, { Component } from "react";

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./App.css";

class App extends Component {
    render() {
        return (
            <div>
                <NavBar/>
                <SearchView/>
                <ContentView/>
                <Footer/>
            </div>
        );
    }
}

export default App;