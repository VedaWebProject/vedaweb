import React, { Component } from "react";
import { Input, Select, Tooltip } from 'antd';

import searchMetaStore from "./stores/searchMetaStore";
import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

import TransliterationPreview from "./TransliterationPreview";


const Option = Select.Option;


class SearchSimple extends Component {

    render() {

        const selectBefore = (
            <Select
            defaultValue="text"
            onSelect={(value, option) => searchSimpleStore.setField(value)}>
                {searchSimpleStore.fields.map(field => (
                    <Option
                    key={'simple_field_' + field.field}
                    value={field.field}>
                        {field.ui}
                    </Option>
                ))}
            </Select>
        );

        const transliteration = (
            <TransliterationPreview
            input={searchSimpleStore.term}
            transliteration={searchMetaStore.transliteration.setting}/>
        );
        
        return (

            <div>
                {this.props.active &&
                    <div className="top-gap bottom-gap">
                        <Tooltip
                        title={searchSimpleStore.field === "text" ? transliteration : ""}
                        trigger="focus"
                        placement="top">
                        
                            <Input
                            value={searchSimpleStore.term}
                            addonBefore={selectBefore}
                            onChange={e => searchSimpleStore.setTerm(e.target.value)}
                            placeholder="type your search input, here..."
                            size="large" />

                        </Tooltip>
                    </div>
                }
            </div>
        );

    }

}

export default view(SearchSimple);