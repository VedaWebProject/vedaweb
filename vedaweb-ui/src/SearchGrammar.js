import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import { view } from 'react-easy-state';
import searchGrammarStore from "./stores/searchGrammarStore";

import SearchBlock from "./SearchBlock";

import './css/SearchAdvanced.css'


class SearchGrammar extends Component {

    constructor(props){
        super(props);

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentDidMount(){
        if (searchGrammarStore.data.blocks.length === 0)
            this.addBlock();
    }

    addBlock(){
        searchGrammarStore.addBlock();
    }

    removeBlock(blockId){
        searchGrammarStore.removeBlock(blockId);
    }


    render() {

        const {data} = searchGrammarStore;

        return (
            <div className="search-container">
                <div className="search-block-list top-gap">

                    {data.blocks.map((block, i) => (
                        <SearchBlock
                        key={block.id}
                        id={block.id}
                        form={block.form}
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
            </div>
        );
    }
}

export default view(SearchGrammar);