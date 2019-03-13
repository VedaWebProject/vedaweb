import React, { Component } from "react";
import ErrorMessage from "./ErrorMessage";

class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
  
    componentDidCatch(error, info) {
        //console.log(JSON.stringify(error));
        //console.log(info.componentStack);
        //logErrorToMyService(error, info);
        this.setState({ hasError: true });
    }
  
    render() {
        if (this.state.hasError) {
            return <div style={{maxWidth:"1024px", margin:"auto auto"}}>
                        <ErrorMessage/>
                   </div>;
        }

        return this.props.children; 
    }

}

export default ErrorBoundary;