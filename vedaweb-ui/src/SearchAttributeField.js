import React, { Component } from "react";
import { Row, Col, Button, Select } from 'antd';

import searchAdvancedStore from "./stores/searchAdvancedStore";

import './css/SearchAttributeField.css';

const Option = Select.Option;

class SearchAttributeField extends Component {


    render() {

        let usedFieldNames = searchAdvancedStore.getUsedFieldNamesForBlock(this.props.parentBlockId);
        let valueOptions = searchAdvancedStore.getValueOptionsForFieldName(this.props.fieldName);

        return (
            
            <Row
            type="flex"
            align="middle"
            justify="center"
            className="search-field">

                <Col span={9}>
                    <Select
                    showSearch
                    value={this.props.fieldName}
                    onSelect={(value, option) => searchAdvancedStore.updateFieldName(
                        this.props.parentBlockId, this.props.id, value
                    )}
                    style={{ width: '98%' }} >
                        <Option
                            key={'fValOpt_none'}
                            value={''}>
                                {'Select attribute (optional)'}
                        </Option>
                        {searchAdvancedStore.grammarOptions.map((option, i) => (
                            (usedFieldNames.indexOf(option.field) === -1 || option.field === this.props.fieldName) &&
                            <Option
                                key={'fValOpt_' + option.field}
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
                    value={this.props.fieldValue.length > 0 ? this.props.fieldValue : valueOptions[0]}
                    onSelect={(value, option) => searchAdvancedStore.updateFieldValue(
                        this.props.parentBlockId, this.props.id, value
                    )}
                    disabled = {this.props.fieldName.length === 0}
                    style={{ width: '100%' }} >
                        {this.props.fieldName.length > 0 &&
                            valueOptions.map(value => (
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
                    onClick={() => searchAdvancedStore.removeFieldFromBlock(this.props.parentBlockId, this.props.id)}
                    icon="minus" />
                </Col>

                <Col span={2} className="content-right">
                    <Button
                    onClick={() => searchAdvancedStore.addFieldToBlock(this.props.parentBlockId)}
                    disabled={!this.props.isLastField}
                    className={!this.props.isLastField ? "hidden-button" : ""}
                    icon="plus" />
                </Col>

            </Row>

        );
    }
}

export default SearchAttributeField;