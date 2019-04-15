import React, { Component } from "react";
import axios from 'axios';


class LoadHtml extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            data: null,
            error: null
        }
        this.load = this.load.bind(this);
        this.createMarkup = this.createMarkup.bind(this);
    }

    componentDidMount(){
        if (this.props.uri){
            this.load(this.props.uri);
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.uri !== prevProps.uri){
            this.load(this.props.uri);
        }
    }

    load(uri){
        this.setState({
            isLoaded: false,
            data: null
        });
        
        axios.get(uri)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data,
                    error: null
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    createMarkup() {
        return {__html: this.state.data.html};
    }

    render() {

        if (!this.state.isLoaded) return "loading...";

        return (
            !this.state.error
                ? <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                : <div>Error: Could not load {this.props.uri}.</div>
        );
        
    }
}

export default LoadHtml;