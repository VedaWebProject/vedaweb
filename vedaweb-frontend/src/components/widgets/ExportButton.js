import React, { Component } from "react";
import { Button } from 'antd';
import axios from 'axios';
import fileDownload from "js-file-download";


class ExportButton extends Component {


    constructor(props){
        super(props);
        this.state = {isLoaded: true, error: null};
        this.export = this.export.bind(this);
    }


    export() {
        this.setState({ isLoaded: false, error: null });

        axios({
            method: this.props.reqMethod || "get",
            url: this.props.reqUrl || "",
            data: this.props.reqData || null
        })
        .then((response) => {
            this.setState({ isLoaded: true });
            fileDownload(response.data, this.props.fileName);
        })
        .catch((error) => {
            this.setState({ isLoaded: true, error: error });
        });
    }


    render() {
        return (
            <Button
            icon={
                !this.state.isLoaded
                    ? "loading"
                    : this.state.error
                        ? this.props.errorIcon || "frown"
                        : this.props.idleIcon || "export"
            }
            children={this.props.text}
            onClick={this.export}
            type={this.props.buttonType || "primary"}
            title={this.props.title || "Export"}
            style={this.props.style || null}
            disabled={!this.state.isLoaded || this.state.error} />
        );
    }
}

export default ExportButton;