import React, { Component } from "react";
import { Row, Col, Icon, Button } from 'antd';

import logoCPDO from "../../img/logo_cpdo.png";
import logoCSALT from "../../img/logo_csalt.png";
import logoCSALTAPI from "../../img/logo_csalt_api.png";
import logoCSL from "../../img/logo_csl.png";
import logoTCSL from "../../img/logo_tcsl.png";

import logoVGSP from "../../img/logo_vgsp.png";
import logoHPCL from "../../img/logo_hpcl.png";
import logoDFG from "../../img/logo_dfg.png";
import logoDCH from "../../img/logo_dch.jpg";
import logoIDH from "../../img/logo_idh.png";
import logoCCEH from "../../img/logo_cceh.png";

import { Link } from 'react-router-dom';

import "./Footer.css";
import stateStore from "../../stateStore";
import HtmlSnippet from "../utils/HtmlSnippet";
import HelpButton from "../help/HelpButton";


class Footer extends Component {

    render() {
        return (

            <footer className="box-shadow">

                <Row
                type="flex"
                justify="space-around"
                align="top">

                    {/**
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
                     */}

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
                        <a href="https://www.phil.uni-wuerzburg.de/vgsp/startseite/"
                        title="Vergleichende Sprachwissenschaft, Universität Würzburg"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoVGSP} alt="VGSP Uni Würzburg"/><br/>
                            Vergleichende<br/>Sprachwissenschaft,<br/>Universität Würzburg
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://www.hpcl.uni-freiburg.de"
                        title="Hermann Paul Centrum für Linguistik, Universität Freiburg"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoHPCL} alt="HPCL Uni Freiburg"/><br/>
                            Hermann-Paul-<br/>Centrum für Linguistik,<br/>Universität Freiburg
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://gepris.dfg.de/gepris/projekt/329358806"
                        title="DFG Project Page"
                        className="bw"
                        target="_blank"
                        rel="noopener noreferrer">
                            <img src={logoDFG} alt="Gefördert durch die DFG"/><br/>
                            VedaWeb<br/>DFG-Projekt
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
                            C-SALT<br/>Portal
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://sanskrit-lexicon.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCSL} alt="" /><br/>
                            Cologne Sanskrit<br/>Lexicon
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="https://api.c-salt.uni-koeln.de/" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCSALTAPI} alt="" /><br/>
                            C-SALT APIs<br/>for Dictionaries
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="https://github.com/cceh/c-salt_dicts_schema" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoTCSL} alt="" /><br/>
                            C-SALT Sanskrit<br/>Dictionaries
                        </a>
                    </Col>

                    <Col span={3} className="footer-box">
                        <a href="http://cpd.uni-koeln.de" target="_blank" rel="noopener noreferrer">
                            <img className="bottom-gap" src={logoCPDO} alt="" /><br/>
                            Critical Pāli<br/>Dictionary Online
                        </a>
                    </Col>

                </Row>

                <Row className="top-gap">
                    <Col span={24} className="content-center">
                        <div style={{padding: '3rem 0'}}>
                            <Link to="/sitenotice"><Icon type="paper-clip"/> Site Notice</Link>
                            <span className="gap-left-big gap-right-big"></span>
                            <Link to="/privacypolicy"><Icon type="paper-clip"/> Privacy Policy</Link>
                        </div>
                    </Col>
                </Row>

                <Row type="flex" align="middle" justify="center" style={{marginBottom:"1rem"}}>
                    <Col span={12} className="content-center">
                        <HtmlSnippet id="footerCredits"/>
                    </Col>
                </Row>

                <Row>
                    <Col span={24} className="content-center">

                        <Button
                        href={process.env.PUBLIC_URL + "/"}
                        onClick={() => {
                            stateStore.clearStorage();
                            stateStore.settings.acceptedPrivacyHint = false;
                            alert("Local storage cleared!\n\nThe page will now reload with reset settings.");
                        }}>
                            <Icon type="delete"/> Delete locally stored settings
                        </Button>

                        <HelpButton type="clearLocalStorage" inline style={{marginLeft: "1rem"}}/>

                    </Col>
                </Row>

            </footer>
        );
    }
}

export default Footer;