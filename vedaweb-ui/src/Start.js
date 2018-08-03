import React, { Component } from "react";
import { Row, Col } from 'antd';


class ContentView extends Component {

    render() {
        return (
            
            <Row id="content-view" className="page-content">
                <Col span={24}>
                    <div className="card">
                        <h4>VedaWeb</h4>
                        <span>(Juli 2017-Juni 2020)</span>
                        <div className="start">
                        <br/>
                        Das Projekt hat zum Ziel, eine webbasierte, frei zugängliche Plattform für die sprachwissenschaftliche Erforschung altindischer Texte aufzubauen. Das altindische Textkorpus soll digital einsehbar, morphologisch und metrisch annotiert sowie nach lexikographischen und korpuslinguistischen Kriterien durchsuchbar zur Verfügung gestellt werden. Als Pilottext wird der Rigveda eingespeist werden, der mit den Wörterbüchern Cologne Digital Sanskrit Dictionaries verknüpft werden soll. Die morphologische Annotation dieses Textes wurde an der Universität Zürich (UZH) durchgeführt und dem Projekt zur Verfügung gestellt. In Zukunft wird über die URL vedaweb.uni-koeln.de die Vedaweb-Anwendung erreichbar sein.
                        </div>
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;