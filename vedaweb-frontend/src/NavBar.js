import React, { Component } from "react";
import { Row, Col, Icon, Menu } from 'antd';

import SearchSmart from "./SearchSmart";
import logo from "./img/logo.png";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";

import { view } from 'react-easy-state';

import { Link } from 'react-router-dom'

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
            id="navbar"
            className="box-shadow">

                <Col
                span={4}
                className="content-left">
                    <Link to="/" className="v-middle">
                        <img src={logo} className="navbar-logo" alt="" />
                        <div className="navbar-app-title">
                            <span className="bold">VedaWeb</span><br/>
                            Rigveda online
                        </div>
                    </Link>
                </Col>

                <Col span={8}>
                    <SearchSmart />
                </Col>

                <Col span={12}>
                    <Menu
                    onSelect={this.handleMenu}
                    mode="horizontal"
                    style={menuStyle}>
                        <SubMenu title={<span><Icon type="book"/>View Book</span>}>
                            {searchMetaStore.scopeDataRaw.map((hymns, i) => (
                                <Menu.Item key={'nav_browse_' + i}>
                                    <Link to={"/view/id/" + (i+1) + ".1.1"}>
                                        Book {('0' + (i+1)).slice(-2)} ({hymns} Hymns)
                                    </Link>
                                </Menu.Item>
                            ))}
                        </SubMenu>
                        <Menu.Item key="search">
                            <Link to={"/search"}>
                                <Icon type="search"/>
                                Advanced Search
                            </Link>
                        </Menu.Item>
                    </Menu>
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