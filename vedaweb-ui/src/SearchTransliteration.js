import React, { Component } from "react";
import { Row, Col, Select } from 'antd';

import './css/SearchTransliteration.css';

import searchTransliterationStore from "./stores/searchTransliterationStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <div className="search-settings-category bottom-gap">

                <Row
                type="flex"
                align="middle">

                    <Col
                    span={6}
                    className="bold">
                        Input Transliteration:
                    </Col>

                    <Col span={18}>
                        <Select
                        value={searchTransliterationStore.transliteration}
                        className="full-width"
                        size={'large'}
                        onSelect={(value, o) => searchTransliterationStore.setTransliteration(value)}>
                            {searchTransliterationStore.transliterationOptions.map((option, i) => (
                                <Option
                                key={'trans_' + option.id}
                                value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>

        );

    }
}

export default view(SearchTransliteration);