import React, { Component } from "react";
import { Grid, Image, Icon } from 'semantic-ui-react';
import logo from "./img/logo_white.png";
import "./NavBar.css";

class NavBar extends Component {

    render() {
        return (
            
            <Grid.Row className="navbar">
                <Grid.Column width="2" verticalAlign="middle">
                    <Icon
                    onClick={this.props.onOpenSearchViewClick}
                    name="search"
                    size="big"
                    className="icon-search"
                    link />
                </Grid.Column>

                <Grid.Column width="14" textAlign="right">
                    <span className="app-title">VedaWeb</span>
                    <Image src={logo} verticalAlign='middle' className="logo" />
                </Grid.Column>
            </Grid.Row>
            
        );
    }
}

export default NavBar;