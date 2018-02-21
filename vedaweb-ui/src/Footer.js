import React, { Component } from "react";
import { Row, Col } from 'antd';

import logoCPDO from "./img/logo_cpdo.png";
import logoCSALT from "./img/logo_csalt.png";
import logoCSL from "./img/logo_csl.png";
import logoTCSL from "./img/logo_tcsl.png";

import "./Footer.css";

class Footer extends Component {

    render() {
        return (
            
            <Row
            id="footer"
            type="flex"
            justify="center"
            align="top">

                <Col span={3} className="footer-box">
                    <a href="http://c-salt.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <img src={logoCSALT} alt="" /><br/><br/>
                        CSALT
                    </a>
                </Col>

                <Col span={3} className="footer-box">
                    <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <img src={logoCSL} alt="" /><br/><br/>
                        Cologne Sanskrit<br/>Lexicon
                    </a>
                </Col>

                <Col span={3} className="footer-box">
                    <a href="http://sanskrit-lexicon.uni-koeln.de/csl" target="_blank" rel="noopener noreferrer">
                        <img src={logoTCSL} alt="" /><br/><br/>
                        TEI Cologne Sanskrit<br/>Lexicon
                    </a>
                </Col>

                <Col span={3} className="footer-box">
                    <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                        <img src={logoCPDO} alt="" /><br/><br/>
                        Critical Pāli<br/>Dictionary Online
                    </a>
                </Col>

            </Row>
            
        );
    }
}

export default Footer;