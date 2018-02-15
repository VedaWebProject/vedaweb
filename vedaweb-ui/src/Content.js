import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';

import SearchBlockList from "./SearchBlockList";

import "./Content.css";


class Content extends Component {

    render() {
        return (
            
            <Grid id="content" padded>
                <Grid.Row>
                    <Grid.Column width="8">
                        <SearchBlockList/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        );
    }
}

export default Content;