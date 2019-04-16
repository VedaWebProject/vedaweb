import React, { Component } from "react";
import { Icon, Menu } from 'antd';

import SearchQuick from "../search/quick/SearchQuick";
//import logo from "./img/logo_beta.png";
import logo from "../../img/logo.svg";
import "./NavBar.css";

import stateStore from "../../stateStore";

import { view } from 'react-easy-state';

import { NavLink, withRouter } from 'react-router-dom';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {


    render() {

        const menuStyle = {
            backgroundColor: "transparent",
            borderBottom: "none",
            width: '100%'
        };

        return (
            
            <header className="box-shadow">

                <div style={{flexBasis:'content'}}>
                    <a href="/">
                        <img src={logo} id="header-logo" alt="" />
                    </a>
                    {/* <div className="header-app-title">
                        <span className="bold">VedaWeb</span>
                        <span className="bold grey" style={{fontSize: '12px'}}> beta</span><br/>
                        Rigveda online
                    </div> */}
                </div>

                <div
                style={{flexGrow:'1', textAlign:'center'}}
                data-tour-id="quick-search">
                    <SearchQuick /> 
                </div>

                <nav>
                    <Menu
                    selectedKeys={[]}
                    mode="horizontal"
                    style={menuStyle}>

                        <SubMenu
                        data-tour-id="nav-browse"
                        title={<div className="content-center submenu-title-wrapper"><Icon type="book"/><br/>Browse<br/>Rigveda</div>}
                        className="right">
                            {stateStore.ui.search.meta.scopes.map((hymns, i) => (
                                <Menu.Item key={'view:' + i}>
                                    <NavLink to={"/view/id/" + (i+1) + ".1.1"} activeClassName="selected">
                                        Book {('0' + (i+1)).slice(-2)} ({hymns} Hymns)
                                    </NavLink>
                                </Menu.Item>
                            ))}
                        </SubMenu>

                        <Menu.Item
                        data-tour-id="nav-search"
                        key="search">
                            <NavLink to={"/search"}
                            title="Grammar search and more..."
                            className="content-center"
                            activeClassName="selected">
                                <Icon type="zoom-in"/><br/>Advanced<br/>Search
                            </NavLink>
                        </Menu.Item>

                        <Menu.Item
                        key="betafeedback">
                            <NavLink to={"/betafeedback"}
                            title="Information on this beta version of VedaWeb"
                            className="content-center"
                            activeClassName="selected">
                                <Icon type="experiment"/><br/>Beta<br/>Feedback
                            </NavLink>
                        </Menu.Item>

                        <Menu.Item
                        data-tour-id="nav-tour"
                        key="tour"
                        className="content-center"
                        onClick={() => stateStore.settings.tour = true}>
                            <Icon type="notification"/><br/>Guided<br/>Tour
                        </Menu.Item>

                        {/* <Menu.Item key="about">
                            <a href="https://vedaweb.uni-koeln.de"
                            title="Open the VedaWeb project website"
                            className="content-center"
                            target="_blank"
                            rel="noopener noreferrer">
                                <Icon type="info-circle"/><br/>About<br/>VedaWeb
                            </a>
                        </Menu.Item> */}

                    </Menu>
                </nav>

            </header>
            
        );
    }
}

export default withRouter(view(NavBar));