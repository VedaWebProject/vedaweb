import React, { Component } from "react";

class Html extends Component {

    constructor(props) {
        super(props);
        this.createMarkup = this.createMarkup.bind(this);
    }

    createMarkup() {
        return { __html: this.props.html || "" };
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={this.createMarkup()}></div>
        );
    }
}

export default Html;