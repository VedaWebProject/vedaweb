import React, { Component } from "react";
import { Input, Tooltip, Select } from 'antd';

import searchSimpleStore from "./stores/searchSimpleStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';
import searchMetaStore from "./stores/searchMetaStore";
import SanscriptAccents from "./SanscriptAccents";


const Option = Select.Option;
const Search = Input.Search;

class SearchSimple extends Component {

    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(input){
        if (/\d/.test(input)){
            this.props.history.push("/view/id/" + input);
        } else {
            let jsonData = {
                mode: "simple",
                input: SanscriptAccents.t(input, "hk", "iso"),
                field: searchSimpleStore.data.field
            };
            this.props.history.push("/results/" + Base64.encode(JSON.stringify(jsonData)));
        }
    }

    render() {

        const selectBefore = (
            <Select
            defaultValue="form"
            onSelect={(value, option) => searchSimpleStore.setField(value)}
            className="secondary-font">
                {uiDataStore.search.simple.fields.map(field => (
                    <Option
                    key={'simple_field_' + field.field}
                    value={field.field}
                    className="secondary-font">
                        {field.ui}
                    </Option>
                ))}
            </Select>
        );

        const transliteration = (
            searchSimpleStore.data.field === "form"
            ? <TransliterationPreview
                input={searchSimpleStore.data.input}
                transliteration={searchMetaStore.transliteration.id} />
            : null
        );


        return (

            <div className="search-container">
                <Tooltip
                title={transliteration}
                trigger="focus"
                placement="bottom"
                overlayClassName="transliteration-tooltip">

                    <Search
                    value={searchSimpleStore.data.input}
                    onChange={e => searchSimpleStore.setInput(e.target.value)}
                    onSearch={this.handleSearch}
                    addonBefore={selectBefore}
                    size="large"
                    placeholder={
                        searchSimpleStore.data.field === "form"
                        ? "Search Rigveda using " + searchMetaStore.transliteration.name
                        : "Search for translated text"
                    } />

                </Tooltip>
            </div>
        );

    }

}

export default withRouter(view(SearchSimple));