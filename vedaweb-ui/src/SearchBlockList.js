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
                    onRemoveBlock={this.removeBlock} />
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