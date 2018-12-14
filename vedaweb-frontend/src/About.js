import React, { Component } from "react";
import { Row, Col, Icon, Button } from 'antd';
import feedbackMailAddress from "./feedbackMailAddress.js";
import HelpButton from "./HelpButton";


class ContentView extends Component {

    render() {
        document.title = "VedaWeb | Rigveda online";

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">

                        <h4>About VedaWeb</h4>
                        <span className="secondary-font red">Project time frame: July 2017 - June 2020</span><br/>
                        <p>
                            This DFG-funded project provides a web-based, open-access platform in order to facilitate linguistic research on Old Indic texts.<br/>
                            The text corpus is made available in a digitally accessible as well as morphologically and metrically annotated form,
                            searchable for lexicographic and corpus-linguistic criteria. The pilot text is the Rigveda,
                            linked to the dictionaries available at Cologne Digital Sanskrit Dictionaries via the C-SALT APIs for Sanskrit Dictionaries.
                            The morphological annotation of the Rig-Veda was carried out at the Universität Zürich (UZH) and made available for the project.
                        </p>

                        <h3><Icon type="experiment"/> VedaWeb beta</h3>
                        <p>
                            This is a <strong>beta version</strong> for testing some of our planned concepts and getting feedback from potential users.<br/>
                            There are numerous things yet to be implemented, some of which are:<br/><br/>
                            <ul>
                                <li>Metric analysis (search and display)</li>
                                <li>Data export</li>
                                <li>Additional translations (Renou etc.)</li>
                                <li>Additional search modes</li>
                                <li>...</li>
                            </ul>
                            Look out for the <HelpButton type="start" inline/> buttons to get explanations of the different features.
                        </p>

                        <h3><Icon type="message"/> Feedback</h3>
                        <p>
                            Feel free to send us your <strong>feedback on functionality, usability and data correctness:</strong>
                            <br/><br/>
                            <Button
                            type="primary"
                            href={"mailto:" + feedbackMailAddress.mail + "?subject=VedaWeb beta feedback"}
                            className="secondary-font">
                                <Icon type="mail" /> {feedbackMailAddress.mail}
                            </Button>
                            <br/><br/>
                            Thank you for testing the <span className="secondary-font red bold">VedaWeb</span> beta!
                        </p>
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;