import React, { Component } from "react";
import { Row, Col, Select, Button } from 'antd';

import './SearchScope.css';

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";

const Option = Select.Option;


class SearchScope extends Component {

    render() {

        const { fromBookRange, fromHymnRange, toBookRange, toHymnRange } = stateStore.search.meta.getRanges(this.props.scopeId);
        const { fromBook, fromHymn, toBook, toHymn } = stateStore.search.meta.getScopeSettings(this.props.scopeId);

        return (
           
            <Row type="flex" align="middle" className="top-gap bottom-gap-small">

                <Col span={4}>
                    <Select
                    showSearch
                    value={fromBook}
                    defaultValue={0}
                    className="search-scope-select-book"
                    onSelect={(value, o) => stateStore.search.meta.setScopeFromBook(this.props.scopeId, value)}>
                        <Option
                        key={'fromBook_all'}
                        value={0}>
                            {'all'}
                        </Option>
                        {fromBookRange.map((book, i) => (
                            <Option
                            key={'fromBook_' + book}
                            value={book}>
                                {('0' + (book)).slice(-2)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={4}>
                    <Select
                    showSearch
                    value={fromHymn}
                    defaultValue={0}
                    className="search-scope-select-book"
                    onSelect={(value, o) => stateStore.search.meta.setScopeFromHymn(this.props.scopeId, value)}
                    disabled={fromBook === 0}>
                        <Option
                        key={'fromHymn_all'}
                        value={0}>
                            {'all'}
                        </Option>
                        {fromHymnRange.map((hymn) => (
                            <Option
                            key={'fromHymn_' + hymn}
                            value={hymn}>
                                {('00' + (hymn)).slice(-3)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={2} className="content-center">&rarr;</Col>

                <Col span={4}>
                    <Select
                    showSearch
                    value={toBook}
                    defaultValue={0}
                    className="search-scope-select-book"
                    onSelect={(value, o) => stateStore.search.meta.setScopeToBook(this.props.scopeId, value)}
                    disabled={fromBook === 0}>
                        <Option
                        key={'toBook_all'}
                        value={0}>
                            {'all'}
                        </Option>
                        {toBookRange.map((book) => (
                            <Option
                            key={'toBook_' + book}
                            value={book}>
                                {('0' + (book)).slice(-2)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={4}>
                    <Select
                    showSearch
                    value={toHymn}
                    defaultValue={0}
                    className="search-scope-select-book"
                    onSelect={(value, o) => stateStore.search.meta.setScopeToHymn(this.props.scopeId, value)}
                    disabled={toBook === 0}>
                        <Option
                        key={'toHymn_all'}
                        value={0}>
                            {'all'}
                        </Option>
                        {toHymnRange.map((hymn) => (
                            <Option
                            key={'toHymn_' + hymn}
                            value={hymn}>
                                {('00' + (hymn)).slice(-3)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={2} offset={1} className="content-right">
                    <Button
                    disabled={!this.props.isRemovable}
                    onClick={() => stateStore.search.meta.removeScope(this.props.scopeId)}
                    icon="minus" />
                </Col>

                <Col span={2} className="content-right">
                    <Button
                    onClick={() => stateStore.search.meta.addScope()}
                    disabled={!this.props.isLastScope}
                    className={!this.props.isLastScope ? "hidden-button" : ""}
                    icon="plus" />
                </Col>

            </Row>
               
        );

    }
}

export default view(SearchScope);