import React, { Component } from "react";
import { Switch } from 'antd';

import "./css/ContentView.css";

class ContentViewFilterSwitch extends Component {

    render() {

        return (
            <div className={"view-filter" + (this.props.inline ? " inline-block gap-left" : "")}>
                <Switch
                defaultChecked
                onChange={this.props.onChange}
                disabled={this.props.disabled}
                checked={this.props.checked}
                size="small" />
                {this.props.label}
            </div>
        );
    }
}

export default ContentViewFilterSwitch;