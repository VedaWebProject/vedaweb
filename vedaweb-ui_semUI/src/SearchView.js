import React, { Component } from "react";
import { Grid, Container, Transition } from 'semantic-ui-react';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'


class SearchView extends Component {

    render() {
        return (

            <Container text id="search-view">
                <Grid padded>

                    <Grid.Column width="16">
                        <SearchBlockList/>
                    </Grid.Column>

                    <Grid.Column width="16">
                        SEARCH METAH
                    </Grid.Column>

                </Grid>
            </Container>

        );
    }
}

export default SearchView;