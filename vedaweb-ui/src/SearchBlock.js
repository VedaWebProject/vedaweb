import React, { Component } from "react";
import { Grid, Button, Icon } from 'semantic-ui-react';

import SearchField from "./SearchField";

import './SearchBlock.css'


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

                <Grid className="search-block">
                    
                    {this.state.searchFields.map((field, i) => (
                        <SearchField
                        fieldId={field.fieldId}
                        key={field.fieldId}
                        isFirstField={i === 0}
                        onClickRemove={this.removeField}
                        onClickAdd={this.addField}
                        isRemovable={this.state.searchFields.length > 1}
                        isLastField={this.state.searchFields.length < 4 && this.state.searchFields.length === i + 1} />
                    ))}

                </Grid>
            
        );
    }
}

export default SearchBlock;