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
            
            <Grid.Row className="footer" centered>
                <Grid.Column width="2" textAlign="center" className="footer-box">
                    <a href="http://c-salt.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <Image src={logoCSALT} centered /><br/>
                        CSALT
                    </a>
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" className="footer-box">
                    <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <Image src={logoCSL} centered /><br/>
                        Cologne Sanskrit Lexicon
                    </a>
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" className="footer-box">
                    <a href="http://sanskrit-lexicon.uni-koeln.de/csl" target="_blank" rel="noopener noreferrer">
                        <Image src={logoTCSL} centered /><br/>
                        TEI Cologne Sanskrit Lexicon
                    </a>
                </Grid.Column>

                <Grid.Column width="2" textAlign="center" className="footer-box">
                    <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <Image src={logoCPDO} centered /><br/>
                        Critical Pāli Dictionary Online
                    </a>
                </Grid.Column>
            </Grid.Row>
            
        );
    }
}

export default Footer;