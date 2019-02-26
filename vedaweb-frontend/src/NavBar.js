import React, { Component } from "react";
import { Icon, Menu } from 'antd';

import SearchSmart from "./SearchSmart";
//import logo from "./img/logo_beta.png";
import logo from "./img/logo.svg";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";

import { view } from 'react-easy-state';

import { NavLink, withRouter } from 'react-router-dom';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         showFeedbackModal: false
    //     }
    // }


    render() {

        const menuStyle = {
            backgroundColor: "transparent",
            borderBottom: "none",
            width: '100%'
        };

        return (
            
            <header className="box-shadow">

                <div style={{flexBasis:'content'}}>
                    <img src={logo} id="header-logo" alt="" />
                    {/* <div className="header-app-title">
                        <span className="bold">VedaWeb</span>
                        <span className="bold grey" style={{fontSize: '12px'}}> beta</span><br/>
                        Rigveda online
                    </div> */}
                </div>

                <div style={{flexGrow:'1', textAlign:'center'}}>
                    <SearchSmart /> 
                </div>

                <nav>
                    <Menu
                    selectedKeys={[]}
                    mode="horizontal"
                    //onClick={() => {this.setState({showFeedbackModal: true})}}
                    style={menuStyle}>

                        <SubMenu
                        title={<div className="content-center submenu-title-wrapper"><Icon type="book"/><br/>Browse<br/>Rigveda</div>}
                        className="right">
                            {searchMetaStore.scopeDataRaw.map((hymns, i) => (
                                <Menu.Item key={'view:' + i}>
                                    <NavLink to={"/view/id/" + (i+1) + ".1.1"} activeClassName="selected">
                                        Book {('0' + (i+1)).slice(-2)} ({hymns} Hymns)
                                    </NavLink>
                                </Menu.Item>
                            ))}
                        </SubMenu>

                        <Menu.Item key="search">
                            <NavLink to={"/search"}
                            title="Grammar search and more..."
                            className="content-center"
                            activeClassName="selected">
                                <Icon type="zoom-in"/><br/>Advanced<br/>Search
                            </NavLink>
                        </Menu.Item>

                        <Menu.Item key="home">
                            <NavLink to={"/betafeedback"}
                            title="Information on this beta version of VedaWeb"
                            className="content-center"
                            activeClassName="selected">
                                <Icon type="experiment"/><br/>Beta<br/>Feedback
                            </NavLink>
                        </Menu.Item>

                        <Menu.Item key="about">
                            <a href="https://vedaweb.uni-koeln.de"
                            title="Open the VedaWeb project website"
                            className="content-center"
                            target="_blank"
                            rel="noopener noreferrer">
                                <Icon type="info-circle"/><br/>About<br/>VedaWeb
                            </a>
                        </Menu.Item>

                    </Menu>
                </nav>

                {/* <FeedbackModal
                visible={this.state.showFeedbackModal}
                onCancel={() => this.setState({showFeedbackModal: false})} /> */}

            </header>
            
        );
    }
}

export default withRouter(view(NavBar));