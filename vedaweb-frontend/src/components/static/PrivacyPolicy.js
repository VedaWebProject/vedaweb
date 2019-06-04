import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';


class ContentView extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        document.title = "VedaWeb | Privacy Policy";

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">
                        <h1><Icon type="paper-clip"/> Privacy Policy</h1>
                        <p>
                            Generally, the <a href="https://www.portal.uni-koeln.de/datenschutz.html?L=1" target="_blank" rel="noopener noreferrer">privacy policy of the University of Cologne</a> (also 
                            available in <a href="https://www.portal.uni-koeln.de/datenschutz.html?L=0" target="_blank" rel="noopener noreferrer">German</a>)<br/>
                            applies to this project; with the specific additions stated below:
                        </p>

                        <h2>Storage of application settings</h2>
                        <p>
                            The client application (or website) of VedaWeb saves part of your application settings in the local storage of your browser.
                            This ensures that you will find the same settings again when you use the application the next time and won't be presented with 
                            any kind of welcome message for first time visitors over and over again.<br/>
                            The data stored this way is no personal data and will not be stored on 
                            our servers but only on the device you use to visit this website.
                        </p>
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;