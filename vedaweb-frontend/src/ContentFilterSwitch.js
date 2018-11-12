import React, { Component } from "react";
import { Switch } from 'antd';

import "./css/ContentView.css";

class ContentViewFilterSwitch extends Component {

    render() {

        const switchStyle = {
            fontSize: this.props.size === 'small' ? '16px' : '20px',
            paddingTop: this.props.size === 'small' ? '0.2rem' : '0.5rem',
            paddingBottom: this.props.size === 'small' ? '0.2rem' : '0.5rem',
            paddingLeft: this.props.size === 'small' ? '1.05rem' : '0',
            filter:'opacity(' + (this.props.disabled ? '0.7' : '1') + ')'
        };

        return (
            <div
            className="view-filter"
            style={switchStyle}>
                <Switch
                defaultChecked
                style={{marginRight:'.8rem'}}
                onChange={this.props.onChange}
                disabled={this.props.disabled}
                checked={this.props.checked}
                size={this.props.size} />
                    {this.props.label + (this.props.disabled ? ' - missing' : '')}
            </div>
        );
    }
}

export default ContentViewFilterSwitch;