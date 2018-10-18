import React, { Component } from "react";
import { Radio } from 'antd';

import './css/SearchTransliteration.css';

import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

const RadioGroup = Radio.Group;


class SearchTransliteration extends Component {


    render() {

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (

            <RadioGroup
            onChange={e => searchMetaStore.setTransliteration(e.target.value)}
            value={searchMetaStore.transliteration}>
                {uiDataStore.search.meta.transliterations.map(option => (
                    <Radio
                    key={option.name}
                    value={option.id}
                    style={radioStyle}>
                        {option.name}
                    </Radio>
                ))}
            </RadioGroup>

        );

    }
}

export default view(SearchTransliteration);