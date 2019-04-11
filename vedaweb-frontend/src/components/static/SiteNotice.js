import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';


class ContentView extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        document.title = "VedaWeb | Site Notice";

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">
                        <h1><Icon type="paper-clip"/> Site Notice</h1>
                        <p>
                            Generally, the <a href="https://www.portal.uni-koeln.de/impressum.html?L=1" target="_blank" rel="noopener noreferrer">site notice of the University of Cologne</a> (also 
                            available in <a href="https://www.portal.uni-koeln.de/impressum.html?L=0" target="_blank" rel="noopener noreferrer">German</a>)<br/>
                            applies to this project; with the specific additions stated below:
                        </p>

                        <h2>Responsible for the content of this website:</h2>
                        <p>
                            [Name]<br/>
                            [Dienstanschrift]<br/>
                            [E-Mail-Adresse]
                        </p>
                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default ContentView;