import React, { Component } from "react";
import { Input, Tooltip, Select, Checkbox } from 'antd';

import stateStore from "../../../stateStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "../../widgets/TransliterationPreview";
import HelpButton from "../../widgets/HelpButton";

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import "./SearchQuick.css";
import SanscriptAccents from "../../utils/SanscriptAccents";
import OSK from "../../widgets/OSK";


const { Option, OptGroup } = Select;
const Search = Input.Search;

class SearchQuick extends Component {

    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(input){
        if (/^\d+/.test(input)){
            this.props.history.push("/view/id/" + input);
        } else {
            let query = stateStore.results.query;
            query.mode = "quick";
            query.input = stateStore.search.quick.field.startsWith('version_')
                          ? SanscriptAccents.t(input, stateStore.settings.transliteration, "iso")
                          : input;
            query.field = stateStore.search.quick.field;
            query.accents = stateStore.settings.accents;
            query.regex = stateStore.search.quick.regex;

            // let jsonData = {
            //     mode: "quick",
            //     input: stateStore.search.quick.field.startsWith('version_') ? SanscriptAccents.t(input, stateStore.settings.transliteration, "iso") : input,
            //     field: stateStore.search.quick.field,
            //     accents: stateStore.settings.accents,
            //     regex: stateStore.search.quick.regex
            // };

            this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(query)));
        }
    }

    render() {

        const selectBefore = (
            <Select
            defaultValue="version_"
            value={stateStore.search.quick.field}
            onSelect={(value, option) => stateStore.search.quick.field = value}
            style={{ width: '180px' }}
            className="secondary-font">
                <OptGroup label="Text Versions">
                    {/* text versions */}
                    {stateStore.ui.layers
                    .filter(l => l.id.startsWith('version_') && l.id !== 'version_devanagari')
                    .map(v => (
                        <Option
                        key={'quick_field_' + v.id}
                        value={v.id}
                        className="secondary-font">
                            {v.label}
                        </Option>
                    ))}
                </OptGroup>
                <OptGroup label="Translations">
                    {/* translations */}
                    {stateStore.ui.layers
                    .filter(l => l.id.startsWith('translation_'))
                    .map(v => (
                        <Option
                        key={'quick_field_' + v.id}
                        value={v.id}
                        className="secondary-font">
                            {v.label}
                        </Option>
                    ))}
                </OptGroup>
            </Select>
        );

        const transliteration = (
            stateStore.search.quick.field.startsWith('version_')
            && stateStore.settings.transliteration !== "iso"
            ? <TransliterationPreview
                input={stateStore.search.quick.input}
                transliteration={stateStore.settings.transliteration} />
            : null
        );

        const helpAfter = <div data-tour-id="help-buttons"><HelpButton inline type="quickSearch" /></div>;

        return (

            <div className="v-middle">
                <Tooltip
                title={transliteration}
                trigger="focus"
                placement="top"
                overlayClassName="transliteration-tooltip"
                style={{display: 'inline'}}>

                    <Search
                    value={stateStore.search.quick.input}
                    onChange={e => stateStore.search.quick.input = e.target.value}
                    onSearch={this.handleSearch}
                    addonBefore={selectBefore}
                    addonAfter={helpAfter}
                    size="large"
                    prefix={<OSK value={stateStore.search.quick.input} updateInput={v => stateStore.search.quick.input = v}/>}
                    style={{maxWidth: '420px'}}
                    placeholder={
                        (stateStore.search.quick.field.startsWith('version_')
                        ? stateStore.settings.transliteration.toUpperCase() + " or stanza no."
                        : "Translation or stanza no.")
                    } />
                </Tooltip>

                <div style={{display:"inline-block", textAlign:"left"}}>
                    <Checkbox
                    onChange={e => stateStore.settings.accents = e.target.checked}
                    checked={stateStore.settings.accents}
                    style={{marginLeft:'1rem'}}>
                        Accent-sensitive
                    </Checkbox>
                    <HelpButton
                    type="accentSensitive"
                    inline
                    iconStyle={{fontSize:"90%"}}
                    style={{paddingLeft:"0"}} />
                    <br/>
                    <Checkbox
                    onChange={e => stateStore.search.quick.regex = e.target.checked}
                    checked={stateStore.search.quick.regex}
                    style={{marginLeft:'1rem'}}>
                        RegEx
                    </Checkbox>
                    <HelpButton
                    type="quickSearchRegex"
                    inline
                    iconStyle={{fontSize:"90%"}}
                    style={{paddingLeft:"0"}} />
                </div>

            </div>
        );

    }

}

export default withRouter(view(SearchQuick));