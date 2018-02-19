import React, { Component } from "react";
import { Grid, Transition } from 'semantic-ui-react';

import SearchBlockList from "./SearchBlockList";

import './SearchView.css'


class SearchView extends Component {

    render() {
        return (

            <Transition
                visible={this.props.isVisible}
                animation='slide down'
                duration={500}
                unmountOnHide >
            
                <Grid.Row id="search-view">

                    <Grid.Column width="12">
                        <SearchBlockList/>
                    </Grid.Column>

                    <Grid.Column width="4">
                        SEARCH META
                    </Grid.Column>

                </Grid.Row>

            </Transition>

        );
    }
}

export default SearchView;