import React, { Component } from "react";
import { Row, Col, Select } from 'antd';

import './css/SearchTransliteration.css';

const Option = Select.Option;


class SearchMetaFilterList extends Component {

    render() {

        return (

            this.props.items !== undefined &&
            <Row>
                <Col span={6} style={{paddingTop: '.5rem'}}>{this.props.label + ": "}</Col>
                <Col span={18}>
                    <Select
                    mode="multiple"
                    allowClear={true}
                    value={this.props.selected}
                    style={{ width: '100%', margin: '0.5rem 0'}}
                    placeholder={"Select or leave blank for " + this.props.placeholder}
                    onChange={this.props.handleChange}>
                        {this.props.items.map((item, i) => (
                            <Option key={item + i} value={item}>{item}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        );

    }
}

export default SearchMetaFilterList;