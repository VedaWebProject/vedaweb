import React, { Component } from "react";
import Html from "./Html";
import stateStore from "../../stateStore";

class HtmlSnippet extends Component {
    render() {
        return (
            <Html html={stateStore.ui.snippets[this.props.id]}></Html>
        );
    }
}

export default HtmlSnippet;