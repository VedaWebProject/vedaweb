import React, { Component } from "react";
import { Icon, Modal, Spin, Button } from 'antd';
import axios from 'axios';

import "./css/DictionaryView.css";

const alphabet = ["a", "ā", "i", "ī", "u", "ū", "r̥", "r̥̄", "l̥", "l̥̄", "ē", "e", "ai", "ō", "o", "au", "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "ś", "ṣ", "s", "h", "ḻ", "kṣ", "jñ"];


class DictionaryView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            modalVisible: false,
            modalData: undefined,
            dictData: [],
            error: undefined
        }
    }

    componentDidMount(){
        this.loadDictData();
    }

    transform(padas){
        let out = [];
        let done = [];

        for (let i = 0; i < padas.length; i++) {
            const pada = padas[i];
            for (let j = 0; j < pada.tokens.length; j++) {
                const token = pada.tokens[j];
                if (done.indexOf(token.lemma) === -1){
                    out.push({
                        lemma: token.lemma,
                        lemmaRef: token.lemmaRef
                    });
                    done.push(token.lemma);
                }
            }
        }
        return out;
    }

    sort(tokenObjs){
        let temp = Array(alphabet.length + 1);
        let unsorted = temp.length;
    
        for (let i = 0; i < tokenObjs.length; i++) {
            const token = tokenObjs[i];
            let found = false;
            for (let j = 0; j < alphabet.length; j++) {
                const prefix = alphabet[j];
                if (this.cleanLemma(token.lemma).startsWith(prefix)){
                    if (temp[j] !== undefined){
                        temp[j].push(token);
                    } else {
                        temp[j] = [token];
                    }
                    found = true;
                    break;
                }
            }
            if (!found){
                if (temp[unsorted] !== undefined){
                    temp[unsorted].push(token);
                } else {
                    temp[unsorted] = [token];
                }
            }
        }
        
        let out = [];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== undefined){
                for (let j = 0; j < temp[i].length; j++) {
                    out.push(temp[i][j]);
                }
            }
        }
        return out;
    }

    cleanLemma(string){
        return string.normalize('NFD').replace(/[\u0300\u0301\u221a]/g, '').normalize('NFC');
    }

    loadDictData(){
        let tokenData = this.sort(this.transform(this.props.data));

        let lemmaRefs = [];
        for (let i = 0; i < tokenData.length; i++) {
            const token = tokenData[i];
            for (let j = 0; j < token.lemmaRef.length; j++) {
                lemmaRefs.push(token.lemmaRef[j]);
            }
        }

        const GQLQ = `{
            ids(lemmaId: ` + JSON.stringify(lemmaRefs) + `, size: 30) {
                id
                headwordDeva
                headwordIso
                senseTxtIso
            }
        }`;

        axios.post("https://api.c-salt.uni-koeln.de/dicts/gra/graphql", {query: GQLQ})
            .then((response) => {
                var dictData = [];
                const entries = response.data.data.ids;
                for (let i = 0; i < tokenData.length; i++) {
                    let t = tokenData[i];
                    t["dict"] = t.lemmaRef.map(ref => {
                        let entry = entries.find(e => e.id === ref);
                        return entry === undefined ? {} : {
                            graRef: ref,
                            graDeva: entry.headwordDeva,
                            graTxt: entry.senseTxtIso,
                            graLemma: entry.headwordIso
                        };
                    });
                    dictData.push(t);
                }
                this.setState({
                    isLoaded: true,
                    dictData: dictData,
                    error: undefined
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    openDict(modalData){
        this.setState({
            modalVisible: true,
            modalData: modalData
        });
    }

    closeDict = () => {
        this.setState({
            modalVisible: false,
            modalData: {}
        });
    }


    render() {

        const {modalVisible, modalData, dictData, isLoaded, error} = this.state;
        
        return (
            
            <Spin
            spinning={!isLoaded} >

                {isLoaded && error === undefined &&
                    <table className="teaser"><tbody>
                        {dictData.map((token, i) => (
                        <tr key={token + i}>
                            <td className="non-expanding bold">{token.lemma}</td>
                            <td className="non-expanding" style={{padding:'0 1rem'}}>
                                {token.lemmaRef.map((ref, i) => {
                                    let entry = token.dict.find(d => d.graRef === ref);
                                    return entry === undefined ? "" :
                                    <Button
                                    className="dict-link gap-right secondary-font"
                                    onClick={e => this.openDict(entry)}
                                    key={"lemma_" + i}>
                                        <Icon type="book"/>
                                        {" " + (i+1)}
                                    </Button>
                                })}
                            </td>
                            <td className="expanding">
                                {token.dict[0] !== undefined && token.dict[0].graTxt}
                            </td>
                        </tr>))}
                    </tbody></table>
                }

                {isLoaded && modalVisible && modalData !== undefined && error === undefined &&
                    <Modal
                    title={<div><span className="bold">Grassmann: </span><span className="trans-font">{modalData.graLemma}</span></div>}
                    centered
                    footer={null}
                    visible={true}
                    onOk={this.closeDict}
                    onCancel={this.closeDict}
                    okText="OK">
                        <div key={modalData.lemmaRef} className="trans-font">
                            <span className="deva-font" style={{color:"#000"}}>{modalData.graDeva}</span><br/>
                            <p>{modalData.graTxt}</p>
                        </div>
                    </Modal>
                }

                {isLoaded && error !== undefined &&
                    <span className="red secondary-font">
                        Unfortunately, there was an error processing the dictionary data. <Icon type="meh"/>
                    </span>
                }
            </Spin>
            
        );
    }
}

export default DictionaryView;