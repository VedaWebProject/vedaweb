import React, { Component } from "react";
import { Row, Col, Button, Select } from 'antd';

import './SearchField.css';

const Option = Select.Option;

class SearchField extends Component {


    constructor(props){
        super(props);

        //TODO: change defaults
        this.state = {
            fieldName: null,
            fieldValue: null,
            fieldValueOptions: []
        };

        this.onRemove = this.onRemove.bind(this);
        this.onChangeFieldName = this.onChangeFieldName.bind(this);
        this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    }

    onChangeFieldName(value, option){
        let fieldValueOptions = this.state.fieldValueOptions;

        for (let gramm of this.props.grammarData){
            if (value === gramm.field){
                fieldValueOptions = gramm.values;
                break;
            }
        }

        this.setState({
            fieldName: value,
            fieldValue: null,
            fieldValueOptions : fieldValueOptions
        });

        this.props.onSetData({
            fieldId: this.props.fieldId,
            fieldName: value,
            fieldValue: null
        });
    }

    onChangeFieldValue(value, option){
        this.props.onSetData({
            fieldId: this.props.fieldId,
            fieldName: this.state.fieldName,
            fieldValue: value
        });
    }

    onRemove(e){
        this.props.onClickRemove(this);
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
                    placeholder="Attribute..."
                    onSelect={this.onChangeFieldName}
                    style={{ width: '98%' }} >
                        {this.props.grammarData.map((option, i) => (
                            <Option
                                key={i.toString(36) + i}
                                value={option.field}>
                                    {option.text}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={9}>
                    <Select
                    key={'fieldValue_of_' + this.state.fieldName}
                    showSearch
                    placeholder="Value..."
                    onSelect={this.onChangeFieldValue}
                    disabled = {this.state.fieldValueOptions.length === 0}
                    style={{ width: '98%' }} >
                        {this.state.fieldValueOptions.map((option, i) => (
                            <Option
                                key={this.state.fieldName + i}
                                value={option}>
                                    {option}
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