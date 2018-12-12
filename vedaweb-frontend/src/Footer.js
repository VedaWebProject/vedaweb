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

            <div id="footer">
            
                <Row
                type="flex"
                justify="center"
                align="top">

                    <Col span={3} className="footer-box">
                        <a href="http://c-salt.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <div className="footer-box">
                                <img src={logoCSALT} alt="" /><br/><br/>
                                C-SALT
                            </div>
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <div className="footer-box">
                                <img src={logoCSL} alt="" /><br/><br/>
                                Cologne Sanskrit<br/>Lexicon
                            </div>
                        </a>
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
                        <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <div className="footer-box">
                                <img src={logoCPDO} alt="" /><br/><br/>
                                Critical Pāli<br/>Dictionary Online
                            </div>
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="https://api.c-salt.uni-koeln.de/" target="_blank" rel="noopener noreferrer">
                            <div className="footer-box">
                                <img src={logoCSALTAPI} alt="" /><br/><br/>
                                C-SALT APIs<br/>for Dictionaries
                            </div>
                        </a>
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

                <Row>
                    <Col span={24} className="content-center">
                        <p className="top-gap content-center font-small light-grey">
                            VedaWeb, ed. by Daniel Kölligan and Uta Reinöhl,<br/>
                            in collaboration with Jakob Halfmann, Börge Kiss, Natalie Korobzow,<br/>Francisco Mondaca, Claes Neuefeind, Felix Rau and Patrick Sahle,<br/>
                            with material provided by Paul Widmer et al. Cologne: University of Cologne 2018.
                        </p>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default Footer;