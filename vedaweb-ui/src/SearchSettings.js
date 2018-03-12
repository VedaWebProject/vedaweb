import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

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
                    <Row gutter={16}>
                        <Col span={10}><SearchTransliteration/></Col>
                        <Col span={14}><SearchScope/></Col>
                    </Row>
                </div>
            </div>
        );

    }
}

export default SearchSettings;