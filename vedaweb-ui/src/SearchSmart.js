import React, { Component } from "react";
import { Input, Tooltip } from 'antd';

import Sanscript from 'sanscript';

import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";

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
        if (/\d/.test(input)){
            this.props.history.push("/view/id/" + input);
        } else {
            input = Sanscript.t(input, "hk", "iso");
            this.props.history.push("/results/" + Base64.encode(JSON.stringify({ smart : input })));
        }
    }

    render() {

        const transliteration = (
            <TransliterationPreview
            input={searchSimpleStore.term}
            transliteration="hk" />
        );


        return (

            <div>
                <Tooltip
                title={searchSimpleStore.field === "text" ? transliteration : ""}
                trigger="focus"
                placement="top"
                visible={ !/\d/.test(searchSimpleStore.term) && searchSimpleStore.term.length > 0 } >

                    <Search
                    value={searchSimpleStore.term}
                    onChange={e => searchSimpleStore.setTerm(e.target.value)}
                    onSearch={this.handleSearch}
                    placeholder="location, translation or text via HK"
                    size="large" />

                </Tooltip>
            </div>
        );

    }

}

export default withRouter(view(SearchSmart));