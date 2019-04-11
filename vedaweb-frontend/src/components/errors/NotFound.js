import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';


class ContentView extends Component {

    render() {
        return (
            
            <Row className="page-content">
                <Col span={8} offset={8}>
                    <div className="card content-center">
                        <Icon type="meh-o"/> The page you requested could not be found.
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;