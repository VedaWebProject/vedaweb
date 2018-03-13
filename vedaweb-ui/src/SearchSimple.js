import React, { Component } from "react";
import { Input, Select } from 'antd';

import searchSimpleStore from "./stores/searchSimpleStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchSimple extends Component {

    render() {

        const selectBefore = (
            <Select defaultValue="text">
                <Option value="text">Rigveda text</Option>
                <Option value="translation_de">Translation DE</Option>
                <Option value="translation_en">Translation EN</Option>
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