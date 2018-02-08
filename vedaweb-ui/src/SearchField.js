import React, { Component } from "react";
import { Grid, Dropdown, Icon } from 'semantic-ui-react';

import './SearchBlock.css'

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
            fieldValue: null
        };

        this.onRemove = this.onRemove.bind(this);
    }

    onRemove(e){
        this.props.onClick(this);
    }

    render() {
        var options = [{ text: 'Case', value: 'case' },{ text: 'Mode', value: 'mode' }];

        return (
            
            <Grid.Row>

                <Grid.Column width="7">
                    <Dropdown
                        placeholder='Select attribute...'
                        options={options}
                        onChange={(e,{value})=>this.setState({fieldName: value})}
                        selection
                        fluid
                        search />
                </Grid.Column>

                <Grid.Column width="7">
                    <Dropdown
                        placeholder='Select value...'
                        options={options}
                        onChange={(e,{value})=>this.setState({fieldValue: value})}
                        selection
                        fluid
                        search />
                </Grid.Column>

                <Grid.Column width="2" verticalAlign="middle">
                    {this.props.removable &&
                        <Icon
                            name="remove"
                            size="large"
                            onClick={this.onRemove}
                            color="grey"
                            link />
                    }
                </Grid.Column>

            </Grid.Row>

        );
    }
}

export default SearchField;