import React, { Component } from "react";
import { Icon } from 'antd';

class ErrorMessage extends Component {

    render() {

        return (

            <div className="card-nobox content-center secondary-font">
                <div className="inline-block content-left">
                    <Icon type="meh-o" className="gap-right" />
                    <b>There was an error requesting the data.</b>

                    <br/>
                    <br/>

                    <Icon type="info-circle-o" className="gap-right" />
                    This might be for one of the following reasons:

                    <br/>

                    <ul style={{"marginTop":"1rem"}}>
                        <li>You requested a document that doesn't exist</li>
                        <li>Someone gave you the URL to this page and you missed a few characters copying it</li>
                        <li>The syntax of your search request was invalid</li>
                        <li>There is some technical problem with our server</li>
                    </ul>

                    If this was an application error on our side, the problem will be reported automatically.
                </div>
            </div>

        );

    }

}

export default ErrorMessage;