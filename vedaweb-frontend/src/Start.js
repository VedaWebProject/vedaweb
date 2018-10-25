import React, { Component } from "react";
import { Row, Col, Icon, Button } from 'antd';
import feedbackMailAddress from "./feedbackMailAddress.js";


class ContentView extends Component {

    render() {
        document.title = "VedaWeb | Rigveda online";

        return (
            
            <Row className="page-content">
                <Col span={24}>
                    <div className="card">
                        <h4><Icon type="experiment"/> VedaWeb beta</h4>
                        <span className="secondary-font red">Project time frame: July 2017 - June 2020</span><br/><br/>
                        <div>
                            This is a beta version for testing some of our planned concepts and getting feedback from potential users.<br/>
                            There are numerous things yet to be implemented, some of which are:<br/><br/>
                            <ul>
                                <li>Metric analysis (search and display)</li>
                                <li>Data export</li>
                                <li>Additional translations (Renou etc.)</li>
                                <li>Additional search modes</li>
                                <li>...</li>
                            </ul>
                            Look out for the <Icon type="question-circle" theme="outlined"/> icon to get explanations of the different features.<br/>
                            Feel free to send us your <strong>feedback on functionality, usability and data correctness:</strong>
                            <br/><br/>
                            <Button
                            type="primary"
                            href={"mailto:" + feedbackMailAddress.mail + "?subject=VedaWeb beta feedback"}
                            className="secondary-font">
                                <Icon type="mail"/> {feedbackMailAddress.mail}
                            </Button>
                            <br/><br/>
                            Thank you for testing the <span className="secondary-font red bold">VedaWeb</span> beta!
                            <br/><br/>
                        </div>
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;