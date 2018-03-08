import React, { Component } from "react";
import { Select } from 'antd';

import './css/SearchTransliteration.css';

import searchTransliterationStore from "./stores/searchTransliterationStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <div className="search-settings-category bottom-gap">
                <div className="search-settings-category-title">Input Transliteration</div>
                <Select
                value={searchTransliterationStore.transliteration}
                className="full-width"
                onSelect={(value, o) => searchTransliterationStore.setTransliteration(value)}>
                    {searchTransliterationStore.transliterationOptions.map((option, i) => (
                        <Option
                        key={'trans_' + option.id}
                        value={option.id}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            </div>

        );

    }
}

export default view(SearchTransliteration);