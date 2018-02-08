import React, { Component } from "react";
import { Grid, Dropdown, Icon } from 'semantic-ui-react';

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
    }

    render() {
        var options = [{ text: 'Case', value: 'case' },{ text: 'Mode', value: 'mode' }];

        return (
            
            <Grid.Row>

                <Grid.Column width="7">
                    <Dropdown
                        placeholder='Select...'
                        options={options}
                        onChange={(e,{value})=>this.setState({fieldName: value})}
                        selection
                        fluid
                        search />
                </Grid.Column>

                <Grid.Column width="7">
                    <Dropdown
                        placeholder='Select...'
                        options={options}
                        onChange={(e,{value})=>this.setState({fieldValue: value})}
                        selection
                        fluid
                        search />
                </Grid.Column>

                <Grid.Column width="2">
                    <Icon name="minus circle" size="big" onClick={this.props.onClickRemove(this)} link/>
                </Grid.Column>

            </Grid.Row>

        );
    }
}

export default SearchField;