import React, { Component } from "react";
import { Row, Col, Select } from 'antd';

import './css/SearchScope.css';

import { view } from 'react-easy-state';
import searchScopeStore from "./stores/searchScopeStore";

const Option = Select.Option;


class SearchScope extends Component {

    render() {

        const { fromBookRange, fromHymnRange, toBookRange, toHymnRange } = searchScopeStore.scopeRanges;
        const { fromBook, fromHymn, toBook, toHymn } = searchScopeStore.scopeSettings;

        console.log(JSON.stringify(fromBookRange));

        return (
           
            <div className="search-settings-category">
                <div className="search-settings-category-title">Search Scope</div>

                <Row type="flex" align="middle" className="search-settings-row">

                    <Col span={3} className="content-right">
                        from book&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={fromBook}
                        defaultValue={'all'}
                        className="search-scope-select-book"
                        onSelect={(value, o) => searchScopeStore.updateFromBook(value)}
                        disabled={this.props.fromBookDisabled}>
                            <Option
                            key={'fromBook_all'}
                            value={''}>
                                {'all'}
                            </Option>
                            {fromBookRange.map((book, i) => (
                                <Option
                                key={'fromBook_' + book.id}
                                value={book.value}>
                                    {book.id}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={2} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={fromHymn}
                        defaultValue={'all'}
                        onSelect={this.onSelectFromHymn}
                        disabled={this.props.fromHymnDisabled}>
                            <Option
                            key={'fromHymn_all'}
                            value={''}>
                                {'all'}
                            </Option>
                            {fromHymnRange.map((hymn) => (
                                <Option
                                key={'fromHymn_' + hymn.id}
                                value={hymn.value}>
                                    {hymn.id}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>

                <Row type="flex" align="middle">

                    <Col span={3} className="content-right">
                        to book&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={toBook}
                        defaultValue={'all'}
                        className="search-scope-select-book"
                        onSelect={this.props.onSelectToBook}
                        disabled={this.props.toBookDisabled}>
                        <Option
                            key={'toBook_all'}
                            value={''}>
                                {'all'}
                            </Option>
                            {toBookRange.map((book, i) => (
                                <Option
                                key={'toBook_' + book.id}
                                value={toBookRange.value}>
                                    {book.id}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={2} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={toHymn}
                        defaultValue={'all'}
                        onSelect={this.onSelectToHymn}
                        disabled={this.props.toHymnDisabled}>
                            <Option
                            key={'toHymn_all'}
                            value={''}>
                                {'all'}
                            </Option>
                            {toHymnRange.map((hymn) => (
                                <Option
                                key={'toHymn_' + hymn.id}
                                value={hymn.value}>
                                    {hymn.id}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>

            </div>
               
        );

    }
}

export default view(SearchScope);