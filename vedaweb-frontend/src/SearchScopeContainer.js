import React, { Component } from "react";
import { Row, Col } from 'antd';

import SearchScope from './SearchScope';

import { view } from 'react-easy-state';
import searchMetaStore from "./stores/searchMetaStore";



class SearchScopeContainer extends Component {

    render() {
        return (

            <div>

                <Row type="flex" align="middle" className="bottom-gap-small">
                    <Col span={4}>Book</Col>
                    <Col span={4}>Hymn</Col>
                    <Col span={4} offset={2}>Book</Col>
                    <Col span={4}>Hymn</Col>
                </Row>
           
                {searchMetaStore.scopes.map((scope, i) => (
                    <SearchScope
                    key={'scope_' + scope.id}
                    scopeId={scope.id}
                    isRemovable={searchMetaStore.scopes.length > 1}
                    isLastScope={searchMetaStore.scopes.length < 4 && searchMetaStore.scopes.length === i + 1} />
                ))}

            </div>
               
        );
    }
}

export default view(SearchScopeContainer);