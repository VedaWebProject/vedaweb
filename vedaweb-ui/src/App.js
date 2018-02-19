import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./App.css";

class App extends Component {
    render() {
        return (
            <Grid padded>
                <NavBar/>
                <SearchView/>
                <ContentView/>
                <Footer/>
            </Grid>
        );
    }
}

export default App;