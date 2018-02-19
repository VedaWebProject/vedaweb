import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';

import NavBar from './NavBar';
import SearchView from './SearchView';
import ContentView from './ContentView';
import Footer from './Footer';

import "./App.css";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchViewActive: false
        };

        this.toggleSearchView = this.toggleSearchView.bind(this);
    }

    toggleSearchView() {
        this.setState({
            searchViewActive: !this.state.searchViewActive
        });
    }

    render() {

        return (
            <Grid padded>
                <NavBar onToggleSearchView={this.toggleSearchView} />
                <SearchView isVisible={this.state.searchViewActive}/>
                <ContentView/>
                <Footer/>
            </Grid>
        );
    }
}

export default App;