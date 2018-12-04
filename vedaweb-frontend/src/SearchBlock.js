import React, { Component } from "react";
import { Row, Col, Icon, Input, Tooltip, Select, Checkbox } from 'antd';

import searchGrammarStore from "./stores/searchGrammarStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import SearchAttributeField from "./SearchAttributeField";
import TransliterationPreview from "./TransliterationPreview";

import './css/SearchBlock.css';

const Option = Select.Option;

const distanceOptions = Array(10).fill(0).map((e, i) => (
    i === 0 ? "none" : i + " token" + (i > 1 ? "s" : "")
));


class SearchBlock extends Component {


    render() {

        const transliteration = (
            <TransliterationPreview
            input={this.props.form}
            transliteration={searchMetaStore.transliteration}/>
        );

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
                        justify="start">

                            <Col span={9} className="search-input-label content-right">
                                Word form / lemma:
                            </Col>

                            <Col span={9}>
                                <Tooltip
                                title={transliteration}
                                overlayClassName="transliteration-tooltip"
                                trigger="focus"
                                placement="bottom">
                                    <Input
                                    value={this.props.form}
                                    onChange={e => searchGrammarStore.setForm(this.props.id, e.target.value)}
                                    placeholder="(optional)"
                                    className="search-block-input" />
                                </Tooltip>
                            </Col>

                            <Col span={4} offset={1}>
                                <Checkbox
                                onChange={e => searchGrammarStore.setLemma(this.props.id, e.target.checked)}
                                checked={this.props.lemma} >
                                    Lemma
                                </Checkbox>
                            </Col>

                        </Row>

                        <Row
                        type="flex"
                        align="middle"
                        justify="start"
                        className={true || this.props.isFirstBlock ? "hidden" : ""}>
                            <Col span={9} className="search-input-label content-right">
                                <span className="secondary-font">Maximum distance to previous term:</span>
                            </Col>
                            <Col span={9} className="search-block-input">
                                <Select
                                value={this.props.distance}
                                onSelect={(value, o) => searchGrammarStore.updateDistance(this.props.id, value)}
                                disabled={this.props.isFirstBlock}
                                style={{ width: '100%' }} >
                                    {distanceOptions.map((e, i) => (
                                        <Option
                                        key={'distance_' + this.props.id + '_' + i}
                                        value={i}>{e}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={4}></Col>
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