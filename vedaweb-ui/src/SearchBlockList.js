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

                <Row className="search-block-list-controls" align="middle">
                    <Col span={2}> 
                        {this.state.searchBlocks.length < 4 &&
                            <Button onClick={this.addBlock} icon="plus" />
                        }
                    </Col>

                    <Col span={2}> 
                        {this.state.searchBlocks.length > 1 &&
                            <Button onClick={this.removeBlock} icon="minus" />
                        }
                    </Col>
                </Row>

            </div>

        );
    }
}

export default SearchBlockList;