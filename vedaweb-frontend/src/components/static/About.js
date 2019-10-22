import React, { Component } from "react";
import { Row, Col } from 'antd';
import AboutContent from "./AboutContent";


class About extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        document.title = "VedaWeb | Rigveda online";

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">
                        <AboutContent/>
                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default About;