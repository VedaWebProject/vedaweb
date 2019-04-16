import React, { Component } from "react";

import { view } from 'react-easy-state';
import stateStore from "../../../stateStore";


class SearchScopeIndicator extends Component {

    render() {

        const scopes = stateStore.search.meta.scopes;

        return (
            <span>
            {scopes.map((scope, i) => (
                <span key={'scope_i_' + scope.id}>
                    {i > 0 ? ' + [' : '['}
                    { scope.fromBook === 0 ? "all" :
                        ('0' + scope.fromBook).slice(-2) + "." +
                        (scope.fromHymn === 0 ? "001" : ('00' + scope.fromHymn).slice(-3))
                    }
                    &nbsp;&rarr;&nbsp;
                    {  scope.toBook === 0 ? "all" :
                        ('0' + scope.toBook).slice(-2) + 
                        (scope.toHymn === 0 ? "" : "." + ('00' + scope.toHymn).slice(-3))
                    }
                    {']'}
                </span>
            ))}
            </span>

        );
    }
}

export default view(SearchScopeIndicator);