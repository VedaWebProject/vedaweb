import React, { Component } from "react";
import { Grid, Dimmer } from 'semantic-ui-react';

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

        this.openSearchView = this.openSearchView.bind(this);
        this.closeSearchView = this.closeSearchView.bind(this);
    }

    openSearchView(){
        this.setState({ searchViewActive: true });
    }

    closeSearchView(){
        this.setState({ searchViewActive: false });
    }

    render() {

        return (
            <Dimmer.Dimmable blurring dimmed={this.state.searchViewActive}>

                <Dimmer
                active={this.state.searchViewActive}
                onClickOutside={this.closeSearchView}
                page inverted>
                    <SearchView/>
                </Dimmer>

                <Grid padded>
                    <NavBar onOpenSearchViewClick={this.openSearchView} />
                    <ContentView/>
                    <Footer/>
                </Grid>
            </Dimmer.Dimmable>
        );
    }
}

export default App;