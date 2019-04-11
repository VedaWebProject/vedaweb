import React, { Component } from "react";
import { Select } from 'antd';

import './SearchTransliteration.css';

import stateStore from "../../../state/stateStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <Select
            size={this.props.size || "default"}
            value={stateStore.settings.transliteration}
            onSelect={(v, o) => stateStore.settings.transliteration = v}
            className="secondary-font"
            dropdownMatchSelectWidth={false}
            style={{width: '480px', maxWidth: '90%'}}>
                {stateStore.ui.search.meta.transliterations.map(option => (
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