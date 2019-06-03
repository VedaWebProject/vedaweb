import React, { Component } from "react";
import { Row, Col, Icon } from 'antd';
import HtmlSnippet from "../utils/HtmlSnippet";


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
                        <HtmlSnippet id="siteNotice"/>
                    </div>
                </Col>

            </Row>
            
        );
    }
}

export default ContentView;