import React, { Component } from "react";

let config = {
    targetLookupInterval: 200,
    targetLookupTimeout: 2000,
    maskColor: "rgba(0, 0, 0, 0.3)",
    maskPaddingPx: 10,
    maskHoleBorderRadius: "4px",
    fullMask: false,
    bubbleDistance: 10,
    buttonPrevText: "Back",
    buttonNextText: "Next",
    buttonEndText: "End Tour",
    bubbleContentPadding: "1rem",
    closeOnMaskClick: true,
    resetOnClose: true,
    showProgressInTitle: true,
    showProgressBar: true,
    progressBarColor: "#bbb",
    progressBarBackground: "#ddd"
};

class Tour extends Component {

    constructor(props){
        super(props);
        this.state = {
            step: 0,
            target: null,
            pos: null
        };
        this.targetLookup = this.targetLookup.bind(this);
        this.nextTarget = this.nextTarget.bind(this);
        this.prevTarget = this.prevTarget.bind(this);
        this.isFixed = this.isFixed.bind(this);
        this.closeTour = this.closeTour.bind(this);
    }

    componentDidMount(){
        //apply external config
        config = Object.assign(config, this.props.config);
        
        if (this.props.enabled){
            this.targetLookup();
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (this.props.enabled &&
            (this.props.enabled !== prevProps.enabled || this.state.step !== prevState.step)){
            this.targetLookup();
        }
    }

    nextTarget(){
        this.setState({
            step: (this.state.step + 1),
            target: null,
            pos: null
        })
    }

    prevTarget(){
        this.setState({
            step: (this.state.step - 1),
            target: null,
            pos: null
        })
    }

    isFixed(el){
        while (typeof el === 'object' && el.nodeName.toLowerCase() !== 'body') {
            if (window.getComputedStyle(el).getPropertyValue('position').toLowerCase() === 'fixed')
                return true;
            el = el.parentElement;
        }
        return false;
    }

    targetLookup(){
        if (!this.props.enabled) return;
        let target = this.props.checkpoints[this.state.step];
        if (target.execBefore) target.execBefore();
        let element = null;
        let comp = this;
        let lookupDuration = 0;
        let lookup = setInterval(function(){
            lookupDuration += config.targetLookupInterval;
            element = document.querySelector("*[data-tour-id='" + target.id + "']");
            if (element !== null){
                clearInterval(lookup);
                target.fixed = comp.isFixed(element);
                comp.setState({
                    target: target || null,
                    pos: element ? element.getBoundingClientRect() : null
                });
            } else if (lookupDuration >= config.targetLookupTimeout){
                clearInterval(lookup);
                comp.setState({
                    target: null,
                    pos: null,
                    step: comp.state.step + 1
                });
            }
        }, config.targetLookupInterval);
    }

    closeTour(){
        this.props.onCloseTour();
        if (config.resetOnClose || this.state.step >= this.props.checkpoints.length - 1){
            this.setState({
                step: 0,
                target: null,
                pos: null
            });
        }
    }

    render() {

        //checks

        if ( !(
            this.props.enabled &&
            this.state.target &&
            this.state.pos &&
            this.props.checkpoints &&
            Array.isArray(this.props.checkpoints)
        )){
            return null;
        }

        //// define styles

        const maskStyle = {
            display: "block",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: 9999,
            overflow: "hidden"
        };

        const holeStyle = {
            position: "absolute",
            WebkitBoxShadow: (config.fullMask ? "0 0 0 9999px " : "0 0 400px 300px ") + config.maskColor,
            MozBoxShadow: (config.fullMask ? "0 0 0 9999px " : "0 0 400px 300px ") + config.maskColor,
            boxShadow: (config.fullMask ? "0 0 0 9999px " : "0 0 400px 300px ") + config.maskColor,
            borderRadius: config.maskHoleBorderRadius,
        };
        
        const bubbleStyle = Object.assign({
            position: "absolute",
            backgroundColor: "#fff",
            padding: config.bubbleContentPadding,
            borderRadius: "4px",
            WebkitBoxShadow: "-1px 2px 8px 0px rgba(0, 0, 0, 0.3)",
            MozBoxShadow: "-1px 2px 8px 0px rgba(0, 0, 0, 0.3)",
            boxShadow: "-1px 2px 8px 0px rgba(0, 0, 0, 0.3)",
            minWidth: "400px",
            maxWidth: "100vw"
        }, this.props.bubbleStyle);
        
        const bubbleIconStyle = Object.assign({
            height: "100%",
            marginRight: config.bubbleContentPadding
        }, this.props.bubbleIconStyle);
        
        const bubbleArrowStyle = Object.assign({
            display: "inline-block",
            position: "absolute",
            width: "0",
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
        }, this.props.bubbleArrowStyle);
        
        const bubbleTitleStyle = Object.assign({
            flex: "2",
            whiteSpace: "nowrap",
            color: "#454545",
            fontWeight: "bold",
            marginRight: config.bubbleContentPadding
        }, this.props.bubbleTitleStyle);
        
        const bubbleTextStyle = Object.assign({
            marginTop: config.bubbleContentPadding,
            color: "#565656"
        }, this.props.bubbleTextStyle);

        const buttonStyle = Object.assign({
            backgroundColor: "#ddd",
            border: "1px solid #bcbcbc",
            borderRadius: "4px",
            color: "#555",
            cursor: "pointer",
            margin: "0 5px"
        }, this.props.buttonStyle);

        //calculate mask hole position / dimensions
        holeStyle.top = this.state.pos.top + window.pageYOffset - config.maskPaddingPx;
        holeStyle.left = this.state.pos.left + window.pageXOffset - config.maskPaddingPx;
        holeStyle.width = this.state.pos.right - this.state.pos.left + (config.maskPaddingPx * 2);
        holeStyle.height = this.state.pos.bottom - this.state.pos.top + (config.maskPaddingPx * 2);

        //calculate info bubble Y position
        if ((holeStyle.top + holeStyle.height) > (document.body.scrollHeight - (window.innerHeight / 2))){
            //bubble is above
            bubbleStyle.bottom = holeStyle.height + config.bubbleDistance + 18;
            bubbleArrowStyle.bottom = "-18px";
            bubbleArrowStyle.borderTop = "20px solid" + bubbleStyle.backgroundColor;
        } else {
            //bubble is below
            bubbleStyle.top = holeStyle.height + config.bubbleDistance + 18;
            bubbleArrowStyle.top = "-18px";
            bubbleArrowStyle.borderBottom = "20px solid" + bubbleStyle.backgroundColor;
        }

        //calculate info bubble X position
        if (holeStyle.left > (document.body.scrollWidth - (window.innerWidth / 2))){
            //bubble is aligned right
            bubbleStyle.right = (holeStyle.width / 2) - 40;
            bubbleArrowStyle.right = 20;
        } else {
            //bubble is aligned left
            bubbleStyle.left = (holeStyle.width / 2) - 40;
            bubbleArrowStyle.left = 20;
        }

        //target display:fixed ???
        if (!this.state.target.fixed){
            window.scrollTo(
                this.state.pos.left - (window.innerWidth/2),
                this.state.pos.top - (window.innerHeight/2)
            );
        } else {
            holeStyle.position = "fixed";
        }

        return (

            <div style={maskStyle} onClick={() => {config.closeOnMaskClick && this.closeTour()}}>

                <div style={holeStyle}>
                
                    <div style={bubbleStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={bubbleArrowStyle}></div>

                        <div style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}>

                            {this.state.target.icon ?
                                <div style={bubbleIconStyle}>{this.state.target.icon}</div> : null
                            }

                            <div style={bubbleTitleStyle}>
                                {this.state.target.title}
                                {config.showProgressInTitle &&
                                    <span> ({this.state.step + 1}/{this.props.checkpoints.length})</span>
                                }
                            </div>

                            <div
                            onClick={this.closeTour}
                            style={{ cursor: "pointer" }}>
                                <svg fill="#aaa" viewBox="64 64 896 896" width="1em" height="1em" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                            </div>

                        </div>

                        <div style={bubbleTextStyle}>
                            {this.state.target.text}
                        </div>

                        <div
                        style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: config.bubbleContentPadding}}>
                            <div>
                                {this.state.step > 0 &&
                                    <button
                                    type="button"
                                    style={buttonStyle}
                                    onClick={this.prevTarget}>
                                        {config.buttonPrevText}
                                    </button>
                                }
                            </div>
                            <div style={{textAlign:"right"}}>
                                {this.state.step < (this.props.checkpoints.length - 1)
                                    ?   <button
                                        type="button"
                                        style={buttonStyle}
                                        onClick={this.nextTarget}>
                                            {config.buttonNextText}
                                        </button>

                                    :   <button
                                        type="button"
                                        style={buttonStyle}
                                        onClick={this.closeTour}>
                                            {config.buttonEndText}
                                        </button>
                                }
                            </div>
                        </div>

                        {config.showProgressBar &&
                            <div
                            style={{
                                width: "100%",
                                height: "5px",
                                backgroundColor: config.progressBarBackground,
                                textAlign: "left",
                                marginTop: config.bubbleContentPadding
                            }}>
                                <div
                                style={{
                                    height: "100%",
                                    width: ((((this.state.step + 1) / this.props.checkpoints.length) * 100) + "%"),
                                    backgroundColor: config.progressBarColor
                                }}></div>
                            </div>
                        }

                    </div>

                </div>
                
            </div>
            
        );
    }
}

export default Tour;