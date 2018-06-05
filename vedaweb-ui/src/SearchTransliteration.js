import React, { Component } from "react";
import { Row, Col, Select, Icon } from 'antd';

import './css/SearchTransliteration.css';

import searchMetaStore from "./stores/searchMetaStore";
import uiDataStore from "./stores/uiDataStore";
import { view } from 'react-easy-state';

const Option = Select.Option;


class SearchTransliteration extends Component {


    render() {

        return (

            <Row type="flex" align="middle">
                <Col span={8}>
                    <Icon type="edit" className="gap-right"/>
                    <span className="bold">Input Transliteration:</span>
                </Col>

                <Col span={16}>
                    <Select
                    value={searchMetaStore.transliteration}
                    className="full-width"
                    onSelect={(value, o) => searchMetaStore.setTransliteration(value)}>
                        {uiDataStore.search.meta.transliterations.map((option, i) => (
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