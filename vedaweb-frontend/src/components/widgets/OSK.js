import React, { Component } from "react";
import { Drawer, Icon, message } from 'antd';

import { view } from 'react-easy-state';
import mouseTrap from 'react-mousetrap';
import stateStore from "../../stateStore";

import "./OSK.css";

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
        ["ś","श"],["ṣ","ष"],["s","स"],["h","ह"],["’","ऽ"],
        ["f","फ़"],["\u0301","\u0301"],["\u0300","\u0300"]
    ]
;


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
        //globally set iso translit
        stateStore.settings.transliteration = "iso";
        message.open({
            content: <span className="red">Transliteration scheme has been set to <strong>ISO-15919</strong></span>,
            duration: 3,
            icon: <Icon type="info-circle" theme="filled"/>
        });
        //bind keyboard keys to actions
        this.props.bindShortcut('backspace', () => {this.backspace(); return false;});
        this.props.bindShortcut('enter', () => {this.close(); return false;});
    }

    close(){
        this.setState({ visible: false });
        //unbind keyboard keys
        this.props.unbindShortcut('backspace');
        this.props.unbindShortcut('enter');
    }

    append(key){
        this.updateInput(this.props.value + key);
    }

    backspace(){
        if (this.props.value){
            this.updateInput(this.props.value.slice(0, -1));
        } else {
            this.close();
        }
    }

    updateInput(updated){
        this.props.updateInput(updated);
    }

    render() {

        const title =
            <div className="content-center">
                {this.props.value
                    ? <span><strong className="text-font">{this.props.value || ""}</strong><span className="light-grey blink"> _</span></span>
                    : <span className="red bold">ISO-15919 Keyboard</span>
                }
            </div>;

        return (

            <div style={{display:"inline"}}>
                
                <Icon
                data-tour-id="quick-search-osk"
                type="edit" onClick={this.open}
                style={{color:"rgba(0,0,0,0.2)"}}
                title="open ISO-15919 on-screen keyboard" />

                <Drawer
                title={title}
                placement="bottom"
                height="auto"
                closable={true}
                mask={true}
                maskClosable={true}
                onClose={this.close}
                visible={this.state.visible}
                bodyStyle={{backgroundColor: "#e0e0e0", padding:".5rem"}}>

                    <div className="osk-container">
                        {oskKeys.map((key, i) => (
                            <button
                            className="osk-key"
                            key={"osk_key_" + i}
                            onClick={() => this.append(key[0])}>
                                <div className="text-font osk-key-label-primary">{key[0]}</div>
                                <div className="deva-font osk-key-label-secondary">{key[1]}</div>
                            </button>
                        ))}
                    </div>
                </Drawer>

            </div>
            
        );
    }
}

export default mouseTrap(view(OSK));