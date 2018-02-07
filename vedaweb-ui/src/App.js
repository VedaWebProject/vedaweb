import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';
import NavBar from './NavBar';
import Footer from './Footer';
import "./App.css";

class App extends Component {
    render() {
        return (
            <Grid id="app" stackable padded>
                <NavBar/>
                <Footer/>
            </Grid>
        );
    }
}

export default App;