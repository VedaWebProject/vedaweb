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
            <div>
                {this.props.active &&

                    <Input
                    addonBefore={selectBefore}
                    onChange={value => searchSimpleStore.setTerm(value)}
                    placeholder="search term" />

                }
            </div>
        );

    }

}

export default view(SearchSimple);