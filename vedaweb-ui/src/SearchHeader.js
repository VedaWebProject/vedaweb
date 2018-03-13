import React, { Component } from "react";
import { Row, Col, Icon, Radio } from 'antd';

import './css/SearchHeader.css';

import { view } from 'react-easy-state';
import searchMetaStore from "./stores/searchMetaStore";

class SearchHeader extends Component {

    render() {

        return (
            <Row type="flex" align="middle">
                <Col span={1}>
                    <Icon type="search" className="bold"/>
                </Col>
                <Col span={23}>
                    <div className="content-center">
                        <Radio.Group
                        value={searchMetaStore.mode}
                        onChange={(e) => searchMetaStore.setSearchMode(e.target.value)}>
                            <Radio.Button value="simple">Simple</Radio.Button>
                            <Radio.Button value="advanced">Advanced</Radio.Button>
                        </Radio.Group>
                    </div>
                </Col>
            </Row>
        );

    }

}

export default view(SearchHeader);