import React, { Component } from "react";
import { Grid, Button, Icon } from 'semantic-ui-react';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'


class SearchView extends Component {

    constructor(props){
        super(props);

        this.state = {
            isVisible: false
        };

        this.hide = this.show.bind(this);
    }

    show(show){
        
    }

    render() {
        return (
            
            <Grid.Row id="search-view">
                <Grid.Column width="8">

                </Grid.Column>

                <Grid.Column width="8">
                    <SearchBlockList/>
                </Grid.Column>
            </Grid.Row>

        );
    }
}

export default SearchView;