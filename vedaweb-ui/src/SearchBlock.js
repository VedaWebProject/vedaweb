import React, { Component } from "react";
import { Grid, Icon } from 'semantic-ui-react';

import SearchField from "./SearchField";


class SearchBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchFields: []
        };

        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
    }

    componentDidMount(){
        this.addField();
    }

    addField(){
        var fid = Date.now();
        this.setState({
            searchFields : this.state.searchFields.concat({'fieldId': fid})
        });
    }

    removeField(f){
        this.setState({
            searchFields: this.state.searchFields.filter(field => field.fieldId !== f.props.fieldId)
        });
    }

    render() {
        return (
            
            <Grid>
                
                {this.state.searchFields.map(field => (
                    <SearchField
                        fieldId={field.fieldId}
                        key={field.fieldId}
                        onClick={this.removeField}
                        removable={this.state.searchFields.length > 1} />
                ))}

                <Grid.Row>
                    <Grid.Column width="8" verticalAlign="middle">
                        <Icon name="plus" size="large" onClick={this.addField} link/>
                    </Grid.Column>
                </Grid.Row>

            </Grid>

        );
    }
}

export default SearchBlock;