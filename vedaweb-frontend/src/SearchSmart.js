import React, { Component } from "react";
import { Input, Tooltip, Select } from 'antd';

import searchSmartStore from "./stores/searchSmartStore";
import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import "./css/SearchSmart.css";
import SanscriptAccents from "./SanscriptAccents";


const Option = Select.Option;
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
            let jsonData = {
                mode: "smart",
                input: searchSmartStore.data.field === "form" ? SanscriptAccents.t(input, "hk", "iso") : input,
                field: searchSmartStore.data.field
            };
            this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(jsonData)));
        }
    }

    render() {

        const selectBefore = (
            <Select
            defaultValue="form"
            value={searchSmartStore.data.field}
            onSelect={(value, option) => searchSmartStore.setField(value)}
            style={{ width: 125 }}
            className="secondary-font">
                {uiDataStore.search.smart.fields.map(field => (
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
            searchSmartStore.data.field === "form"
            ? <TransliterationPreview input={searchSmartStore.data.input} transliteration="hk" />
            : null
        );

        return (

            <div id="search-smart">
                <Tooltip
                title={transliteration}
                trigger="focus"
                placement="top"
                overlayClassName="transliteration-tooltip">

                    <Search
                    value={searchSmartStore.data.input}
                    onChange={e => searchSmartStore.setInput(e.target.value)}
                    onSearch={this.handleSearch}
                    addonBefore={selectBefore}
                    placeholder={"Quick search: " + 
                        (searchSmartStore.data.field === "form"
                        ? searchMetaStore.transliteration.toUpperCase() + " or verse no."
                        : "Translation or verse no.")
                    } />

                </Tooltip>
            </div>
        );

    }

}

export default withRouter(view(SearchSmart));