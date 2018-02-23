import React, { Component } from "react";
import { Row, Col, Button } from 'antd';

import SearchBlock from "./SearchBlock";

import './SearchBlockList.css'


class SearchBlockList extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchBlocks: []
        };

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentDidMount(){
        this.addBlock();
    }

    addBlock(){
        var bid = Date.now();
        this.setState({
            searchBlocks : this.state.searchBlocks.concat({'blockId': bid})
        });
    }

    removeBlock(b){
        this.setState({
            searchBlocks: this.state.searchBlocks.slice(0, -1)
        });
    }

    render() {
        return (
            
            <div className="search-block-list">

                {this.state.searchBlocks.map((block, i) => (
                        <SearchBlock
                        blockId={block.blockId}
                        key={block.blockId} />
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