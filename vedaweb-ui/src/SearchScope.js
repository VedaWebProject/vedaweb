import React, { Component } from "react";
import { Row, Col, Select, Icon } from 'antd';

import './css/SearchScope.css';

const Option = Select.Option;


class SearchScope extends Component {

    constructor(props){
        super(props);
    }


    render() {

        const fromBookRange = this.props.books.map((x, i) => (
            {
                "name": ("0" + i).slice(-2),
                "value": i
            }
        ));

        const fromHymnRange = Array(this.props.books[this.props.fromBook]).map((x, i) => (
            {
                "name": ("00" + i).slice(-3),
                "value": i
            }
        ));

        const toBookRange = Array(this.props.books.length - this.props.fromBook).map((x, i) => (
            {
                "name": ("0" + i + this.props.fromBook).slice(-2),
                "value": i + this.props.fromBook
            }
        ));

        const toHymnRange = Array(this.props.books[this.props.fromBook] - this.props.fromHymn).map((x, i) => (
            {
                "name": ("00" + i + this.props.fromHymn).slice(-3),
                "value": i + this.props.fromHymn
            }
        ));

        return (
           
            <div className="search-settings-category">
                <div className="search-settings-category-title">Search Scope</div>

                <Row type="flex" align="middle" className="search-settings-row">

                    <Col span={3} className="content-right">
                        from book&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={this.props.fromBook}
                        className="search-scope-select-book"
                        onSelect={this.props.onSelectFromBook}
                        disabled={this.props.fromBookDisabled}>
                            {fromBookRange.map((book, i) => (
                                <Option
                                key={'fromBook_' + book.name}
                                value={book.value}>
                                    {book.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={2} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={this.props.fromHymn}
                        onSelect={this.onSelectFromHymn}
                        disabled={this.props.fromHymnDisabled}>
                            {fromHymnRange.map((hymn) => (
                                <Option
                                key={'fromHymn_' + hymn.name}
                                value={hymn.value}>
                                    {hymn.name}
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
                        value={this.props.toBook}
                        className="search-scope-select-book"
                        onSelect={this.props.onSelectToBook}
                        disabled={this.props.toBookDisabled}>
                            {toBookRange.map((book, i) => (
                                <Option
                                key={'toBook_' + book.name}
                                value={toBookRange.value}>
                                    {book.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={2} className="content-right">
                        hymn&nbsp;
                    </Col>

                    <Col span={4}>
                        <Select
                        value={this.props.toHymn}
                        onSelect={this.onSelectToHymn}
                        disabled={this.props.toHymnDisabled}>
                            {toHymnRange.map((hymn) => (
                                <Option
                                key={'toHymn_' + hymn.name}
                                value={hymn.value}>
                                    {hymn.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>

            </div>
               
        );

    }
}

export default SearchScope;