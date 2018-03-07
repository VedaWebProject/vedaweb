import React, { Component } from "react";
import { Row, Col, Icon, Input } from 'antd';

import SearchField from "./SearchField";

import './css/SearchBlock.css';

const Search = Input.Search;


class SearchBlock extends Component {

    constructor(props){
        super(props);

        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.updateField = this.updateField.bind(this);
        this.updateTerm = this.updateTerm.bind(this);
    }

    componentDidMount(){
        this.addField();
    }

    addField(){
        this.props.onAddField(this.props.id);
    }

    removeField(fieldId){
        this.props.onRemoveField(this.props.id, fieldId);
    }

    onRemove(){
        this.props.onRemoveBlock(this.props.id);
    }

    updateField(fieldData){
        this.props.onUpdateBlock({
            id: this.props.id,
            field: {
                id: fieldData.id,
                name: fieldData.name,
                value: fieldData.value
            }
        })
    }

    updateTerm(event){
        this.props.onUpdateBlock({
            id: this.props.id,
            term: event.target.value
        })
    }


    render() {

        return (

                <Row type="flex" align="middle" className="search-block">
                    
                    <Col span={1}>
                        <div
                        className={'search-block-tab content-center' + (!this.props.showRemoveButton ? ' hidden' : '')}
                        onClick={this.onRemove}>
                            <Icon type="close"/>
                        </div>
                    </Col>

                    <Col span={23}>

                        <Row
                        type="flex"
                        align="middle"
                        justify="center">
                            <Col span={18}>
                                <Search
                                onChange={this.updateTerm}
                                placeholder="search term (optional)"
                                className="search-term-input"/>
                            </Col>
                            <Col span={4}></Col>
                        </Row>

                        {this.props.fields.map((field, i) => (
                            <SearchField
                            key={field.id}
                            id={field.id}
                            fieldName={field.name}
                            fieldValue={field.value}
                            onClickRemove={this.removeField}
                            onClickAdd={this.addField}
                            onUpdateField={this.updateField}
                            isRemovable={this.props.fields.length > 1}
                            isLastField={this.props.fields.length < 4 && this.props.fields.length === i + 1}
                            grammarData={this.props.grammarData} />
                        ))}

                    </Col>

                </Row>
            
        );
    }
}

export default SearchBlock;