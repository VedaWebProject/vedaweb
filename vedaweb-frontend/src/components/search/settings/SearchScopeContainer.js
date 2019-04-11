import React, { Component } from "react";
import { Row, Col } from 'antd';

import SearchScope from './SearchScope';

import { view } from 'react-easy-state';
import stateStore from "../../../state/stateStore";



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
           
                {stateStore.search.meta.scopes.map((scope, i) => (
                    <SearchScope
                    key={'scope_' + scope.id}
                    scopeId={scope.id}
                    isRemovable={stateStore.search.meta.scopes.length > 1}
                    isLastScope={stateStore.search.meta.scopes.length < 4 && stateStore.search.meta.scopes.length === i + 1} />
                ))}

            </div>
               
        );
    }
}

export default view(SearchScopeContainer);