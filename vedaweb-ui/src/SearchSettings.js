import React, { Component } from "react";
import { Icon } from 'antd';

import SearchTransliteration from "./SearchTransliteration";
import SearchScope from "./SearchScope";

import './css/SearchSettings.css';


class SearchSettings extends Component {

    render() {

        return (
            <div id="search-settings">

                <div id="search-settings-title">
                    <Icon type="setting"/>&nbsp;&nbsp;&nbsp;Search Settings
                </div>

                <div id="search-settings-body">

                    <SearchTransliteration/>
                    {/* <SearchScope/> */}

                </div>
            </div>
        );

    }
}

export default SearchSettings;