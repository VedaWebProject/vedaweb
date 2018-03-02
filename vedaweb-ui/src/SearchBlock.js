import React, { Component } from "react";
import { Row, Col, Icon, Input } from 'antd';

import SearchField from "./SearchField";

import './SearchBlock.css';

const Search = Input.Search;


class SearchBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchFields: [],
            blockData: []
        };

        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
        this.onClickRemove = this.onClickRemove.bind(this);
        this.updateBlockData = this.updateBlockData.bind(this);
    }

    componentDidMount(){
        this.addField();
    }

    addField(){
        var fieldId = 'field_' + Date.now();
        this.setState({
            searchFields : this.state.searchFields.concat({'fieldId': fieldId})
        });
    }

    onClickRemove(){
        this.props.onClickRemove(this.props.blockId);
    }

    removeField(toRemove){
        var newBlockData = this.state.blockData.filter(field => toRemove.props.fieldId !== field.fieldId);

        this.setState({
            searchFields: this.state.searchFields.filter(field => toRemove.props.fieldId !== field.fieldId),
            blockData: newBlockData
        });

        this.props.onUpdateBlockData({blockId: this.props.blockId, blockData: newBlockData});
    }

    updateBlockData(updatedField){
        var newBlockData = this.state.blockData.filter(field => field.fieldId !== updatedField.fieldId);
        
        if (updatedField.fieldValue != null)
            newBlockData = newBlockData.concat(updatedField);

        this.setState({
            blockData: newBlockData
        });

        this.props.onUpdateBlockData({blockId: this.props.blockId, blockData: newBlockData});
    }


    render() {
        return (

                <Row type="flex" align="middle" className="search-block">
                    
                    <Col span={1}>
                        <div
                        className={'search-block-tab content-center' + (!this.props.showRemoveButton ? ' hidden' : '')}
                        onClick={this.onClickRemove}>
                            <Icon type="close"/>
                        </div>
                    </Col>

                    <Col span={23}>

                        <Row
                        type="flex"
                        align="middle"
                        justify="center">
                            <Col span={18}>
                                <Search placeholder="search term"/>
                            </Col>
                            <Col span={4}></Col>
                        </Row>

                        {this.state.searchFields.map((field, i) => (
                            <SearchField
                            key={field.fieldId}
                            fieldId={field.fieldId}
                            onClickRemove={this.removeField}
                            onClickAdd={this.addField}
                            onSetData={this.updateBlockData}
                            isRemovable={this.state.searchFields.length > 1}
                            isLastField={this.state.searchFields.length < 4 && this.state.searchFields.length === i + 1}
                            grammarData={this.props.grammarData} />
                        ))}

                    </Col>

                </Row>
            
        );
    }
}

export default SearchBlock;