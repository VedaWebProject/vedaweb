import React, { Component } from "react";
import { Spin, Icon } from 'antd';

class Footer extends Component {

    render() {
        const style = {
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "height" : "100%",
            "fontFamily": "Dosis, sans-serif",
            "color": "#931111"
        };

        return (
            
            <div style={style}>
                <Spin indicator={<Icon type="loading" spin style={{ fontSize: 28 }}/>} />
                <br/>
                Loading ...
            </div>
            
        );
    }
}

export default Footer;