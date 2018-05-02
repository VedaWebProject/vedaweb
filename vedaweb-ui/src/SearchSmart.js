import React, { Component } from "react";
import { Input } from 'antd';

import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';


//const Option = Select.Option;
const Search = Input.Search;

class SearchSmart extends Component {

    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(input){
        console.log("SMART SEARCH INPUT: " + input);
        this.props.history.push("/results/" + Base64.encode(JSON.stringify({ smart : input })));   //TEMP
    }

    render() {

        return (

            <div>
                <Search
                value={searchSimpleStore.term}
                onChange={e => searchSimpleStore.setTerm(e.target.value)}
                onSearch={this.handleSearch}
                placeholder="location, translation or text via HK"
                size="large" />
            </div>
        );

    }

}

export default withRouter(view(SearchSmart));