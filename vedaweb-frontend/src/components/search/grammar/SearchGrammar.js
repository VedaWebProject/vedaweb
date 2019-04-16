import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";

import SearchBlock from "./SearchBlock";
import HelpButton from "../../widgets/HelpButton";

import './SearchGrammar.css'


class SearchGrammar extends Component {

    constructor(props){
        super(props);

        this.addBlock = this.addBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
    }

    componentDidMount(){
        if (stateStore.search.grammar.blocks.length === 0)
            this.addBlock();
    }

    addBlock(){
        stateStore.search.grammar.addBlock();
    }

    removeBlock(blockId){
        stateStore.search.grammar.removeBlock(blockId);
    }


    render() {

        const {blocks} = stateStore.search.grammar;

        return (
            <div className="search-container">
                <HelpButton type="grammarSearch" />
                <div className="search-block-list top-gap">

                    {blocks.map((block, i) => (
                        <SearchBlock
                        key={block.id}
                        id={block.id}
                        term={block.term}
                        lemma={block.lemma}
                        required={block.required}
                        distance={block.distance}
                        isFirstBlock={i === 0}
                        fields={block.fields}
                        showRemoveButton={blocks.length > 1}
                        onRemoveBlock={this.removeBlock} />
                    ))}

                    <Row
                    className={"search-block-list-controls" + (blocks.length >= 4 ? " hidden" : "")}
                    type="flex"
                    align="middle">
                        <Col span={1}>
                            <div
                            className={"search-block-add content-center"}
                            onClick={this.addBlock}>
                                <Icon type="plus"/>
                            </div>
                        </Col>
                        <Col span={23} className="secondary-font translucent font-big">
                            <Icon type="arrow-left" className="gap-left-big"/> Click here to add additional search terms
                        </Col>
                    </Row>

                </div>
            </div>
        );
    }
}

export default view(SearchGrammar);