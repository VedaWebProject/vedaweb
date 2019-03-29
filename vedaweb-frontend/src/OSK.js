import React, { Component } from "react";
import { Drawer, Icon } from 'antd';

import { view } from 'react-easy-state';
import mouseTrap from 'react-mousetrap';

import "./css/OSK.css";

const oskKeys = [
    ["a","अ"],["ā","आ"],["i","इ"],["ī","ई"],["u","उ"],["ū","ऊ"],
    ["r̥","ऋ"],["r̥̄","ॠ"],["l̥","ऌ"],["l̥̄","ॡ"],["e","ऎ"],["ē","ए"],
    ["ê","ऍ"],["ai","ऐ"],["o","ऒ"],["ō","ओ"],["ô","ऑ"],["au","औ"],
    ["ṁ","ं"],["m̐","ँ"],["ḥ","ः"],["ẖ","ᳵ"],["ḫ","ᳶ"],["k","क"],
    ["kh","ख"],["g","ग"],["gh","घ"],["ṅ","ङ"],["c","च"],["ch","छ"],
    ["j","ज"],["jh","झ"],["ñ","ञ"],["ṭ","ट"],["ṭh","ठ"],["ḍ","ड"],
    ["ṛ","ड़"],["ḍh","ढ"],["ṛh","ढ़"],["ṇ","ण"],["t","त"],["th","थ"],
    ["d","द"],["dh","ध"],["n","न"],["p","प"],["ph","फ"],["b","ब"],
    ["bh","भ"],["m","म"],["ṟ","ऱ"],["ṉ","ऩ"],["ḻ","ऴ"],["y","य"],
    ["ẏ","य़"],["r","र"],["r̆","ऱ्"],["l","ल"],["ḷ","ळ"],["v","व"],
    ["ś","श"],["ṣ","ष"],["s","स"],["h","ह"],["’","ऽ"],["q","क़"],
    ["x","ख़"],["ġ","ग़"],["z","ज़"],["f","फ़"],["\u0301","\u0301"],["\u0300","\u0300"]
];


class OSK extends Component {

    constructor(props){
        super(props);
        this.state = { visible: false };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    open(){
        this.setState({ visible: true });
        this.props.bindShortcut('backspace', () => {this.backspace(); return false;});
        this.props.bindShortcut('enter', () => {this.close(); return false;});
    }

    close(){
        this.setState({ visible: false });
        this.props.unbindShortcut('backspace');
        this.props.unbindShortcut('enter');
    }

    append(key){
        this.updateInput(this.props.value + key);
    }

    backspace(){
        this.updateInput(this.props.value.slice(0, -1));
    }

    updateInput(updated){
        this.props.updateInput(updated);
    }

    render() {

        const title =
            <div style={{textAlign:"center"}}>
                {this.props.value
                    ? <strong className="text-font">{this.props.value}</strong>
                    : <strong className="red">ISO-15919 keyboard</strong>
                }
                
                
            </div>

        return (

            <div style={{display:"inline"}}>

                <Icon
                type="edit" onClick={this.open}
                style={{color:"rgba(0,0,0,0.2)"}} />

                <Drawer
                title={title}
                placement="bottom"
                height="auto"
                closable={true}
                mask={true}
                maskClosable={true}
                maskStyle={{backgroundColor:"transparent"}}
                onClose={this.close}
                visible={this.state.visible}
                bodyStyle={{backgroundColor: "#f0f0f0"}}>

                    <div className="osk-container">
                        {oskKeys.map((key, i) => (
                            <button
                            className="osk-key"
                            key={"osk_key_" + i}
                            onClick={() => this.append(key[0])}>
                                <div className="osk-key-label-primary text-font">{key[0]}</div>
                                <div className="osk-key-label-secondary deva-font">{key[1]}</div>
                            </button>
                        ))}
                    </div>
                </Drawer>

            </div>
            
        );
    }
}

export default mouseTrap(view(OSK));