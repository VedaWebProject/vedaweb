import React, { Component } from "react";
import { Input, Tooltip } from 'antd';

import searchMetaStore from "./stores/searchMetaStore";
import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";

import { withRouter } from 'react-router-dom';


//const Option = Select.Option;
const Search = Input.Search;

class SearchSimple extends Component {

    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(input){
        console.log("SMART SEARCH INPUT: " + input);
        //TODO route to search results
        this.props.history.push("/view/id/" + input);   //TEMP
    }

    render() {

        const selectBefore = (
            <Select
            defaultValue="text"
            onSelect={(value, option) => searchSimpleStore.setField(value)}>
                {searchSimpleStore.fields.map(field => (
                    <Option
                    key={'simple_field_' + field.field}
                    value={field.field}>
                        {field.ui}
                    </Option>
                ))}
            </Select>
        );

        const transliteration = (
            <TransliterationPreview
            input={searchSimpleStore.term}
            transliteration={searchMetaStore.transliteration.setting}/>
        );
        
        return (

            <div>
                {this.props.active &&
 
                        <Tooltip
                        title={searchSimpleStore.field === "text" ? transliteration : ""}
                        trigger="focus"
                        placement="top">
                        
                            <Search
                            value={searchSimpleStore.term}
                            onChange={e => searchSimpleStore.setTerm(e.target.value)}
                            onSearch={this.handleSearch}
                            placeholder="location, translation or text via HK"
                            size="large" />

                        </Tooltip>
                }
            </div>
        );

    }

}

export default withRouter(view(SearchSimple));