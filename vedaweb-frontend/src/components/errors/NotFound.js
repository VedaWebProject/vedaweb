import React, { Component } from "react";
import { Row, Col } from 'antd';


class ContentView extends Component {

    render() {
        return (
            
            <Row className="page-content">
                <Col span={8} offset={8}>
                    <div className="card">
                        This page could not be found.
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;