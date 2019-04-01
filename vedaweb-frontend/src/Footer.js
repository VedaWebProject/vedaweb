import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';

import logoCPDO from "./img/logo_cpdo.png";
import logoCSALT from "./img/logo_csalt.png";
import logoCSALTAPI from "./img/logo_csalt_api.png";
import logoCSL from "./img/logo_csl.png";
import logoTCSL from "./img/logo_tcsl.png";

import logoASW from "./img/logo_ifl_asw.jpg";
import logoHVS from "./img/logo_ifl_hvs.jpg";

import logoDFG from "./img/logo_dfg.png";
import logoDCH from "./img/logo_dch.jpg";
import logoIDH from "./img/logo_idh.png";
import logoCCEH from "./img/logo_cceh.png";

import { Link } from 'react-router-dom';

import "./css/Footer.css";

class Footer extends Component {

    render() {
        return (

            <footer className="box-shadow">

                <Row
                type="flex"
                justify="space-around"
                align="top">

                    <Col span={3} className="footer-box">
                        <a href="http://ifl.phil-fak.uni-koeln.de/asw2.html"
                        title="Allgemeine Sprachwissenschaft (IfL), Universität zu Köln"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoASW} alt="Allgemeine Sprachwissenschaft (IfL), Universität zu Köln"/><br/>
                            Allgemeine<br/>Sprachwissenschaft (IfL),<br/>Universität zu Köln
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://ifl.phil-fak.uni-koeln.de/hvs2.html"
                        title="Historisch-Vergleichende Sprachwissenschaft (IfL), Universität zu Köln"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoHVS} alt="Historisch-Vergleichende Sprachwissenschaft (IfL), Universität zu Köln"/><br/>
                            Historisch-Vergleichende<br/>Sprachwissenschaft (IfL),<br/>Universität zu Köln
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://dh.uni-koeln.de/"
                        title="Institut für Digital Humanities, Universität zu Köln"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoIDH} alt="IDH"/><br/>
                            Institut für<br/>Digital Humanities,<br/>Universität zu Köln
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://cceh.uni-koeln.de/"
                        title="Cologne Center for eHumanities, Universität zu Köln"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoCCEH} alt="CCEH"/><br/>
                            Cologne Center<br/>for eHumanities,<br/>Universität zu Köln
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://dch.phil-fak.uni-koeln.de/"
                        title="Data Center for the Humanities, Universität zu Köln"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoDCH} alt="DCH"/><br/>
                            Data Center<br/>for the Humanities,<br/>Universität zu Köln
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://gepris.dfg.de/gepris/projekt/329358806"
                        title="DFG Project Page"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoDFG} alt="Gefördert durch die DFG"/><br/>
                            VedaWeb DFG-Projekt
                        </a>
                    </Col>
                </Row>

                <Row
                type="flex"
                justify="center"
                align="top"
                className="bottom-gap"
                style={{"marginTop": "5rem"}}>

                    <Col span={3} className="footer-box">
                        <a href="http://c-salt.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCSALT} alt="" /><br/>
                            C-SALT
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCSL} alt="" /><br/>
                            Cologne Sanskrit<br/>Lexicon
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://sanskrit-lexicon.uni-koeln.de/csl" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoTCSL} alt="" /><br/>
                            TEI Cologne Sanskrit<br/>Lexicon
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCPDO} alt="" /><br/>
                            Critical Pāli<br/>Dictionary Online
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="https://api.c-salt.uni-koeln.de/" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCSALTAPI} alt="" /><br/>
                            C-SALT APIs<br/>for Dictionaries
                        </a>
                    </Col>
                </Row>

                <Row className="top-gap">
                    <Col span={24} className="content-center">
                        <div style={{padding: '3rem 0'}}>
                            <Link to="/legal"><Icon type="paper-clip"/>Legal Notice</Link>
                            <span className="gap-left-big gap-right-big"></span>
                            <Link to="/privacy"><Icon type="paper-clip"/>Privacy Notice</Link>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24} className="content-center">
                        <p className="content-center font-small light-grey">
                            VedaWeb, ed. by Daniel Kölligan and Uta Reinöhl,<br/>
                            in collaboration with Jakob Halfmann, Börge Kiss, Natalie Korobzow,<br/>Francisco Mondaca, Claes Neuefeind, Felix Rau and Patrick Sahle,<br/>
                            with material provided by Paul Widmer et al. Cologne: University of Cologne 2018.
                        </p>
                    </Col>
                </Row>

            </footer>
        );
    }
}

export default Footer;