import React, { Component } from "react";
import { Row, Col, Icon, Input, Slider, Checkbox, Tooltip } from 'antd';

import searchAdvancedStore from "./stores/searchAdvancedStore";
import searchMetaStore from "./stores/searchMetaStore";
import { view } from 'react-easy-state';

import SearchAttributeField from "./SearchAttributeField";
import TransliterationPreview from "./TransliterationPreview";

import './css/SearchBlock.css';


class SearchBlock extends Component {


    render() {

        const transliteration = (
            <TransliterationPreview
            input={this.props.term}
            transliteration={searchMetaStore.transliteration.setting}/>
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
                        className={this.props.isFirstBlock ? "hidden" : ""}>
                            <Col span={10} offset={1}>
                                <Checkbox
                                checked={this.props.distance > 0}
                                onChange={e => searchAdvancedStore.updateDistance(this.props.id, e.target.checked ? 1 : 0)}
                                disabled={this.props.isFirstBlock}>
                                    Maximum distance to previous term:&nbsp;
                                    {this.props.distance === 0 ? "all" : this.props.distance}
                                </Checkbox>
                            </Col>
                            <Col span={10}>
                                <Slider
                                value={this.props.distance}
                                defaultValue={0}
                                onChange={value => searchAdvancedStore.updateDistance(this.props.id, value)}
                                min={0}
                                max={5}
                                disabled={this.props.distance === 0}
                                className={this.props.distance === 0 ? "hidden" : ""} />
                            </Col>
                        </Row>

                        <Row
                        type="flex"
                        align="middle"
                        justify="center">

                            <Col span={18}>
                                <Tooltip
                                title={transliteration}
                                trigger="focus"
                                placement="top">
                                    <Input
                                    value={this.props.term}
                                    onChange={e => searchAdvancedStore.updateTerm(this.props.id, e.target.value)}
                                    placeholder="search term (optional)"
                                    className="search-term-input"
                                    size="large" />
                                </Tooltip>
                            </Col>

                            <Col span={4} className="content-right">
                                {/* ??? */}
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