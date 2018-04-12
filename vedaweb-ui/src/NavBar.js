import React, { Component } from "react";
import { Row, Col, Icon, Menu } from 'antd';

import SearchSimple from "./SearchSimple";
import logo from "./img/logo.png";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";
import appStateStore from "./stores/appStateStore";
import { view } from 'react-easy-state';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {

    constructor(props){
        super(props);
        this.handleMenu = this.handleMenu.bind(this);
    }

    handleMenu(e){
        if (e.key === "search"){
            this.props.onClickOpenSearchView();
        } else {
            appStateStore.view = e.key;
        }
    }

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
                span={5}
                className="content-left v-middle">
                    <img src={logo} className="navbar-logo" alt="" />
                    <div className="navbar-app-title">
                        <span className="bold">VedaWeb</span><br/>
                        Rigveda online
                    </div>
                </Col>

                <Col span={14}>
                    <Menu
                    onSelect={this.handleMenu}
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
                        <Menu.Item key="search">
                            <Icon type="search"/>
                            Advanced Search
                        </Menu.Item>
                    </Menu>
                </Col>

                <Col span={5}>
                    <SearchSimple active={true}/>
                </Col>

                {/**
                <Col span={2} className="content-right">
                    <Icon
                    type="search"
                    onClick={this.props.onClickOpenSearchView}
                    className="navbar-icon-search"/>
                </Col>
                */}

            </Row>
            
        );
    }
}

export default view(NavBar);