import React, { Component } from "react";
import { Row, Icon, Menu } from 'antd';

import HelpButton from "./HelpButton";
import SearchSmart from "./SearchSmart";
import logo from "./img/logo.png";
import "./css/NavBar.css";

import searchMetaStore from "./stores/searchMetaStore";

import { view } from 'react-easy-state';

import { NavLink } from 'react-router-dom'

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
            borderBottom: "none",
            textAlign: "right",
            width: "99%"
        };

        return (
            
            <Row
            type="flex"
            align="middle"
            id="navbar"
            className="box-shadow">

                <NavLink to={"/home"} className="v-middle">
                    <img src={logo} className="navbar-logo" alt="" />
                    <div className="navbar-app-title">
                        <span className="bold">VedaWeb</span><br/>
                        Rigveda online
                    </div>
                </NavLink>

                <div className="flex-grow-1">
                    <SearchSmart /> 
                </div>

                <HelpButton type="quickSearch" style={{paddingLeft:'1rem'}} />

                <div className="flex-grow-2">
                    <Menu
                    selectedKeys={[]}
                    mode="horizontal"
                    style={menuStyle}
                    onClick={() => {this.setState({showFeedbackModal: true})}}>

                        <SubMenu
                        title={<div style={{textAlign: 'center'}}><Icon type="book"/><br/>Browse Rigveda</div>}
                        className="right">
                            {searchMetaStore.scopeDataRaw.map((hymns, i) => (
                                <Menu.Item key={'view_' + i}>
                                    <NavLink to={"/view/id/" + (i+1) + ".1.1"}>
                                        Book {('0' + (i+1)).slice(-2)} ({hymns} Hymns)
                                    </NavLink>
                                </Menu.Item>
                            ))}
                        </SubMenu>

                        <Menu.Item key="search">
                            <NavLink to={"/search"} style={{textAlign: 'center'}}>
                                <Icon type="zoom-in"/><br/>Advanced Search
                            </NavLink>
                        </Menu.Item>

                        {/* <Menu.Item
                        key="feedback">
                            <Icon type="message"/>Beta Feedback
                        </Menu.Item> */}

                    </Menu>
                </div>

                {/* <FeedbackModal
                visible={this.state.showFeedbackModal}
                onCancel={() => this.setState({showFeedbackModal: false})} /> */}

            </Row>
            
        );
    }
}

export default view(NavBar);