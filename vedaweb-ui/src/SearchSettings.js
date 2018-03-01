import React, { Component } from "react";
import { Row, Col, Select, Icon } from 'antd';

import './SearchSettings.css';

const Option = Select.Option;


class SearchSettings extends Component {

    constructor(props){
        super(props);

        this.state = {
            fromBook: -1,
            toBook: -1,
            toBookRange: [],
            fromHymn: -1,
            fromHymnRange: [1,10],
            toHymn: -1,
            toHymnRange: [1,10],
            scoped: false
        };

        this.onChangeBookFrom = this.onChangeBookFrom.bind(this);
        this.onChangeBookTo = this.onChangeBookTo.bind(this);
        this.onChangeHymnFrom = this.onChangeHymnFrom.bind(this);
        this.onChangeHymnTo = this.onChangeHymnTo.bind(this);
    }

    onChangeBookFrom(value){
        let fromHymnRange = this.state.fromHymnRange;
        let toBookRange = [];

        for (let book of this.props.books){
            if (Number(book.id) === value){
                fromHymnRange = [1, book.hymns];
            }
            if (Number(book.id) >= value){
                toBookRange.push(book);
            }
        }

        this.setState({
            fromBook: value,
            fromHymn: -1,
            toBook: -1,
            toHymn: -1,
            scoped: value > -1,
            fromHymnRange: fromHymnRange,
            toBookRange: toBookRange
        });
    }

    onChangeBookTo(value){
        let toHymnRange = this.state.toHymnRange;

        for (let book of this.props.books){
            if (Number(book.id) === value){
                toHymnRange = [
                    (value === this.state.fromBook ? this.state.fromHymn : 1),
                    book.hymns
                ];
            }
        }

        this.setState({
            toBook: value,
            toHymn: -1,
            toHymnRange: toHymnRange
        });
    }

    onChangeHymnFrom(value){
        this.setState({
            fromHymn: value
        });
    }

    onChangeHymnTo(value){
        this.setState({
            toHymn: value
        });
    }

    componentDidUpdate(){
        let data = {};
        if (this.state.fromBook > -1) data.fromBook = this.state.fromBook;
        if (this.state.fromHymn > -1) data.fromHymn = this.state.fromHymn;
        if (this.state.toBook > -1) data.toBook = this.state.toBook;
        if (this.state.toHymn > -1) data.toHymn = this.state.toHymn;
        this.props.onSearchSettingsChanged(data);
    }


    render() {

        return (
            <div id="search-settings">

                <div id="search-settings-title">
                    <Icon type="setting"/>&nbsp;&nbsp;&nbsp;Search Scope
                </div>

                <div id="search-settings-body">

                    <Row type="flex" align="middle" className="search-settings-row">

                        <Col span={2} className="bold">
                            From:
                        </Col>

                        <Col span={2} className="content-right">
                            book:&nbsp;
                        </Col>

                        <Col span={4}>
                            <Select
                            onSelect={this.onChangeBookFrom}
                            defaultValue='all'
                            style={{ width: '95%' }} >
                                <Option
                                    key={'all_-1'}
                                    value={-1}>
                                        {'all'}
                                </Option>
                                {this.props.books.map((book, i) => (
                                    <Option
                                    key={'fromBook_' + book.id}
                                    value={Number(book.id)}>
                                        {book.id}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col span={3} className="content-right">
                            hymn:&nbsp;
                        </Col>

                        <Col span={4}>
                            <Select
                            onSelect={this.onChangeHymnFrom}
                            defaultValue={'all'}
                            key={'fromHymn' + this.state.fromBook + this.state.scoped}
                            disabled={!this.state.scoped}
                            style={{ width: '95%' }} >
                                <Option
                                    key={'all_-1'}
                                    value={-1}>
                                        {'all'}
                                </Option>
                                {[...Array(this.state.fromHymnRange[1])].map((x, i) => (
                                    <Option
                                    key={'fromHymn_' + i + this.state.fromHymnRange[0]}
                                    value={i + this.state.fromHymnRange[0]}>
                                        {("00" + (i + this.state.fromHymnRange[0])).slice(-3)}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                    </Row>

                    <Row type="flex" align="middle">

                        <Col span={2} className="bold">
                            To:
                        </Col>

                        <Col span={2} className="content-right">
                            book:&nbsp;
                        </Col>

                        <Col span={4}>
                            <Select
                            onSelect={this.onChangeBookTo}
                            defaultValue={'all'}
                            key={'toBook' + this.state.fromBook + this.state.scoped}
                            disabled={!this.state.scoped}
                            style={{ width: '95%' }} >
                                <Option
                                    key={'all_-1'}
                                    value={-1}>
                                        {'all'}
                                </Option>
                                {this.state.toBookRange.map((book, i) => (
                                    <Option
                                    key={'toBook_' + book.id}
                                    value={Number(book.id)}>
                                        {book.id}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col span={3} className="content-right">
                            hymn:&nbsp;
                        </Col>

                        <Col span={4}>
                            <Select
                            onSelect={this.onChangeHymnTo}
                            defaultValue={'all'}
                            key={'toHymn' + this.state.fromBook + this.state.toBook}
                            disabled={!this.state.scoped || this.state.toBook === -1}
                            style={{ width: '95%' }} >
                                <Option
                                    key={'all_-1'}
                                    value={-1}>
                                        {'all'}
                                </Option>
                                {[...Array(this.state.toHymnRange[1] - this.state.toHymnRange[0] + 1)].map((x, i) => (
                                    <Option
                                    key={'toHymn_' + i + this.state.toHymnRange[0]}
                                    value={i + this.state.toHymnRange[0]}>
                                        {("00" + (i + this.state.toHymnRange[0])).slice(-3)}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                    </Row>

                </div>
            </div>
        );

    }
}

export default SearchSettings;