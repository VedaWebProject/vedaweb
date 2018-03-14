import React, { Component } from "react";
import { Input, Select } from 'antd';

import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

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
        
        return (
            <div className="top-gap bottom-gap">
                {this.props.active &&
                    <Input
                    addonBefore={selectBefore}
                    onChange={e => searchSimpleStore.setTerm(e.target.value)}
                    placeholder="type your search input, here..."
                    size="large" />
                }
            </div>
        );

    }

}

export default view(SearchSimple);