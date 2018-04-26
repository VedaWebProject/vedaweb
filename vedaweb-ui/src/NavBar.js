import React, { Component } from "react";
import { Row, Col, Icon, Menu } from 'antd';

import SearchSimple from "./SearchSimple";
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
            className="navbar">

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

                <Col span={6}>
                    <SearchSimple active={true}/>
                </Col>

                <Col span={14}>
                    <Menu
                    onSelect={this.handleMenu}
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
                                <Menu.Item key={book.value}>
                                    <Link to={"/view/id/" + book.display + "00101"}>Book {book.display}</Link>
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