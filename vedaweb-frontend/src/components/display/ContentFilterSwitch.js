import React, { Component } from "react";
import { Switch } from 'antd';

import "./ContentView.css";

class ContentViewFilterSwitch extends Component {

    render() {

        const switchStyle = {
            fontSize: this.props.size === 'small' ? '16px' : '22px',
            fontVariant: this.props.size === 'small' ? 'initial' : 'small-caps',
            paddingBottom: this.props.size === 'small' ? '0.2rem' : '0.3rem',
            paddingTop: this.props.size === 'small' ? '0' : '0.3rem',
            paddingLeft: this.props.size === 'small' ? '1rem' : '0',
            filter:'opacity(' + (this.props.disabled ? '0.7' : '1') + ')',
            whiteSpace: 'nowrap'
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
                    {this.props.label + (this.props.disabled ? ' - n/a for this stanza' : '')}
            </div>
        );
    }
}

export default ContentViewFilterSwitch;