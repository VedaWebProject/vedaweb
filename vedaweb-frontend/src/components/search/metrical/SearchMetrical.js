import React, { Component } from "react";
import { Input, Select } from 'antd';

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";

import HelpButton from "../../widgets/HelpButton";

import './SearchMetrical.css'

const { Option, OptGroup } = Select;


class SearchMetrical extends Component {

    // constructor(props){
    //     super(props);
    // }

    // componentDidMount(){
    // }


    render() {

        const selectBefore = (
            <Select
            defaultValue="version_vannootenholland"
            value={stateStore.search.metrical.field}
            onSelect={(value, option) => stateStore.search.metrical.field = value}
            style={{ width: '220px' }}
            dropdownMatchSelectWidth={false}
            className="secondary-font">
                <OptGroup label="Text Versions">
                    {/* text versions (with metrical data) */}
                    {stateStore.ui.layers
                    .filter(
                        l => l.id.startsWith('version_')
                        && l.id !== 'version_eichler'
                        && l.id !== 'version_gasuns'
                        && l.id !== 'version_'
                    ).map(v => (
                        <Option
                        key={'metrical_field_' + v.id}
                        value={v.id}
                        className="secondary-font">
                            {v.label}
                        </Option>
                    ))}
                </OptGroup>
            </Select>
        );

        return (
            <div className="search-container">

                <HelpButton
                type="metricalSearch"
                label="How does this work?" />

                <div className="top-gap">

                    <Input
                    value={stateStore.search.metrical.input}
                    onChange={e => stateStore.search.metrical.input = e.target.value.replace(/[^LSls *?"]/g, "").toUpperCase()}
                    addonBefore={selectBefore}
                    title="Type 'L' for long and 'S' for short syllables, e.g. LLS LL SLSL"
                    size="large"
                    placeholder="Type 'L' for long and 'S' for short syllables, e.g. LLS LL SLSL" />

                </div>
            </div>
        );
    }
}

export default view(SearchMetrical);