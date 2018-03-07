import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import SearchBlock from "./SearchBlock";

import './css/SearchBlockList.css'


class SearchBlockList extends Component {

    constructor(props){
        super(props);

        this.state = {
            blocks: []
        };

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
        this.updateBlock = this.updateBlock.bind(this);
        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
    }

    componentWillMount(){
        this.addBlock();
    }

    componentDidUpdate(){
        //transform search block data into format expected by API
        let data = [];
        let countBlocks = 0;
        
        for (let block of this.state.blocks){
            let b = {};
            b['index'] = countBlocks++;
            if (block.term.length > 0) b['term'] = block.term;
            for (let field of block.fields){
                if (field.value.length > 0) b[field.name] = field.value;
            }
            if (Object.keys(b).length > 1) data.push(b);
        }
        this.props.onUpdate(data);
    }

    addBlock(){
        this.setState({
            blocks: this.state.blocks.concat({
                id: 'block_' + Date.now(),
                term: '',
                fields: []
            })
        });
    }

    removeBlock(id){
        this.setState({
            blocks: this.state.blocks.filter(block => block.id !== id)
        });
    }

    updateBlock(blockData){
        let blocksUpdated = this.state.blocks.map(block => (
            block.id !== blockData.id ? block : {
                id: blockData.id,
                term: blockData.hasOwnProperty('term') ? blockData.term : block.term,
                fields: !blockData.hasOwnProperty('field') ? block.fields :
                    block.fields.map(field => (
                        field.id !== blockData.field.id ? field : {
                            id: field.id,
                            name: blockData.field.name,
                            value: blockData.field.value
                        }
                    ))
            }
        ));

        this.setState({
            blocks: blocksUpdated
        });
    }

    addField(blockId){
        this.setState({
            blocks: this.state.blocks.map(block => (
                block.id !== blockId ? block : {
                    id: block.id,
                    term: block.term,
                    fields: block.fields.concat({
                        id: 'field_' + Date.now(),
                        name: '',
                        value: ''
                    })
                }
            ))
        });
    }

    removeField(blockId, fieldId){
        this.setState({
            blocks: this.state.blocks.map(block => (
                block.id !== blockId ? block : {
                    id: block.id,
                    term: block.term,
                    fields: block.fields.filter(field => field.id !== fieldId)
                }
            ))
        });
    }

    render() {

        return (
            
            <div className="search-block-list">

                {this.state.blocks.map((block, i) => (
                    <SearchBlock
                    key={block.id}
                    id={block.id}
                    fields={block.fields}
                    showRemoveButton={this.state.blocks.length > 1}
                    onAddField={this.addField}
                    onRemoveField={this.removeField}
                    onUpdateBlock={this.updateBlock}
                    onRemoveBlock={this.removeBlock}
                    grammarData={this.props.grammarData} />
                ))}

                <Row className={'search-block-list-controls' + (this.state.blocks.length >= 4 ? ' hidden' : '')}>
                    <Col span={1}>
                        <div
                        className={'search-block-add content-center'}
                        onClick={this.addBlock}>
                            <Icon type="plus"/>
                        </div>
                    </Col>
                </Row>

            </div>

        );
    }
}

export default SearchBlockList;