import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import SearchBlock from "./SearchBlock";

import './css/SearchBlockList.css'


class SearchBlockList extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchBlocks: [],
            searchData: []
        };

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
        this.updateSearchData = this.updateSearchData.bind(this);
    }

    componentDidMount(){
        this.addBlock();
    }

    addBlock(){
        var blockId = 'block_' + Date.now();
        this.setState({
            searchBlocks : this.state.searchBlocks.concat({'blockId': blockId})
        });
    }

    removeBlock(blockId){
        var searchBlocks = this.state.searchBlocks.filter(block => block.blockId !== blockId);
        
        this.setState({
            searchBlocks: searchBlocks
        });

        this.updateSearchData({blockId: blockId, blockData: []});
    }

    updateSearchData(blockData){
        var newSearchData = this.state.searchData.filter(b => b.blockId !== blockData.blockId);

        if (blockData.blockData.length > 0)
            newSearchData = newSearchData.concat(blockData);
        
        this.setState({
            searchData: newSearchData
        });

        this.props.onUpdateSearchData(newSearchData);
    }

    render() {
        return (
            
            <div className="search-block-list">

                {this.state.searchBlocks.map((block, i) => (
                        <SearchBlock
                        key={block.blockId}
                        blockId={block.blockId}
                        showRemoveButton={this.state.searchBlocks.length > 1}
                        onUpdateBlockData={this.updateSearchData}
                        grammarData={this.props.grammarData}
                        onClickRemove={this.removeBlock} />
                ))}

                <Row className={'search-block-list-controls' + (this.state.searchBlocks.length >= 4 ? ' hidden' : '')}>
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