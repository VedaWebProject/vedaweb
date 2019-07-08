import React, { Component } from "react";
import { Icon, Select } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { view } from 'react-easy-state';
import "./ContentLocation.css";

import mouseTrap from 'react-mousetrap';

import axios from 'axios';
import stateStore from "../../stateStore";

const Option = Select.Option;

class ContentLocation extends Component {

    constructor(props){
        super(props);
        this.state = {stanzaCount: 0, isLoaded: false, error: undefined};
        this.browseNext = this.browseNext.bind(this);
        this.browsePrevious = this.browsePrevious.bind(this);
    }

    

    componentWillUnmount(){
        this.props.unbindShortcut('right');
        this.props.unbindShortcut('left');
    }

    componentDidMount(){
        this.props.bindShortcut('right', this.browseNext);
        this.props.bindShortcut('left', this.browsePrevious);

        if (this.props.book !== undefined && this.props.hymn !== undefined){
            axios.get(process.env.PUBLIC_URL + "/api/uidata/count/stanzas/" + this.props.book + "/" + this.props.hymn)
            .then((response) => {
                this.setState({
                    stanzaCount: response.data.count,
                    isLoaded: true,
                    error: undefined
                });
            })
            .catch((error) => {
                this.setState({
                    stanzaCount: 0,
                    isLoaded: true,
                    error: error
                });
            });
        }
    }

    browseNext(){
        this.props.history.push("/view/index/" + (this.props.currIndex + 1));
    }

    browsePrevious(){
        this.props.history.push("/view/index/" + (this.props.currIndex - 1));
    }

    handleSelect(book, hymn, stanza){
        this.props.history.push("/view/id/" + book + "." + hymn + "." + stanza);
    }

    render() {

        const {book, hymn, stanza} = this.props;
        const bookCount = stateStore.ui.search.meta.scopes.length;
        const hymnCount = stateStore.ui.search.meta.scopes[book-1];
        const stanzaCount = this.state.stanzaCount;

        //const { hymnAbs } = this.props;
        //const hymnAbsValues = stateStore.ui.search.meta.hymnAbs;

        const selectStyle = {
            fontSize: '26px',
            width: '90px',
            color: '#931111',
            textAlign: 'center'
        }

        return (
            this.props.book !== undefined && this.props.hymn !== undefined &&
                <div className="inline-block location-display" data-tour-id="content-location">
                    <Link
                    to={"/view/index/" + (this.props.currIndex - 1)}
                    className="location-controls gap-right">
                        <Icon type="left"/>
                    </Link>

                    <Select
                    style={selectStyle}
                    showSearch
                    value={book}
                    onSelect={(v) => this.handleSelect(v, 1, 1)} >
                        {Array(bookCount).fill(0).map((n, i) => (
                            <Option
                            key={'book_' + i+1}
                            value={i+1}>
                                {('0' + (i+1)).slice(-2)}
                            </Option>
                        ))}
                    </Select>
                    .
                    <Select
                    style={selectStyle}
                    showSearch
                    value={hymn}
                    onSelect={(v) => this.handleSelect(this.props.book, v, 1)} >
                        {Array(hymnCount).fill(0).map((n, i) => (
                            <Option
                            key={'hymn_' + i+1}
                            value={i+1}>
                                {('00' + (i+1)).slice(-3)}
                            </Option>
                        ))}
                    </Select>
                    .
                    <Select
                    style={selectStyle}
                    showSearch
                    value={stanza}
                    onSelect={(v) => this.handleSelect(this.props.book, this.props.hymn, v)} >
                        {Array(stanzaCount).fill(0).map((n, i) => (
                            <Option
                            key={'stanza_' + i+1}
                            value={i+1}>
                                {('0' + (i+1)).slice(-2)}
                            </Option>
                        ))}
                    </Select>
                    
                    <Link
                    to={"/view/index/" + (this.props.currIndex + 1)}
                    className="location-controls gap-left">
                        <Icon type="right"/>
                    </Link>
                    
                    {/*
                    <Select
                    style={selectStyle}
                    showSearch
                    value={hymnAbs}
                    onSelect={(v) => this.handleSelect("hymnAbs", v)} >
                        {hymnAbsValues.map(v => (
                            <Option
                            key={'hymnAbs_' + v}
                            value={v}>
                                {v}
                            </Option>
                        ))}
                    </Select>
                    */}

                </div>
            
        );
    }
}

export default mouseTrap(withRouter(view(ContentLocation)));