import React, { Component } from "react";
import { Row, Col, Select } from 'antd';

import './css/SearchScope.css';

import { view } from 'react-easy-state';
import scopeStore from "./stores/scopeStore";

const Option = Select.Option;


class SearchScope extends Component {

    render() {

        const { fromBookRange, fromHymnRange, toBookRange, toHymnRange } = scopeStore.ranges;
        const { fromBook, fromHymn, toBook, toHymn } = scopeStore.scope;

        return (
           
            <div className="search-settings-category">
                <div className="bold bottom-gap     ">Search Scope:</div>

                <Row type="flex" align="middle" className="search-settings-row">

                    <Col span={5} className="content-right">
                        from book&nbsp;
                    </Col>

                    <Col span={8}>
                        <Select
                        value={fromBook}
                        defaultValue={0}
                        className="search-scope-select-book"
                        onSelect={(value, o) => scopeStore.updateFromBook(value)}>
                            <Option
                            key={'fromBook_all'}
                            value={0}>
                                {'all'}
                            </Option>
                            {fromBookRange.map((book, i) => (
                                <Option
                                key={'fromBook_' + book.display}
                                value={book.value}>
                                    {book.display}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={3} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={8}>
                        <Select
                        value={fromHymn}
                        defaultValue={0}
                        className="search-scope-select-book"
                        onSelect={(value, o) => scopeStore.updateFromHymn(value)}
                        disabled={fromBook === 0}>
                            <Option
                            key={'fromHymn_all'}
                            value={0}>
                                {'all'}
                            </Option>
                            {fromHymnRange.map((hymn) => (
                                <Option
                                key={'fromHymn_' + hymn.display}
                                value={hymn.value}>
                                    {hymn.display}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>

                <Row type="flex" align="middle">

                    <Col span={5} className="content-right">
                        to book&nbsp;
                    </Col>

                    <Col span={8}>
                        <Select
                        value={toBook}
                        defaultValue={0}
                        className="search-scope-select-book"
                        onSelect={(value, o) => scopeStore.updateToBook(value)}
                        disabled={fromBook === 0}>
                            <Option
                            key={'toBook_all'}
                            value={0}>
                                {'all'}
                            </Option>
                            {toBookRange.map((book) => (
                                <Option
                                key={'toBook_' + book.display}
                                value={book.value}>
                                    {book.display}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={3} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={8}>
                        <Select
                        value={toHymn}
                        defaultValue={0}
                        className="search-scope-select-book"
                        onSelect={(value, o) => scopeStore.updateToHymn(value)}
                        disabled={toBook === 0}>
                            <Option
                            key={'toHymn_all'}
                            value={0}>
                                {'all'}
                            </Option>
                            {toHymnRange.map((hymn) => (
                                <Option
                                key={'toHymn_' + hymn.display}
                                value={hymn.value}>
                                    {hymn.display}
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