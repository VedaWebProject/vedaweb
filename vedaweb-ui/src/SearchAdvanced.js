import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import { view } from 'react-easy-state';
import searchAdvancedStore from "./stores/searchAdvancedStore";

import SearchBlock from "./SearchBlock";

import './css/SearchAdvanced.css'


class SearchAdvanced extends Component {

    constructor(props){
        super(props);

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentDidMount(){
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

        return (
            <div>
                { this.props.active &&
                
                    <div className="search-container search-block-list top-gap">

                        {data.blocks.map((block, i) => (
                            <SearchBlock
                            key={block.id}
                            id={block.id}
                            term={block.term}
                            distance={block.distance}
                            isFirstBlock={i === 0}
                            fields={block.fields}
                            showRemoveButton={data.blocks.length > 1}
                            onRemoveBlock={this.removeBlock} />
                        ))}

                        <Row
                        className={"search-block-list-controls" + (data.blocks.length >= 4 ? " hidden" : "")}
                        type="flex"
                        align="middle">
                            <Col span={1}>
                                <div
                                className={"search-block-add content-center"}
                                onClick={this.addBlock}>
                                    <Icon type="plus"/>
                                </div>
                            </Col>
                            <Col span={22} offset={1} className="translucent">
                                <Icon type="arrow-left"/>
                                Click here to add additional search terms
                            </Col>
                        </Row>

                    </div>

                }
            </div>
        );
    }
}

export default view(SearchAdvanced);