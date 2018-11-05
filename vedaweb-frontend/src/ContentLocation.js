import React, { Component } from "react";
import { Icon, Select } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { view } from 'react-easy-state';
import "./css/ContentLocation.css";

import mouseTrap from 'react-mousetrap';

import axios from 'axios';
import uiDataStore from "./stores/uiDataStore";

const Option = Select.Option;

class ContentLocation extends Component {

    constructor(props){
        super(props);
        this.state = {verseCount: 0, isLoaded: false, error: undefined};
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

        axios.get("/api/uidata/count/verses/" + this.props.book + "/" + this.props.hymn)
        .then((response) => {
            this.setState({
                verseCount: response.data.count,
                isLoaded: true,
                error: undefined
            });
        })
        .catch((error) => {
            this.setState({
                verseCount: 0,
                isLoaded: true,
                error: error
            });
        });
    }

    browseNext(){
        this.props.history.push("/view/index/" + (this.props.currIndex + 1));
    }

    browsePrevious(){
        this.props.history.push("/view/index/" + (this.props.currIndex - 1));
    }

    handleSelect(changed, value){
        let id;

        switch(changed){
            case "book":
                id = value + ".1.1";
                break;
            case "hymn":
                id = this.props.book + "." + value + ".1";
                break;
            case "verse":
                id = this.props.book + "." + this.props.hymn + "." + value;
                break;
            default:
                break;
        }

        console.log(id);
        this.props.history.push("/view/id/" + id);
    }

    render() {

        const {book, hymn, verse} = this.props;
        const bookCount = uiDataStore.search.meta.scopes.length;
        const hymnCount = uiDataStore.search.meta.scopes[book-1];
        const verseCount = this.state.verseCount;

        const selectStyle = {
            width: '80px',
            fontSize: '18px',
            fontWeight: 'bold'
        }

        return (

            <div className="inline-block">
                <Link to={"/view/index/" + (this.props.currIndex - 1)} className="location-controls">
                    <Icon type="left"/>
                </Link>

                <span className="location-display">

                    <Select
                    style={selectStyle}
                    showSearch
                    value={book}
                    onSelect={(v) => this.handleSelect("book", v)} >
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
                    onSelect={(v) => this.handleSelect("hymn", v)} >
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
                    value={verse}
                    onSelect={(v) => this.handleSelect("verse", v)} >
                        {Array(verseCount).fill(0).map((n, i) => (
                            <Option
                            key={'verse_' + i+1}
                            value={i+1}>
                                {('0' + (i+1)).slice(-2)}
                            </Option>
                        ))}
                    </Select>
                
                </span>

                <Link to={"/view/index/" + (this.props.currIndex + 1)} className="location-controls">
                    <Icon type="right"/>
                </Link>
            </div>
            
        );
    }
}

export default mouseTrap(withRouter(view(ContentLocation)));