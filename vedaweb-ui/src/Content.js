import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';

import SearchBlock from "./SearchBlock";

import "./Content.css";


class Content extends Component {

    render() {
        return (
            
            <Grid id="content" padded>
                <Grid.Row>
                    <Grid.Column width="6">
                        <SearchBlock/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        );
    }
}

export default Content;