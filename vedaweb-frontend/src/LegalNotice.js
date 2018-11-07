import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';


class ContentView extends Component {

    render() {
        document.title = "VedaWeb | Legal Notice";

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content">

                <Col md={24} lg={20} xl={16}>
                    <div className="card">
                        <h4><Icon type="paper-clip"/> Legal Notice</h4>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default ContentView;