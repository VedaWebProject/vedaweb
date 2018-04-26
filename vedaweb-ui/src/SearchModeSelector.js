import React, { Component } from "react";
import { Button, Radio } from 'antd';

import showNote from "./Note";

import './css/SearchModeSelector.css';

import { view } from 'react-easy-state';
import searchMetaStore from "./stores/searchMetaStore";

class SearchModeSelector extends Component {

    constructor(props){
        super(props);
        this.showHelp = this.showHelp.bind(this);
    }

    showHelp(){
        showNote(
            "About VedaWeb's Search Modes",
            <p>This document describes the holy search modes as they were handed down for generations. There is a simple one and a more complex one. Choose from your options wisely.<br/>If these enlightened words are not verbose enough for you, please feel free to call our hotline: +49 221 S-A-N-S-K-R-I-T</p>
        );
    }

    render() {

        return (
            <div className="search-mode-selector">
                <Radio.Group
                value={searchMetaStore.mode}
                onChange={e => searchMetaStore.setSearchMode(e.target.value)}>
                    {/* <Radio.Button value="simple">Text Search</Radio.Button> */}
                    <Radio.Button value="advanced">Grammar Search</Radio.Button>
                </Radio.Group>
                <Button
                icon="question"
                onClick={this.showHelp}
                style={{marginLeft:"1rem"}}/>
            </div>
        );

    }

}

export default view(SearchModeSelector);