import React from "react";
import { notification } from 'antd';
import logo from "./img/logo.png";

const showNote = function(title, text) {

    let key = Date.now();
    //let button = <Button onClick={() => notification.close(key)}>Close</Button>;
    let image = <img src={logo} style={{width: '32px'}} alt="" />;

    notification.open({
        key: key,
        message: <span className="bold red trans-font">{title}</span>,
        description: text,
        duration: 0,
        placement: "topLeft",
        icon: image,
        //btn: button,
        style: {
            width: "512px",
            border: "1px solid #931111"
        }
    });
}

export default showNote;