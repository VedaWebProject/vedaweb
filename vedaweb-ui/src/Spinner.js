import React, { Component } from "react";
import { Spin, Icon } from 'antd';

class Footer extends Component {

    render() {
        const style = {
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "height" : "100%"
        };

        return (
            
            <div style={style}>
                <Spin indicator={<Icon type="loading" spin style={{ fontSize: 28 }}/>} />
            </div>
            
        );
    }
}

export default Footer;