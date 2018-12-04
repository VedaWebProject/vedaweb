import React, { Component } from "react";
import { Select } from 'antd';

import './css/SearchTransliteration.css';

import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <Select
            value={searchMetaStore.transliteration}
            onSelect={(v, o) => searchMetaStore.setTransliteration(v)}
            className="secondary-font"
            style={{width: '400px', maxWidth: '90%'}}>
                {uiDataStore.search.meta.transliterations.map(option => (
                    <Option
                    key={option.name}
                    value={option.id}
                    className="secondary-font">
                        {option.name}
                    </Option>
                ))}
            </Select>

        );

    }
}

export default view(SearchTransliteration);