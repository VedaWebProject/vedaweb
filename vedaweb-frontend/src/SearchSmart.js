import React, { Component } from "react";
import { Input, Tooltip, Select, Checkbox } from 'antd';

import searchSmartStore from "./stores/searchSmartStore";
import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";
import HelpButton from "./HelpButton";

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import "./css/SearchSmart.css";
import SanscriptAccents from "./SanscriptAccents";
import OSK from "./OSK";


const { Option, OptGroup } = Select;
const Search = Input.Search;

class SearchSmart extends Component {

    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(input){
        if (/[^~\d]\d+/.test(input)){
            this.props.history.push("/view/id/" + input);
        } else {
            let jsonData = {
                mode: "smart",
                input: searchSmartStore.data.field.startsWith('version_') ? SanscriptAccents.t(input, searchMetaStore.transliteration, "iso") : input,
                field: searchSmartStore.data.field,
                accents: searchMetaStore.accents
            };
            this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(jsonData)));
        }
    }

    render() {

        const selectBefore = (
            <Select
            defaultValue="version_lubotskyzurich"
            value={searchSmartStore.data.field}
            onSelect={(value, option) => searchSmartStore.setField(value)}
            style={{ width: '180px' }}
            className="secondary-font">
                <OptGroup label="Text Versions">
                    {/* text versions */}
                    {uiDataStore.layers
                    .filter(l => l.id.startsWith('version_') && l.id !== 'version_devanagari')
                    .map(v => (
                        <Option
                        key={'quick_field_' + v.id}
                        value={v.id}
                        className="secondary-font">
                            {v.id.endsWith('_') ? <i>{v.label}</i> : v.label}
                        </Option>
                    ))}
                </OptGroup>
                <OptGroup label="Translations">
                    {/* translations */}
                    {uiDataStore.layers
                    .filter(l => l.id.startsWith('translation_'))
                    .map(v => (
                        <Option
                        key={'quick_field_' + v.id}
                        value={v.id}
                        className="secondary-font">
                            {v.id.endsWith('_') ? <i>{v.label}</i> : v.label}
                        </Option>
                    ))}
                </OptGroup>
            </Select>
        );

        const transliteration = (
            searchSmartStore.data.field.startsWith('version_')
            && searchMetaStore.transliteration !== "iso"
            ? <TransliterationPreview
                input={searchSmartStore.data.input}
                transliteration={searchMetaStore.transliteration} />
            : null
        );

        const helpAfter = <HelpButton inline type="quickSearch"/>;

        return (

            <div className="v-middle">
                <Tooltip
                title={transliteration}
                trigger="focus"
                placement="top"
                overlayClassName="transliteration-tooltip"
                style={{display: 'inline'}}>

                    <Search
                    value={searchSmartStore.data.input}
                    onChange={e => searchSmartStore.setInput(e.target.value)}
                    onSearch={this.handleSearch}
                    addonBefore={selectBefore}
                    addonAfter={helpAfter}
                    size="large"
                    prefix={<OSK value={searchSmartStore.data.input} updateInput={searchSmartStore.setInput}/>}
                    style={{maxWidth: '420px'}}
                    placeholder={
                        (searchSmartStore.data.field.startsWith('version_')
                        ? searchMetaStore.transliteration.toUpperCase() + " or stanza no."
                        : "Translation or stanza no.")
                    } />
                </Tooltip>

                <Checkbox
                onChange={e => searchMetaStore.setAccents(e.target.checked)}
                checked={searchMetaStore.accents}
                style={{marginLeft:'1rem'}}>
                    Accent-sensitive
                </Checkbox>

            </div>
        );

    }

}

export default withRouter(view(SearchSmart));