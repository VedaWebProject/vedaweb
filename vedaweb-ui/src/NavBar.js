import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import logo from "./img/logo_white.png";
import "./NavBar.css";

class NavBar extends Component {

    render() {
        return (
            
            <Row
            type="flex"
            align="middle"
            className="navbar">

                <Col
                span={12}
                className="navbar-left">
                    <Icon
                    type="search"
                    onClick={this.props.onClickOpenSearchView}
                    className="navbar-icon-search"/>
                </Col>

                <Col
                span={12}
                className="navbar-right">
                    <span className="navbar-app-title">VedaWeb</span>
                    <img src={logo} className="navbar-logo" alt="" />
                </Col>

            </Row>
            
        );
    }
}

export default NavBar;