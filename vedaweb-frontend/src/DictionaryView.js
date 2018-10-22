import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import axios from 'axios';

const alphabet = ["a", "ā", "i", "ī", "u", "ū", "r̥", "r̥̄", "l̥", "l̥̄", "ē", "e", "ai", "ō", "o", "au", "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "ś", "ṣ", "s", "h", "ḻ", "kṣ", "jñ"];


class DictionaryView extends Component {

    state = { visible: false, lemma: '', lemmaRef: [], dictData: {} }

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

    openDict(lemma, ref){
        const GQLQ = `{
            ids(lemmaId: ["` + ref + `"]) {
                headwordDeva
                headwordIso
                senseTxtIso
            }
        }`;

        axios.post("http://api.c-salt.uni-koeln.de/dicts/gra/graphql", {query: GQLQ})
            .then((response) => {
                this.setState({
                    visible: true,
                    lemma: lemma,
                    lemmaRef: ref,
                    dictData: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    visible: true,
                    error: error
                });
            });
    }

    closeDict = () => {
        this.setState({
            visible: false,
            lemma: '',
            lemmaRef: [],
            dictData: {}
        });
    }


    render() {

        return (
            
            <div>
                {this.sort(this.transform(this.props.data)).map((token, i) => (
                        <div key={token + i}>
                            <span className="bold">{token.lemma}</span>
                            {token.lemmaRef.map((ref, i) => (
                                <a
                                className="dict-link"
                                onClick={e => this.openDict(token.lemma, ref)}
                                key={"lemma_" + i}>
                                    <Icon type="eye-o"/>
                                    {(i+1) + " "}
                                </a>
                            ))}
                        </div>
                ))}

                {this.state.visible && this.state.error === undefined &&
                    <Modal
                    title={<div><span className="bold">Grassmann: </span><span className="trans-font">{this.state.lemma}</span></div>}
                    centered
                    footer={null}
                    visible={true}
                    onOk={this.closeDict}
                    onCancel={this.closeDict}
                    okText="OK">
                        {this.state.dictData.data.ids.map(id => (
                            <div className="trans-font">
                                <span className="deva-font" style={{color:"#000"}}>{id.headwordDeva}</span><br/>
                                <p>{id.senseTxtIso}</p>
                            </div>
                        ))}
                    </Modal>
                }
            </div>
            
        );
    }
}

export default DictionaryView;