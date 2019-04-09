import React, { Component } from "react";
import { Icon, Button } from 'antd';
import HelpButton from "./HelpButton";


class BetaInfoContent extends Component {

    render() {

        return (
            
            <div>

                <h4><Icon type="experiment"/> VedaWeb beta</h4>
                <p>
                    This is a <strong>beta version</strong> for testing some of our planned concepts and getting feedback from potential users.<br/>
                    There are numerous things yet to be implemented, some of which are:
                </p>
                <ul>
                    <li>Metric analysis (search and display)</li>
                    <li>Data export</li>
                    <li>Additional translations (Renou etc.)</li>
                    <li>Additional search modes</li>
                    <li>...</li>
                </ul>
                <p>
                    Look out for the <HelpButton type="start" inline/> buttons to get explanations of the different features.
                </p>

                <h3><Icon type="message"/> Feedback</h3>
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
                
            </div>

        );
    }
}

export default BetaInfoContent;