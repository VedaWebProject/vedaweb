import React, { Component } from "react";
import { Input, Icon, Row, Col } from 'antd';
import HelpButton from "../help/HelpButton";
import Html from "../utils/Html";

import stateStore from "../../stateStore";
import { view } from 'react-easy-state';

const Search = Input.Search;

const excludeHelpTexts = [
    "start",
];

class Help extends Component {

    constructor(props){
        super(props);
        this.state = { filter: "" };
    }

    render() {

        const helpKeys = Object.keys(stateStore.ui.help).filter(k => 
            excludeHelpTexts.indexOf(k) < 0 &&
                (!this.state.filter || 
                    stateStore.ui.help[k].toLowerCase().includes(this.state.filter.toLowerCase()))
        ).sort((a, b) => {
            // compare help text titles for sorting 😎
            return ( (a, b) =>
                a.substr(0, Math.min(20, a.length))
                    .localeCompare(b.substr(0, Math.min(20, b.length)))
            )(stateStore.ui.help[a], stateStore.ui.help[b]);
        });

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
                        This page you see here displays an <em>automated view</em> of all these collected texts so they
                        can be read at once to give an overview over the functionality of the VedaWeb platform.<br/><br/>

                        <p>
                            If you still think parts of the application are lacking appropriate explanation, feel free to contact us!
                            You can find a way to do so in the "About VedaWeb" section located in the main navigation at the top left.
                        </p>

                        <Search
                        value={this.state.filter}
                        style={{marginTop: "2rem", marginBottom: "1rem", maxWidth: "280px"}}
                        onChange={e => this.setState({filter: e.target.value})}
                        size="default"
                        placeholder="Filter help texts by..." />

                        <br/>

                        <span className="light-grey">Help texts matching the filter: { helpKeys.length }</span>

                        {/* <ul>
                            {helpTextsKeys.map(h => 
                                stateStore.ui.help.hasOwnProperty(h) &&
                                    <li key={"toc_" + h}>
                                        <a href={"#help-" + h}>
                                            {stateStore.ui.help[h].title}
                                        </a>
                                    </li>
                            )}
                        </ul> */}

                        

                        {helpKeys.map(h => 
                            <div key={h}>
                                <hr style={{margin:"2rem 0"}}/>
                                <div id={"help-" + h} key={"help_" + h}>
                                    <Html html={stateStore.ui.help[h]} />
                                </div>
                            </div>
                        )}

                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default view(Help);