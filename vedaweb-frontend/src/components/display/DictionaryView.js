import React, { Component } from "react";
import { Icon, Modal, Button } from 'antd';
import axios from 'axios';

import "./DictionaryView.css";
import DictCorrection from "../widgets/DictCorrection";
import HelpButton from "../help/HelpButton";

import isoCompare from "../utils/isoCompare";

const parser = new DOMParser();

class DictionaryView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            modalVisible: false,
            modalData: undefined,
            dictData: [],
            error: undefined
        };
        this.setDictContentRef = this.setDictContentRef.bind(this);
    }

    componentDidMount(){
        let lemmaData = this.transform(this.props.data)
            .sort((a, b) => isoCompare(a.lemma, b.lemma));
        
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
            ids(ids: ` + JSON.stringify(lemmaRefs) + `) {
                id
                headwordDeva
                headwordIso
                xml
            }
        }`;

        //request API data
        axios.post("https://api.c-salt.uni-koeln.de/dicts/gra/graphql", {query: GQLQ})
            .then((response) => {
                var dictData = [];
                const entries = response.data.data.ids;

                for (let i = 0; i < lemmaData.length; i++) {
                    let t = lemmaData[i];
                    t["dict"] = t.lemmaRefs.map(ref => {
                        let entry = entries.find(e => e.id === ref);
                        return !entry ? {} : this.parseEntry(entry, parser);
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
    }

    setDictContentRef(ref, htmlNode){
        this.dictContentRef = ref;
        if (this.dictContentRef){
            this.dictContentRef.appendChild(htmlNode);
        }
    }

    parseEntry(entry, parser){
        //no parsing needed:
        let e = {
            graRef: entry.id,
            graDeva: entry.headwordDeva,
            graLemma: entry.headwordIso
        };
        //replace xml self closing tags to prevent paring errors
        e.entryTeiIso = entry.xml.replace(/<(\w+?)\s?\/>/gi, "<$1></$1>");
        //create xmlDOM
        let xDoc = parser.parseFromString(e.entryTeiIso, "text/html");
        //parse graTxt
        e.graTxt = xDoc.getElementsByTagName("sense")[0].innerText || "no preview available";
        //parse graPageUri
        e.graPageUri = xDoc.getElementsByTagName("note")[0]
                             .getElementsByTagName("ref")[0]
                             .getAttribute("target") || null;
        return e;
    }

    generateDictHTML(tei){
        //create DOM
        let xDoc = parser.parseFromString(tei, "text/html").getElementsByTagName("sense")[0];
        //set onClick handlers for dict refs
        let stanzaRefs = xDoc.querySelectorAll("ref[target]");
        //yes, i know. i don't want to do this, either.
        for (let i = 0; i < stanzaRefs.length; i++) {
            let refId = stanzaRefs[i].getAttribute("target").replace(/#/g,"");
            stanzaRefs[i].addEventListener("click", () => {
                this.props.history.push("/view/id/" + refId);
            });
        }
        return xDoc;
    }

    transform(padas){
        let out = [];
        let done = [];

        for (let i = 0; i < padas.length; i++) {
            const pada = padas[i];
            for (let j = 0; j < pada.grammarData.length; j++) {
                const token = pada.grammarData[j];
                if (done.indexOf(token.lemma) === -1){
                    //filter for valid lemma ref IDs
                    let lrefs = token.lemmaRefs;
                    //add dict data object
                    if (lrefs && lrefs.length > 0){
                        out.push({
                            lemma: token.lemma,
                            lemmaRefs: token.lemmaRefs.filter(lref => lref.startsWith("lemma_")),
                            tokens: [token.form],
                            tokenId: pada.index + "/" + token.index
                        });
                    }
                    //mark lemma as done
                    done.push(token.lemma);
                } else {
                    let match = out.find(t => t.lemma === token.lemma);
                    if (match.tokens.indexOf(token.form) === -1){
                        match.tokens.push(token.form);
                        match.tokenId = match.tokenId + "-" + pada.index + "/" + token.index;
                    }
                }
            }
        }
        return out;
    }

    openDict(modalData){
        if (!modalData) return;
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
        
            <div>
                <table className="teaser">
                    <thead>
                        <tr>
                            <th>Lemma</th>
                            <th>Full Forms</th>
                            <th>Preview (Graßmann)</th>
                            <th>Entries (Graßmann) <HelpButton inline iconStyle={{marginLeft: ".3rem"}} type="dict_grassmann"/></th>
                            <th>Others</th>
                            <th>Correction</th>
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
                                {token.dict && token.dict[0] && token.dict[0].graTxt}
                            </td>
                            <td className="non-expanding">
                                {token.lemmaRefs && token.lemmaRefs.map((ref, i) => {
                                    let entry = token.dict === undefined ? undefined
                                        : token.dict.find(d => d.graRef === ref);
                                    return  <Button
                                            disabled={!isLoaded || error}
                                            className="dict-link gap-right"
                                            onClick={() => this.openDict(entry)}
                                            title={"Show full entry for \"" + token.lemma + "\": #" + (i+1)}
                                            key={"lemma_" + i}>
                                                <Icon type="book"/>
                                                {"#" + (i+1)}
                                            </Button>;
                                })}
                            </td>
                            <td>n/a</td>
                            <td>
                                <DictCorrection lemma={token.lemma} stanzaId={this.props.stanzaId} tokenId={token.tokenId} />
                            </td>
                        </tr>))}
                    </tbody>
                </table>

                {isLoaded && modalVisible && modalData && !error &&
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
                            //dangerouslySetInnerHTML={{__html: this.generateDictHTML(modalData.graHtml)}}
                            ref={(ref) => this.setDictContentRef(ref, this.generateDictHTML(modalData.entryTeiIso))}>
                            </div>
                        </div>
                    </Modal>
                }


                {isLoaded && error &&
                    <span className="red secondary-font">
                        <Icon type="meh"/> There was an error loading the dictionary data. Please try again later.
                    </span>
                }
            </div>
        );
    }
}

export default DictionaryView;