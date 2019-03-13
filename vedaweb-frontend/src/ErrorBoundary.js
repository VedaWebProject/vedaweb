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
        console.log(JSON.stringify(error));
        console.log(JSON.stringify(info));
      //logErrorToMyService(error, info);
    }
  
    render() {
      if (this.state.hasError) {
        return <div className="page-content"><ErrorMessage/></div>;
      }
  
      return this.props.children; 
    }

}

export default ErrorBoundary;