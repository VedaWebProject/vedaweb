import React, { Component } from "react";
import { Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import "./css/ContentLocation.css";

class ContentLocation extends Component {

    render() {

        return (

            <div className="location">
                <Link to={"/view/index/" + (this.props.currIndex - 1)} className="location-controls">
                    <Icon type="left"/>
                </Link>
                <span className="location-display">
                {
                    (this.props.locationBook + "").padStart(2, "0") + " . " +
                    (this.props.locationHymn + "").padStart(3, "0") + " . " +
                    (this.props.locationVerse + "").padStart(2, "0")
                }
                </span>
                <Link to={"/view/index/" + (this.props.currIndex + 1)} className="location-controls">
                    <Icon type="right"/>
                </Link>
            </div>
            
        );
    }
}

export default withRouter(ContentLocation);