import React, { Component } from "react";
import { Row, Col, Icon, Button, Modal } from 'antd';
import axios from 'axios';
import './css/System.css';


class ContentView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            showModal: false,
            error: undefined,
            response: undefined,
            action: ''
        }
        this.run = this.run.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    run(action){
        this.setState({
            isLoaded: false,
            action: action
        });

        let path = process.env.PUBLIC_URL + "/system/";
        if (action === "import_dry")
            path += "import/dryrun";
        else if (action === "import")
            path += "import";
        else if (action === "index_delete")
            path += "index/delete";
        else if (action === "index_create")
            path += "index/create";
        else if (action === "index_fill")
            path += "index/fill";
        else if (action === "index_rebuild")
            path += "index/rebuild";

        //add auth param
        path += ("?auth=" + this.props.match.params.auth);
        
        axios.get(path)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    response: response.data,
                    showModal: true
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error,
                    response: undefined
                });
            });
    }

    closeModal(){
        this.setState({
            response: undefined,
            showModal: false
        });
    }


    render() {

        document.title = "VedaWeb | System maintenance";
        const {error, showModal, isLoaded, action, response} = this.state;

        return (
            
            <Row
            type="flex"
            justify="center"
            className="page-content"
            key="system-maintenance">

                <Col xl={16} md={20} sm={24}>
                    <div className="card">
                        <h4><Icon type="tool"/> VedaWeb System Maintenance</h4>
                        <table className="secondary-font">
                            <thead className="bold red">
                                <tr>
                                    <th></th>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><Icon type="download"/></td>
                                    <td className="bold">Import Data (dry run)</td>
                                    <td>Simulate XML data import for testing</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'import_dry'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('import_dry')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><Icon type="download"/></td>
                                    <td className="bold">Import Data</td>
                                    <td>Import XML data to DB and rebuild search index</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'import'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('import')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><Icon type="delete"/></td>
                                    <td className="bold">Search Index: Delete</td>
                                    <td>Deletes the search index</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'index_delete'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('index_delete')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><Icon type="build"/></td>
                                    <td className="bold">Search Index: Create</td>
                                    <td>Creates a new, empty search index following the internal specifications</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'index_create'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('index_create')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><Icon type="filter"/></td>
                                    <td className="bold">Search Index: Fill</td>
                                    <td>Fills an existing search index using DB data</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'index_fill'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('index_fill')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><Icon type="reload"/></td>
                                    <td className="bold">Search Index: Rebuild</td>
                                    <td>Deletes, creates and fills the search index in one go</td>
                                    <td>
                                        <Button
                                        loading={!isLoaded && action === 'index_rebuild'}
                                        disabled={!isLoaded}
                                        icon="play-circle"
                                        onClick={() => this.run('index_rebuild')}>
                                            Run
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Modal
                        centered
                        title={"System Maintenance: " + action}
                        visible={showModal}
                        footer={null}
                        onCancel={this.closeModal} >
                            <pre>
                                {error === undefined && JSON.stringify(response, null, 2)}
                                {error !== undefined && JSON.stringify(error, null, 2)}
                            </pre>
                        </Modal>
                    </div>
                </Col>
            </Row>
            
        );
    }
}

export default ContentView;