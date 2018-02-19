import React, { Component } from "react";
import { Grid, Dropdown, Button, Icon } from 'semantic-ui-react';

import './SearchField.css'

class SearchField extends Component {

    /**
     * STATE:
     * fieldName = field
     * fieldValue = value
     */

    constructor(props){
        super(props);

        //TODO: change defaults
        this.state = {
            fieldName: null,
            fieldValue: null,
            fieldNameOptions: [{ text: 'Case', value: 'casus' },{ text: 'Mode', value: 'modus' }],
            fieldValueOptions: [],
            isLoaded: true
        };

        this.onRemove = this.onRemove.bind(this);
    }

    onChangeFieldName(value){

        this.setState({
            isLoaded: false,
            fieldName: value.value
        });
        
        fetch("/data/grammar/" + value.value)
        .then(res => res.json())
        .then(
            (result) => {

            var valueOptions = result.values.map(function(val) {
                return {
                    text: val,
                    value: val
                };
            });

            this.setState({
                isLoaded: true,
                fieldValueOptions: valueOptions
            });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
            this.setState({
                isLoaded: true,
                error
            });
            }
        )
    }

    onRemove(e){
        this.props.onClickRemove(this);
    }

    render() {

        return (
            
            <Grid.Row>

                <Grid.Column width="1" textAlign="left" verticalAlign="middle" className="block-number">
                    { this.props.isFirstField &&
                        <Icon name='list layout' />
                    }
                </Grid.Column>

                <Grid.Column width="6">
                    <Dropdown
                        placeholder='Attribute...'
                        options={this.state.fieldNameOptions}
                        onChange={(e,{value})=>this.onChangeFieldName({value})}
                        selection
                        fluid
                        search />
                </Grid.Column>

                <Grid.Column width="6">
                    <Dropdown
                        placeholder='Value...'
                        options={this.state.fieldValueOptions}
                        onChange={(e,{value})=>this.setState({fieldValue: value})}
                        selection
                        fluid
                        search
                        disabled = {this.state.fieldValueOptions.length === 0}
                        loading = {!this.state.isLoaded} />
                </Grid.Column>

                <Grid.Column width="3" textAlign="left" verticalAlign="middle">

                    <Button
                    disabled={!this.props.isRemovable}
                    onClick={this.onRemove}
                    basic
                    compact
                    circular
                    icon >
                        <Icon name='minus'/>
                    </Button>

                    <Button
                    onClick={this.props.onClickAdd}
                    disabled={!this.props.isLastField}
                    basic
                    compact
                    circular
                    icon >
                        <Icon name='plus' />
                    </Button>

                </Grid.Column>

            </Grid.Row>

        );
    }
}

//onChange={(e,{value})=>this.setState({fieldName: value})}

export default SearchField;