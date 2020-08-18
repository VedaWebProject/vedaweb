import React, { Component } from "react";
import { Icon, Row, Col } from 'antd';
import HelpButton from "../help/HelpButton";
import helpTexts from "./HelpTexts";

// filter and sort help texts by title
const helpTextsKeys = Object.keys(helpTexts).filter(k => 
        k !== "start"
    ).sort((a, b) => {
        if(helpTexts[a].title < helpTexts[b].title) { return -1; }
        if(helpTexts[a].title > helpTexts[b].title) { return 1; }
        return 0;
    });


class Help extends Component {

    render() {


        return (

            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">

                        <h1><Icon type="question-circle"/> Help &amp; Instructions</h1>

                        Throughout the page, you can find little help buttons like this one: <HelpButton type="start" inline/><br/>
                        These buttons provide help and instructions corresponding to the applications feature they are placed next to.
                        This page you see here displays an <em>automated view</em> of all these collected texts <em>in alphabetical order</em> so they
                        can be read at once to give an overview over the functionality of the VedaWeb platform.<br/><br/>

                        <p>
                            If you still think parts of the application are lacking appropriate explanation, feel free to contact us!
                            You can find a way to do so in the "About VedaWeb" section located in the main navigation at the top left.
                        </p>

                        <ul>
                            {helpTextsKeys.map(h => 
                                helpTexts.hasOwnProperty(h) &&
                                    <li key={"toc_" + h}>
                                        <a href={"#help-" + h}>
                                            {helpTexts[h].title}
                                        </a>
                                    </li>
                            )}
                        </ul>

                        <hr style={{margin:"2rem 0"}}/>

                        {helpTextsKeys.map(h => 
                            helpTexts.hasOwnProperty(h) &&
                                <div id={"help-" + h} key={"help_" + h}>
                                    <h3>{helpTexts[h].title}</h3>
                                    {helpTexts[h].content}
                                </div>
                        )}

                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default Help;