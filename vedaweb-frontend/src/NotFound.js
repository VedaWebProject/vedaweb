import React, { Component } from "react";
import { Row, Col } from 'antd';


class ContentView extends Component {

    render() {
        return (
            
            <Row id="content-view" className="page-content">
                <Col span={8} offset={8}>
                    <div className="card">
                        404
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;