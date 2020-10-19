import React, { Component } from "react";
import stateStore from "../../stateStore";


class HtmlSnippet extends Component {

    constructor(props) {
        super(props);
        this.createMarkup = this.createMarkup.bind(this);
    }

    createMarkup(snippetId) {
        return {__html: stateStore.ui.snippets[snippetId] || ""};
    }

    render() {
        return (
                <div dangerouslySetInnerHTML={this.createMarkup(this.props.id)}></div>
        );
    }
}

export default HtmlSnippet;