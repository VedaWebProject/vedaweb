import React, { Component } from "react";
import { Grid, Icon } from 'semantic-ui-react';

import SearchField from "./SearchField";


class SearchBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchFields: []
        };

        this.removeField = this.removeField.bind(this);
    }

    addField(){
        this.setState({
            searchFields : this.state.searchFields.concat(<SearchField onClickRemove={(f) => this.removeField(f)} />)
        });
    }

    removeField(toRemove){
        this.setState({
            searchFields: this.state.searchFields.filter(field => field !== toRemove)
        });
    }

    render() {
        return (
            
            <Grid>
                
                {this.state.searchFields}

                <Grid.Row>
                    <Grid.Column width="8" textAlign="center" verticalAlign="middle">
                        <Icon name="add circle" size="big" onClick={this.addField.bind(this)} link/>
                    </Grid.Column>
                </Grid.Row>

            </Grid>

        );
    }
}

export default SearchBlock;