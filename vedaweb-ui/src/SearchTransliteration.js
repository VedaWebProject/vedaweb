import React, { Component } from "react";
import { Row, Col, Select } from 'antd';

import './css/SearchTransliteration.css';

import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <Row type="flex" align="middle">
                <Col span={6}>
                    <span className="bold">Input Transliteration:</span>
                </Col>

                <Col span={18}>
                    <Select
                    value={searchMetaStore.transliteration.setting}
                    className="full-width"
                    onSelect={(value, o) => searchMetaStore.setTransliteration(value)}>
                        {searchMetaStore.transliteration.data.map((option, i) => (
                            <Option
                            key={'trans_' + option.id}
                            value={option.id}>
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

        );

    }
}

export default view(SearchTransliteration);