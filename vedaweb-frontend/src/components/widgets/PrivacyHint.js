import React, { Component } from "react";
import { Icon, Button } from 'antd';

import stateStore from "../../state/stateStore";
import { view } from 'react-easy-state';
import { Link } from 'react-router-dom';

class PrivacyHint extends Component {

    constructor(props){
        super(props);
        this.state = {sawPrivacyHint: stateStore.settings.acceptedPrivacyHint};
        this.decide = this.decide.bind(this);
    }

    decide(accepted){
        stateStore.settings.acceptedPrivacyHint = accepted;
        if (!accepted) stateStore.clearStorage();
        this.setState({ sawPrivacyHint: true });
    }

    render() {

        if (this.state.sawPrivacyHint || stateStore.settings.acceptedPrivacyHint) return null;

        return (

            <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1rem",
                backgroundColor: "#931111",
                color: "#fff",
                textAlign: "center",
                WebkitBoxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.5)",
                MozBoxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.5)",
                boxShadow: "-0px 0px 8px 0px rgba(0, 0, 0, 0.5)",
            }}>

                <div
                onClick={() => this.decide(false)}
                style={{ cursor: "pointer", position: "absolute", right: "10px", top: "10px" }}>
                    <svg fill="#fff" viewBox="64 64 896 896" width="1em" height="1em" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </div>
                
                <p style={{padding: "0 2rem"}}>
                    <Icon type="info-circle" style={{marginRight: ".8rem"}}/>
                    This website can use cookies and other storage methods of your
                    browser to remember your application settings for your future
                    visits and create usage statistics.<br/>
                    Please see our <Link to="/privacypolicy" style={{color:"#fff", textDecoration:"underline"}}>privacy policy</Link> for details!
                </p>

                <Button
                type="primary"
                size="large"
                style={{
                    border:"1px solid #fff",
                    borderRadius: "3px",
                    fontSize:"120%",
                    marginRight: "1rem"
                }}
                onClick={() => this.decide(true)}>
                    I agree
                </Button>

            </div>
            
        );
    }
}

export default view(PrivacyHint);