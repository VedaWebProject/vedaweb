import React, { Component } from "react";

class RelevanceMeter extends Component {

    render() {

        if (!this.props.value || !this.props.max) return null;

        const value = (this.props.value / this.props.max);
        const hue = ((value)*120).toString(10);

        return (

            <div
            title={(value * 100).toFixed(2) + " %"}
            style={{
                position: "relative",
                display: "inline-block",
                height: "24px",
                width: "12px",
                borderRadius: "3px",
                backgroundColor: "hsl(" + hue + ",60%,70%)",
            }}>
                <div style={{
                    width: "100%",
                    height: (value * 100) + "%",
                    backgroundColor: "hsl(" + hue + ",40%,50%)",
                    borderRadius: "3px",
                    position: "absolute",
                    bottom: 0,
                    left: 0
                }}></div>
            </div>

        );
    }

}

export default RelevanceMeter;