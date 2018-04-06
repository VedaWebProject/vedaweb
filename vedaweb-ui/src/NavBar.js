import React, { Component } from "react";
import { Row, Col, Icon, Menu } from 'antd';

import logo from "./img/logo.png";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";
import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {

    render() {

        const menuStyle = {
            backgroundColor: "transparent",
            borderBottom: "none"
        };

        return (
            
            <Row
            type="flex"
            align="middle"
            className="navbar">

                <Col
                span={2}>
                    <Icon
                    type="search"
                    onClick={this.props.onClickOpenSearchView}
                    className="navbar-icon-search"/>
                </Col>

                <Col span={14}>
                    <Menu
                    onSelect={(e) => appStateStore.view = e.key}
                    selectedKeys={[appStateStore.view]}
                    mode="horizontal"
                    style={menuStyle}>
                        <Menu.Item key="about">
                            About
                        </Menu.Item>
                        <Menu.Item key="partners">
                            Partner Projects
                        </Menu.Item>
                        <SubMenu title={<span>Browse Rigveda</span>}>
                            {searchMetaStore.scope.data.map(book => (
                                <Menu.Item key={book.value}>Book {book.display}</Menu.Item>
                            ))}
                        </SubMenu>
                    </Menu>
                </Col>

                <Col
                span={8}
                className="content-right">
                    <span className="navbar-app-title">VedaWeb</span>
                    <img src={logo} className="navbar-logo" alt="" />
                </Col>

            </Row>
            
        );
    }
}

export default view(NavBar);