import React, { Component } from "react";
import { Drawer, Icon } from 'antd';

import { view } from 'react-easy-state';
import mouseTrap from 'react-mousetrap';

import SearchTransliteration from "./SearchTransliteration";
import TransliterationPreview from "./TransliterationPreview";
import "./css/OSK.css";
import searchMetaStore from "./stores/searchMetaStore";

const oskKeys = {
    iso: [
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
    ],
    hk: [
        ["a","अ"],["A","आ"],["i","इ"],["I","ई"],["u","उ"],["U","ऊ"],
        ["R","ऋ"],["RR","ॠ"],["lR","ऌ"],["lRR","ॡ"],["e","ए"],
        ["ai","ऐ"],["o","ओ"],["au","औ"],["M","ं"],["H","ः"],
        ["~","ँ"],["k","क्"],["kh","ख्"],["g","ग्"],["gh","घ्"],["G","ङ्"],
        ["c","च्"],["ch","छ्"],["j","ज्"],["jh","झ्"],["J","ञ्"],["T","ट्"],
        ["Th","ठ्"],["D","ड्"],["Dh","ढ्"],["N","ण्"],["t","त्"],["th","थ्"],
        ["d","द्"],["dh","ध्"],["n","न्"],["p","प्"],["ph","फ्"],["b","ब्"],
        ["bh","भ्"],["m","म्"],["y","य्"],["r","र्"],["l","ल्"],["v","व्"],["z","श्"],
        ["S","ष्"],["s","स्"],["h","ह्"],["L","ळ्"],["kS","क्ष्"],["jJ","ज्ञ्"],
        ["OM","ॐ"],["'","ऽ"],["\u0301","\u0301"],["\u0300","\u0300"]
    ],
    slp1: [
        ["a","अ"],["A","आ"],["i","इ"],["I","ई"],["u","उ"],["U","ऊ"],["f","ऋ"],["F","ॠ"],
        ["x","ऌ"],["X","ॡ"],["e","ए"],["E","ऐ"],["o","ओ"],["O","औ"],["M","ं"],
        ["H","ः"],["~","ँ"],["k","क्"],["K","ख्"],["g","ग्"],["G","घ्"],["N","ङ्"],["c","च्"],
        ["C","छ्"],["j","ज्"],["J","झ्"],["Y","ञ्"],["w","ट्"],["W","ठ्"],["q","ड्"],["Q","ढ्"],
        ["R","ण्"],["t","त्"],["T","थ्"],["d","द्"],["D","ध्"],["n","न्"],["p","प्"],["P","फ्"],
        ["b","ब्"],["B","भ्"],["m","म्"],["y","य्"],["r","र्"],["l","ल्"],["v","व्"],["S","श्"],
        ["z","ष्"],["s","स्"],["h","ह्"],["L","ळ्"],["kz","क्ष्"],["jY","ज्ञ्"],
        ["oM","ॐ"],["'","ऽ"],[".","।"],["..","॥"],["\u0301","\u0301"],["\u0300","\u0300"]
    ]
}
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
            <div style={{display:"flex", alignItems:"center"}}>
                <div>
                    <SearchTransliteration size="large"/>
                </div>
                <div style={{paddingLeft:"1rem", borderLeft:"1px solid #931111"}}>
                    <div className="red bottom-gap">{searchMetaStore.transliteration.toUpperCase()}: </div>
                    <div className="red">ISO-15919: </div> 
                </div>
                <div style={{flex:"2", paddingLeft:"1rem"}}>
                    <div className="bottom-gap">
                        <strong className="text-font">{this.props.value || ""}</strong><span className="light-grey blink"> _</span>
                    </div>
                    <TransliterationPreview
                    input={this.props.value}
                    transliteration={searchMetaStore.transliteration} />
                </div>
            </div>;

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
                bodyStyle={{backgroundColor: "#f0f0f0", padding:".5rem"}}>

                    <div className="osk-container">
                        {oskKeys[searchMetaStore.transliteration].map((key, i) => (
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