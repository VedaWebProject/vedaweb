import React, { Component } from "react";
import { Icon, Button } from 'antd';
import HelpButton from "../widgets/HelpButton";


class AboutContent extends Component {

    render() {

        return (
            
            <div>
                <h1><Icon type="bulb"/> About VedaWeb</h1>
                <p>
                    Here you find information on the state of development and recent changes.
                </p>

                <h2><Icon type="experiment"/> The Beta</h2>
                <p>
                    This is a <strong>beta version</strong> for testing some of our planned concepts and getting feedback from potential users.<br/>
                    There are numerous things yet to be implemented, some of which are:
                </p>
                <ul>
                    <li>Metric analysis (search and display) <Icon type="check"/></li>
                    <li>Data export <Icon type="check"/></li>
                    <li>Additional translations (Renou etc.) <Icon type="check"/></li>
                    <li>Additional search modes</li>
                    <li>...</li>
                </ul>
                <p>
                    Look out for the <HelpButton type="start" inline/> buttons to get explanations of the different features.
                </p>

                <h2><Icon type="message"/> Feedback</h2>
                <p>
                    Feel free to send us your <strong>feedback on functionality, usability and data correctness:</strong>
                    <br/><br/>
                    <Button
                    type="primary"
                    href={"mailto:veda-web@uni-koeln.de?subject=VedaWeb beta feedback"}
                    className="secondary-font">
                        <Icon type="mail" /> veda-web@uni-koeln.de
                    </Button>
                    <br/><br/>
                    Thank you for testing the <span className="secondary-font red bold">VedaWeb</span> beta!
                </p>

                <h2><Icon type="issues-close"/> Recent Changes</h2>
                <ul>
                    <li>Added stanza types meta data based on metrical parse (2019/10/22)</li>
                    <li>Added this manual feature changelog (2019/10/22)</li>
                    <li>Improved RegEx functionality in Quick Search (2019/10/04)</li>
                    <li>Metrical data is now searchable via Metrical Search (2019/10/02)</li>
                    <li>Improved content navigation and data toggling controls (2019/08/28)</li>
                    <li>Display metrical parsing for different text versions (2019/08/19)</li>
                    <li>Open API documentation via SwaggerUI (2019/06/08)</li>
                    <li>Export functionality for search results (2019/06/08)</li>
                    <li>Improved condensed reading view (2019/06/06)</li>
                    <li>Additional grammar properties (CVB, DES, PREC) integrated into Grammar Search (2019/06/06)</li>
                    <li>Separate search fields for form and lemma in Grammar Search (2019/06/06)</li>
                    <li>Increased number of possible grammar properties in Grammar Search (2019/06/06)</li>
                    <li>...</li>
                </ul>
                
            </div>

        );
    }
}

export default AboutContent;