import React, { Component } from "react";
import { Input, Tooltip, Select, Checkbox } from 'antd';

import stateStore from "../../../stateStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "../../widgets/TransliterationPreview";
import HelpButton from "../../widgets/HelpButton";

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

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
            let query = stateStore.search.quick.getQuery();
            query.mode = "quick";
            query.accents = stateStore.settings.accents;

            this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(query)));
        }
    }

    render() {

        const transliteration = (
            stateStore.search.quick.field.startsWith('version_')
            && stateStore.settings.transliteration !== "iso"
            ? <TransliterationPreview
                input={stateStore.search.quick.input}
                transliteration={stateStore.settings.transliteration} />
            : null
        );

        const helpAfter = <div data-tour-id="help-buttons"><HelpButton inline type="quickSearch" /></div>;

        const flexContainerStyle = {display: 'flex', width: "100%", margin: '.3rem 0'};
        const flexItemLabelStyle = {minWidth: "180px", maxWidth: "180px", whiteSpace: "nowrap"};
        const flexItemControlStyle = {flexGrow: "1", whiteSpace: "nowrap", overflow:"hidden", textOverflow:"ellipsis"};

        return (

            <div>
                <div style={flexContainerStyle}>
                    <Tooltip
                    title={transliteration}
                    trigger="focus"
                    placement="top"
                    overlayClassName="transliteration-tooltip">

                        <Search
                        value={stateStore.search.quick.input}
                        onChange={e => stateStore.search.quick.input = e.target.value}
                        onSearch={this.handleSearch}
                        style={{marginBottom:".25rem"}}
                        addonAfter={helpAfter}
                        size="default"
                        prefix={<OSK value={stateStore.search.quick.input} updateInput={v => stateStore.search.quick.input = v}/>}
                        placeholder={
                            "Quick search " +
                            (stateStore.search.quick.field.startsWith('version_')
                                ? "(" + stateStore.settings.transliteration.toUpperCase() + ")"
                                : ""
                            ) +
                            " in \"" + stateStore.ui.layers.find(l => l.id === stateStore.search.quick.field).label + "\""
                        } />

                    </Tooltip>
                </div>

                <div style={flexContainerStyle}>
                    <div style={flexItemLabelStyle}>
                        Search in
                    </div>
                    <div style={flexItemControlStyle}>
                        <Select
                        defaultValue="version_"
                        value={stateStore.search.quick.field}
                        onSelect={(value, option) => stateStore.search.quick.field = value}
                        dropdownMatchSelectWidth={false}
                        style={{ width: '100%', maxWidth: '100%' }}
                        size="small"
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
                    </div>
                </div>

                <div style={flexContainerStyle}>
                    <div style={flexItemLabelStyle}>
                        RegEx
                        <HelpButton
                        type="quickSearchRegex"
                        inline
                        style={{marginLeft: '.5rem'}} />
                    </div>
                    <div style={flexItemControlStyle}>
                        <Checkbox
                        onChange={e => stateStore.search.quick.regex = e.target.checked}
                        checked={stateStore.search.quick.regex} />
                    </div>
                </div>
            </div>

        );

    }

}

export default withRouter(view(SearchQuick));