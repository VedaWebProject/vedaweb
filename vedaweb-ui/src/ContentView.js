import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';

import "./ContentView.css";


class ContentView extends Component {

    render() {
        return (
            
            <Grid id="content" padded>
                <Grid.Row>
                    <Grid.Column width="8">
                        bla
                    </Grid.Column>

                    <Grid.Column width="8">
                        bla
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        );
    }
}

export default ContentView;