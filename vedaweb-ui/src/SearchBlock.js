import React, { Component } from "react";
import { Row, Col, Icon, Input } from 'antd';

import searchAdvancedStore from "./stores/searchAdvancedStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import SearchAttributeField from "./SearchAttributeField";
import TransliterationPreview from "./TransliterationPreview";

import './css/SearchBlock.css';


class SearchBlock extends Component {


    render() {

        return (

                <Row type="flex" align="middle" className="search-block">
                    
                    <Col span={1}>
                        <div
                        className={'search-block-tab content-center' + (!this.props.showRemoveButton ? ' hidden' : '')}
                        onClick={() => this.props.onRemoveBlock(this.props.id)}>
                            <Icon type="close"/>
                        </div>
                    </Col>

                    <Col span={23}>

                        <Row
                        type="flex"
                        align="middle"
                        justify="center">

                            <Col span={9}>
                                <Input
                                value={this.props.term}
                                onChange={e => searchAdvancedStore.updateTerm(this.props.id, e.target.value)}
                                placeholder="search term (optional)"
                                className="search-term-input"
                                style={{ width: '98%' }}
                                size="large" />
                            </Col>

                            <Col span={13}>
                                <TransliterationPreview
                                input={this.props.term}
                                transliteration={searchMetaStore.transliteration.setting}
                                placeholder="agnim" />
                            </Col>

                        </Row>

                        {this.props.fields.map((field, i) => (
                            <SearchAttributeField
                            key={field.id}
                            id={field.id}
                            parentBlockId={this.props.id}
                            fieldName={field.name}
                            fieldValue={field.value}
                            isRemovable={this.props.fields.length > 1}
                            isLastField={this.props.fields.length < 4 && this.props.fields.length === i + 1}
                            grammarData={this.props.grammarData} />
                        ))}

                    </Col>

                </Row>
            
        );
    }
}

export default view(SearchBlock);