import React, { Component } from "react";
import { Icon, Menu } from 'antd';

import SearchQuick from "../search/quick/SearchQuick";
import logo from "../../img/logo.svg";
import "./NavBar.css";

import SearchSettings from "../search/settings/SearchSettings";

import stateStore from "../../stateStore";

import { view } from 'react-easy-state';

import { NavLink, withRouter } from 'react-router-dom';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {


    render() {

        return (
            
            <header className="box-shadow">

                <div style={{flexBasis:'content', alignSelf:"stretch"}}>
                    <div style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <a href="/">
                                <img src={logo} id="header-logo" alt="" />
                            </a>
                        </div>
                        
                        <nav style={{
                            flexBasis: "content",
                            textAlign: "left",
                            marginLeft: "-20px"
                        }}>
                            <Menu
                            selectedKeys={[]}
                            mode="horizontal"
                            style={{ backgroundColor: "transparent", borderBottom: "none" }}>

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
                                    title="Grammar search, metrical pattern/position search ..."
                                    className="content-center"
                                    activeClassName="selected">
                                        <Icon type="zoom-in"/><br/>Advanced<br/>Search
                                    </NavLink>
                                </Menu.Item>

                                <Menu.Item
                                key="about">
                                    <NavLink to={"/about"}
                                    title="Information about VedaWeb"
                                    className="content-center"
                                    activeClassName="selected">
                                        <Icon type="bulb"/><br/>About<br/>VedaWeb
                                    </NavLink>
                                </Menu.Item>

                                <Menu.Item
                                data-tour-id="nav-tour"
                                key="tour"
                                className="content-center"
                                onClick={() => stateStore.settings.tour = true}>
                                    <Icon type="notification"/><br/>Guided<br/>Tour
                                </Menu.Item>

                                <Menu.Item
                                data-tour-id="nav-help"
                                key="help">
                                    <NavLink to={"/help"}
                                    title="Help and instructions"
                                    className="content-center"
                                    activeClassName="selected">
                                        <Icon type="question-circle"/><br/>Help &amp;<br/>Instructions
                                    </NavLink>
                                </Menu.Item>

                            </Menu>
                        </nav>
                    </div>
                </div>

                <div
                style={{
                    flexBasis:'content',
                    marginLeft: '2rem'
                }} >

                    <div style={{width: "100%", display: "flex", justifyContent:"flex-end", alignItems:"center"}}>

                        <Icon
                        type="search"
                        className="gap-right"
                        style={{color:"#b4b1ae"}}/>

                        <div
                        data-tour-id="quick-search"
                        style={{
                            paddingLeft: '2rem',
                            borderLeft: "1px solid #b4b1ae",
                            borderRadius: "8px",
                            minWidth: '512px',
                            maxWidth: '512px'
                        }}>
                            <SearchQuick /> 
                        </div>
                    </div>

                    <div style={{width: "100%", display: "flex", justifyContent:"flex-end", alignItems:"center", marginTop: "1rem"}}>

                        <Icon
                        type="setting"
                        className="gap-right"
                        style={{color:"#b4b1ae"}}/>

                        <div
                        data-tour-id="general-search-settings"
                        style={{
                            paddingLeft: '2rem',
                            borderLeft: "1px solid #b4b1ae",
                            borderRadius: "8px",
                            minWidth: '512px',
                            maxWidth: '512px'
                        }}>

                            <SearchSettings/>
                        
                        </div>
                    </div>

                </div>
                    
            </header>
            
        );
    }
}

export default withRouter(view(NavBar));