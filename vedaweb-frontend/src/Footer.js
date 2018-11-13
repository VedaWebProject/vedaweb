import React, { Component } from "react";
import { Row, Col } from 'antd';

import logoCPDO from "./img/logo_cpdo.png";
import logoCSALT from "./img/logo_csalt.png";
import logoCSALTAPI from "./img/logo_csalt_api.png";
import logoCSL from "./img/logo_csl.png";
import logoTCSL from "./img/logo_tcsl.png";

import { Link } from 'react-router-dom';

import "./css/Footer.css";

class Footer extends Component {

    render() {
        return (

            <div id="footer" className="box-shadow">
            
                <Row
                type="flex"
                justify="center"
                align="top">

                    <Col span={3} className="footer-box">
                        <div className="footer-box">
                            <a href="http://c-salt.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                                <img src={logoCSALT} alt="" /><br/><br/>
                                C-SALT
                            </a>
                        </div>
                    </Col>

                    <Col span={3} className="footer-box">
                        <div className="footer-box">
                            <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                                <img src={logoCSL} alt="" /><br/><br/>
                                Cologne Sanskrit<br/>Lexicon
                            </a>
                        </div>
                    </Col>

                    <Col span={3}>
                        <a href="http://sanskrit-lexicon.uni-koeln.de/csl" target="_blank" rel="noopener noreferrer">
                            <div className="footer-box">
                                <img src={logoTCSL} alt="" /><br/><br/>
                                TEI Cologne Sanskrit<br/>Lexicon
                            </div>
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <div className="footer-box">
                            <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                                <img src={logoCPDO} alt="" /><br/><br/>
                                Critical Pāli<br/>Dictionary Online
                            </a>
                        </div>
                    </Col>

                    <Col span={3} className="footer-box">
                        <div className="footer-box">
                            <a href="https://cceh.github.io/m-salt-api/api.html" target="_blank" rel="noopener noreferrer">
                                <img src={logoCSALTAPI} alt="" /><br/><br/>
                                C-SALT APIs<br/>for Dictionaries
                            </a>
                        </div>
                    </Col>

                </Row>

                <Row className="top-gap">
                    <Col span={24} className="content-center">
                        <div style={{padding: '3rem 0'}}>
                            <Link to="/legal">Legal Notice</Link>
                            <span className="gap-left-big gap-right-big">&#8213;</span>
                            <Link to="/privacy">Privacy Notice</Link>
                        </div>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default Footer;