import React, { Component } from "react";
import { Drawer, Icon, Button, Radio } from 'antd';
import axios from 'axios';
import fileDownload from "js-file-download";
import stateStore from "../../stateStore";

const RadioGroup = Radio.Group;

const exportOptions = [
    { id: "xml", label: "TEI-XML (full stanza data)" },
    { id: "txt", label: "Plain Text (selected stanza data)"}
];

class ExportDrawer extends Component {


    constructor(props){
        super(props);
        this.state = { format: exportOptions[0].id, isExportLoaded: true };
        this.export = this.export.bind(this);
    }


    export() {
        this.setState({ isExportLoaded: false });

        axios.post(
                process.env.PUBLIC_URL + "/api/export/doc/" + this.props.docId + "/" + this.state.format,
                {layers: stateStore.ui.layers.filter(l => l.show)}
            )
            .then((response) => {
                this.setState({
                    isExportLoaded: true
                });
                fileDownload(response.data, ("vedaweb-" + this.props.docId + "." + this.state.format));
            })
            .catch((error) => {
                this.setState({
                    isExportLoaded: true
                });
                alert("There was an error generating the data.");
            });
    }


    render() {
        return (
            
            <Drawer
            title={<h1 style={{marginBottom:'0'}}><Icon type="export" className="gap-right"/>Export Stanza</h1>}
            placement="right"
            width="auto"
            closable={true}
            onClose={this.props.onClose}
            visible={this.props.visible} >
                
                <RadioGroup
                onChange={(e) => this.setState({ format: e.target.value }) }
                defaultValue={this.state.format}>
                    {exportOptions.map((eOpt) => (
                        <Radio
                        key={'eOpt_' + eOpt.id}
                        value={eOpt.id}
                        style={{ display: 'block', height: '30px', lineHeight: '30px' }}>
                            {eOpt.label}
                        </Radio>
                    ))}
                </RadioGroup>
            
                <Button
                block
                type="primary"
                icon={this.state.isExportLoaded ? "download" : "loading"}
                style={{marginTop:'2rem'}}
                onClick={this.export}>
                    Export
                </Button>
                    
            </Drawer>
            
        );

    }
}

export default ExportDrawer;