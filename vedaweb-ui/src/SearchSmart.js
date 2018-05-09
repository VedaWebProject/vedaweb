import React, { Component } from "react";
import { Input, Tooltip } from 'antd';

import Sanscript from 'sanscript';

import searchSmartStore from "./stores/searchSmartStore";
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
            let jsonData = { mode: "smart", input: Sanscript.t(input, "hk", "iso") };
            this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData)));
        }
    }

    render() {

        const transliteration = (
            <TransliterationPreview
            input={searchSmartStore.data.input}
            transliteration="hk" />
        );


        return (

            <div>
                <Tooltip
                title={transliteration}
                trigger="focus"
                placement="top">

                    <Search
                    value={searchSmartStore.data.input}
                    onChange={e => searchSmartStore.setInput(e.target.value)}
                    onSearch={this.handleSearch}
                    placeholder="Harvard Kyoto or verse number"
                    size="large" />

                </Tooltip>
            </div>
        );

    }

}

export default withRouter(view(SearchSmart));