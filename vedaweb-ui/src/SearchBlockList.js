import React, { Component } from "react";
import { Row, Col, Button } from 'antd';

import SearchBlock from "./SearchBlock";

import './SearchBlockList.css'


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

    removeBlock(b){
        //TODO update data
        this.setState({
            searchBlocks: this.state.searchBlocks.slice(0, -1)
        });
    }

    updateSearchData(blockData){
        var newSearchData = this.state.searchData.filter(b => b.blockId !== blockData.blockId).concat(blockData);
        
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
                        onUpdateBlockData={this.updateSearchData}
                        grammarData={this.props.grammarData} />
                ))}

                <Row
                type="flex"
                className="search-block-list-controls"
                align="middle"
                justify="center"
                gutter={32}>
                    <Col span={12} className="content-right"> 
                            <Button
                            onClick={this.addBlock}
                            disabled={!(this.state.searchBlocks.length < 4)}
                            icon="plus">
                                Add another search block
                            </Button>
                    </Col>

                    <Col span={12} className="content-left"> 
                        <Button
                        onClick={this.removeBlock}
                        disabled={!(this.state.searchBlocks.length > 1)}
                        icon="minus">
                            Remove one search block
                        </Button>
                    </Col>
                </Row>

            </div>

        );
    }
}

export default SearchBlockList;