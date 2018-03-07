import React, { Component } from "react";
import { Row, Col, Button, Select } from 'antd';

import './css/SearchField.css';

const Option = Select.Option;

class SearchField extends Component {


    constructor(props){
        super(props);

        this.state = {
            valueOptions: []
        }

        this.onRemove = this.onRemove.bind(this);
        this.updateFieldName = this.updateFieldName.bind(this);
        this.updateFieldValue = this.updateFieldValue.bind(this);
    }

    updateFieldName(value, option){
        this.props.onUpdateField({
            id: this.props.id,
            name: value,
            value: ''
        });
    }

    updateFieldValue(value, option){
        this.props.onUpdateField({
            id: this.props.id,
            name: this.props.fieldName,
            value: value
        });
    }

    onRemove(e){
        this.props.onClickRemove(this.props.id);
    }

    render() {

        return (
            
            <Row
            type="flex"
            align="middle"
            justify="center"
            className="search-field">

                <Col span={9}>
                    <Select
                    showSearch
                    defaultValue={this.props.grammarData[0].field}
                    value={this.props.fieldName}
                    placeholder="Select a person"
                    onSelect={this.updateFieldName}
                    style={{ width: '98%' }} >
                        {this.props.grammarData.map((option, i) => (
                            <Option
                                key={'fValOpt_' + i}
                                value={option.field}>
                                    {option.text}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={9}>
                    <Select
                    showSearch
                    key={'fieldValue_of_' + this.props.id}
                    value={this.props.fieldValue}
                    onSelect={this.updateFieldValue}
                    disabled = {this.props.fieldName.length === 0}
                    style={{ width: '100%' }} >
                        {this.props.fieldName.length > 0 &&
                            this.props.grammarData.filter(cat => cat.field === this.props.fieldName)[0].values.map(value => (
                                <Option
                                key={'value_' + this.props.id}
                                value={value}>
                                    {value}
                                </Option>
                            ))}
                    </Select>
                </Col>

                <Col span={2} className="content-right">
                    <Button
                    disabled={!this.props.isRemovable}
                    onClick={this.onRemove}
                    icon="minus" />
                </Col>

                <Col span={2} className="content-right">
                    <Button
                    onClick={this.props.onClickAdd}
                    disabled={!this.props.isLastField}
                    className={!this.props.isLastField ? "hidden-button" : ""}
                    icon="plus" />
                </Col>

            </Row>

        );
    }
}

export default SearchField;