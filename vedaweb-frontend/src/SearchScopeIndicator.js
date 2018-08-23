import React, { Component } from "react";

import { view } from 'react-easy-state';
import searchMetaStore from "./stores/searchMetaStore";


class SearchScopeIndicator extends Component {

    render() {

        const scopes = searchMetaStore.scopes;

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

            /*
                <span>
                    { this.props.fromBook === 0 ? "all" :
                        ('0' + this.props.fromBook).slice(-2) + "." +
                        (this.props.fromHymn === 0 ? "001" : ('00' + this.props.fromHymn).slice(-3))
                    }
                    &nbsp;&rarr;&nbsp;
                    {  this.props.toBook === 0 ? "all" + (this.props.fromBook !== 0 ? " following" : "") :
                        ('0' + this.props.toBook).slice(-2) + 
                        (this.props.toHymn === 0 ? "" : "." + ('00' + this.props.toHymn).slice(-3))
                    }
                </span>
            */
        );
    }
}

export default view(SearchScopeIndicator);