import React, { Component } from "react";
import { Grid, Image } from 'semantic-ui-react';

import logoCPDO from "./img/logo_cpdo.png";
import logoCSALT from "./img/logo_csalt.png";
import logoCSL from "./img/logo_csl.png";
import logoTCSL from "./img/logo_tcsl.png";

import "./Footer.css";

class Footer extends Component {

    render() {
        return (
            
            <Grid.Row className="footer" relaxed centered>
                <Grid.Column width="2" textAlign="center" verticalAlign='middle' className="footer-box">
                    <a href="http://blaaaa" target="_blank">
                        <Image src={logoCPDO} centered /><br/>
                        Dings
                    </a>
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" verticalAlign='middle' className="footer-box">
                    <Image src={logoCSALT} centered /><br/>
                    CSALT
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" verticalAlign='middle' className="footer-box">
                    <Image src={logoCSL} centered /><br/>
                    CSL
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" verticalAlign='middle' className="footer-box">
                    <Image src={logoTCSL} centered /><br/>
                    TCSL
                </Grid.Column>
            </Grid.Row>
            
        );
    }
}

export default Footer;