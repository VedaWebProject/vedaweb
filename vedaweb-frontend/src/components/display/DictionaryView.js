import React, { Component } from "react";
import { Icon, Modal, Button } from 'antd';
import axios from 'axios';

import "./DictionaryView.css";

const alphabet = ["a", "ā", "i", "ī", "u", "ū", "r̥", "r̥̄", "l̥", "l̥̄", "ē", "e", "ai", "ō", "o", "au", "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "ś", "ṣ", "s", "h", "ḻ", "kṣ", "jñ"];
const parser = new DOMParser();

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
        this.handleRefClicked = this.handleRefClicked.bind(this);
    }

    componentDidMount(){
        let lemmaData = this.sort(this.transform(this.props.data));
        
        this.setState({
            dictData: lemmaData
        });

        //collect lemma refs
        let lemmaRefs = [];
        for (let i = 0; i < lemmaData.length; i++) {
            const token = lemmaData[i];
            if (token.lemmaRefs !== undefined && token.lemmaRefs !== null){
                for (let j = 0; j < token.lemmaRefs.length; j++) {
                    lemmaRefs.push(token.lemmaRefs[j]);
                }
            }
        }

        //construct GraphQL query
        const GQLQ = `{
            ids(dictId:"gra", lemmaId: ` + JSON.stringify(lemmaRefs) + `, size: 30) {
                id
                headwordDeva
                headwordIso
                entryTeiIso
            }
        }`;

        //request API data
        axios.post("https://api.c-salt.uni-koeln.de/dicts/sa/graphql", {query: GQLQ})
            .then((response) => {
                var dictData = [];
                const entries = response.data.data.ids;
                for (let i = 0; i < lemmaData.length; i++) {
                    let t = lemmaData[i];
                    t["dict"] = t.lemmaRefs.map(ref => {
                        let entry = entries.find(e => e.id === ref);
                        return entry === undefined ? {} : this.parseEntry(entry, parser);
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
                    error: !Object.isEmpty(error) ? error : undefined
                });
            });
        //lord, forgive me
        window.handleRefClicked = this.handleRefClicked;
    }

    parseEntry(entry, parser){
        //no parsing needed:
        let e = {
            graRef: entry.id,
            graDeva: entry.headwordDeva,
            graLemma: entry.headwordIso,
            entryTeiIso: entry.entryTeiIso
        };
        //replace xml self closing tags to prevent paring errors
        entry.entryTeiIso = entry.entryTeiIso.replace(/<(\w+?)\s?\/>/gi, "<$1></$1>");
        //create xmlDOM
        let xDoc = parser.parseFromString(entry.entryTeiIso, "text/html");
        //parse graTxt
        e.graTxt = xDoc.getElementsByTagName("sense")[0].innerText || "no preview available";
        //parse graPageUri
        e.graPageUri = xDoc.getElementsByTagName("note")[0]
                             .getElementsByTagName("ref")[0]
                             .getAttribute("target") || null;
        //get entry markup
        e.graHtml = xDoc.getElementsByTagName("sense")[0].innerHTML || "entry text could not be loaded";
        
        return e;
    }

    generateDictHTML(tei){
        //create DOM
        let xDoc = parser.parseFromString(tei, "text/html");
        //set onClick handlers for dict refs
        let stanzaRefs = xDoc.querySelectorAll("ref[target]");
        //yes, i know. i don't want to do this, either.
        for (let i = 0; i < stanzaRefs.length; i++) {
            let refId = stanzaRefs[i].getAttribute("target").replace(/#/g,"");
            stanzaRefs[i].setAttribute("onClick", "window.handleRefClicked('" + refId + "');");
        }
        return new XMLSerializer().serializeToString(xDoc);
    }

    transform(padas){
        let out = [];
        let done = [];

        for (let i = 0; i < padas.length; i++) {
            const pada = padas[i];
            for (let j = 0; j < pada.grammarData.length; j++) {
                const token = pada.grammarData[j];
                if (done.indexOf(token.lemma) === -1){
                    out.push({
                        lemma: token.lemma,
                        lemmaRefs: token.lemmaRefs,
                        tokens: [token.form]
                    });
                    done.push(token.lemma);
                } else {
                    let match = out.find(t => t.lemma === token.lemma);
                    if (match.tokens.indexOf(token.form) === -1){
                        match.tokens.push(token.form);
                    }
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

    openDict(modalData){
        if (modalData === undefined) return;
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

    handleRefClicked(id){
        this.props.history.push("/view/id/" + id);
    }


    render() {

        const {modalVisible, modalData, dictData, isLoaded, error} = this.state;
        
        return (
        
            <div>
                <table className="teaser">
                    <thead>
                        <tr>
                            <th>Lemma</th>
                            <th>Full Forms</th>
                            <th>Preview (Graßmann)</th>
                            <th>Entries (Graßmann)</th>
                            <th>Others</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dictData.map((token, i) => (
                        <tr key={token + i}>
                            <td className="non-expanding bold text-font">{token.lemma}</td>
                            <td className="non-expanding text-font" style={{color:'rgba(0,0,0,0.4)'}}>
                                <span>({token.tokens.map((t, i ) => t + (i < token.tokens.length - 1 ? ", " : ""))})</span>
                            </td>
                            <td className="expanding text-font">
                                {token.dict !== undefined && token.dict[0].graTxt}
                            </td>
                            <td className="non-expanding">
                                {token.lemmaRefs !== undefined && token.lemmaRefs !== null && token.lemmaRefs.map((ref, i) => {
                                    let entry = token.dict === undefined ? undefined
                                        : token.dict.find(d => d.graRef === ref);
                                    return  <Button
                                            disabled={!isLoaded || error !== undefined}
                                            className="dict-link gap-right"
                                            onClick={e => this.openDict(entry)}
                                            title={"Show full entry for \"" + token.lemma + "\": #" + (i+1)}
                                            key={"lemma_" + i}>
                                                <Icon type="book"/>
                                                {"#" + (i+1)}
                                            </Button>;
                                })}
                            </td>
                            <td>n/a</td>
                        </tr>))}
                    </tbody>
                </table>

                {isLoaded && modalVisible && modalData !== undefined && error === undefined &&
                    <Modal
                    title={<div><span className="bold">Grassmann: </span><span className="text-font">{modalData.graLemma}</span></div>}
                    centered
                    footer={null}
                    visible={true}
                    onOk={this.closeDict}
                    onCancel={this.closeDict}
                    okText="OK">
                        <div key={modalData.lemmaRef}>
                            <div style={{textAlign:"right"}}>
                                <a href={modalData.graPageUri} target="_blank" rel="noopener noreferrer"><Icon type="eye"/> View original scan of this entry</a>
                            </div>
                            <span className="deva-font" style={{color:"#000"}}>{modalData.graDeva}</span><br/>
                            <div
                            className="dict-tei-render text-font"
                            dangerouslySetInnerHTML={{__html: this.generateDictHTML(modalData.graHtml)}}></div>
                        </div>
                    </Modal>
                }

                {isLoaded && error !== undefined &&
                    <span className="red secondary-font">
                        <Icon type="meh"/> There was an error loading the dictionary data. Please try again later.
                    </span>
                }
            </div>
        );
    }
}

export default DictionaryView;