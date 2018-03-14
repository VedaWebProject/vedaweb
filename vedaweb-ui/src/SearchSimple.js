import React, { Component } from "react";
import { Row, Col, Input, Select } from 'antd';

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
        
        return (
            <div className="top-gap bottom-gap">
                {this.props.active &&

                    <Row
                    type="flex"
                    align="middle">

                        <Col span={16}>
                            <Input
                            value={searchSimpleStore.term}
                            addonBefore={selectBefore}
                            onChange={e => searchSimpleStore.setTerm(e.target.value)}
                            placeholder="type your search input, here..."
                            size="large" />
                        </Col>

                        { searchSimpleStore.field === "text" &&
                            <Col span={8}>
                                <TransliterationPreview
                                input={searchSimpleStore.term}
                                transliteration={searchMetaStore.transliteration.setting}
                                placeholder="agnim" />
                            </Col>
                        }
                    </Row>

                }
            </div>
        );

    }

}

export default view(SearchSimple);