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

    

    render() {

        return (
            <div className="search-mode-selector">
                <Radio.Group
                value={searchMetaStore.mode}
                onChange={e => searchMetaStore.setSearchMode(e.target.value)}>
                    {/* <Radio.Button value="simple">Text Search</Radio.Button> */}
                    <Radio.Button value="advanced">Grammar Search</Radio.Button>
                </Radio.Group>
                
            </div>
        );

    }

}

export default view(SearchModeSelector);