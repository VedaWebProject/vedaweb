import React, { Component } from "react";


class SearchScopeIndicator extends Component {

    render() {

        return (
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
        );
    }
}

export default SearchScopeIndicator;