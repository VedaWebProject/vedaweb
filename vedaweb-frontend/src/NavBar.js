import React, { Component } from "react";
import { Icon, Menu } from 'antd';

import HelpButton from "./HelpButton";
import SearchSmart from "./SearchSmart";
import logo from "./img/logo.png";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";

import { view } from 'react-easy-state';

import { NavLink, withRouter } from 'react-router-dom';

const SubMenu = Menu.SubMenu;


class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            showFeedbackModal: false
        }
    }


    render() {

        const menuStyle = {
            backgroundColor: "transparent",
            borderBottom: "none"
        };

        return (
            
            <div id="navbar" className="box-shadow" >

                <NavLink to={"/home"} className="v-middle">
                    <img src={logo} className="navbar-logo" alt="" />
                    <div className="navbar-app-title">
                        <span className="bold">VedaWeb</span><br/>
                        Rigveda online
                    </div>
                </NavLink>

                <div style={{flex: '2', textAlign: 'center'}}>
                    <HelpButton inline type="quickSearch" style={{paddingRight: '1rem'}}/>
                    <SearchSmart /> 
                </div>

                <Menu
                selectedKeys={[]}
                mode="horizontal"
                style={menuStyle}
                onClick={() => {this.setState({showFeedbackModal: true})}}>

                    <SubMenu
                    title={<div className="content-center submenu-title-wrapper"><Icon type="book"/><br/>Browse Rigveda</div>}
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
                        <NavLink to={"/search"} className="content-center" activeClassName="selected">
                            <Icon type="zoom-in"/><br/>Advanced Search
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="home">
                        <NavLink to={"/home"} className="content-center" activeClassName="selected">
                            <Icon type="message"/><br/>Beta Feedback
                        </NavLink>
                    </Menu.Item>

                </Menu>

                {/* <FeedbackModal
                visible={this.state.showFeedbackModal}
                onCancel={() => this.setState({showFeedbackModal: false})} /> */}

            </div>
            
        );
    }
}

export default withRouter(view(NavBar));