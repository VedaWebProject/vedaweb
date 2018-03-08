import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import { view } from 'react-easy-state';
import searchAdvancedStore from "./stores/searchAdvancedStore";

import SearchBlock from "./SearchBlock";

import './css/SearchBlockList.css'


class SearchBlockList extends Component {

    constructor(props){
        super(props);

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentWillMount(){
        this.addBlock();
    }

    addBlock(){
        searchAdvancedStore.addBlock();
    }

    removeBlock(blockId){
        searchAdvancedStore.removeBlock(blockId);
    }

    // componentDidUpdate(){
    //     //transform search block data into format expected by API
    //     let data = [];
    //     let countBlocks = 0;
        
    //     for (let block of this.state.blocks){
    //         let b = {};
    //         b['index'] = countBlocks++;
    //         if (block.term.length > 0) b['term'] = block.term;
    //         for (let field of block.fields){
    //             if (field.value.length > 0) b[field.name] = field.value;
    //         }
    //         if (Object.keys(b).length > 1) data.push(b);
    //     }
    //     this.props.onUpdate(data);
    // }


    render() {

        const {data} = searchAdvancedStore;
        console.log("FIELDS: " + JSON.stringify(data)); //DEBUG

        return (
            
            <div className="search-block-list">

                {data.blocks.map((block, i) => (
                    <SearchBlock
                    key={block.id}
                    id={block.id}
                    term={block.term}
                    fields={block.fields}
                    showRemoveButton={data.blocks.length > 1}
                    onRemoveBlock={this.removeBlock}
                    grammarData={this.props.grammarData} />
                ))}

                <Row className={'search-block-list-controls' + (data.blocks.length >= 4 ? ' hidden' : '')}>
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

export default view(SearchBlockList);