import React, { Component } from "react";
import { Select, Modal, Button, Input, Card } from 'antd';
import axios from 'axios';

const Option = Select.Option;
const { TextArea } = Input;

class DictCorrection extends Component {


    constructor(props){
        super(props);

        this.state = {
            isLoaded: true,
            suggestions: [],
            input: "",
            value: null,
            visible: false,
            comment: "",
            corrections: []
        }

        this.suggest = this.suggest.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.loadCorrections = this.loadCorrections.bind(this);
    }


    loadCorrections(){
        this.setState({ isLoaded: false });

        axios.post(process.env.PUBLIC_URL + "/api/corrections/lemma", { caseId: this.props.stanzaId + "_" + this.props.tokenId } )
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    corrections: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    corrections: []
                });
                alert("There was an error retrieving previous corrections.");
            });
    }


    componentDidUpdate(prevProps, prevState){
        if (!prevState.visible && this.state.visible){
            this.loadCorrections();
        }
    }


    suggest(input) {
        this.setState({isLoaded: false});

        let query = `
            {
                entries(queryType: fuzzy, field: headword_iso, query: "` + input + `") {
                    id
                    headwordIso
                }
            }
        `;

        axios.post("https://api.c-salt.uni-koeln.de/dicts/gra/graphql", {query: query})
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    suggestions: response.data.data.entries
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    suggestions: []
                });
                alert("There was an error generating suggestions data.");
            });
    }


    onChange(input){
        this.setState({ input: input });
        if (this.timeout) clearTimeout(this.timeout);
        if (input && input.length > 0){
            this.setState({ isLoaded: false });
            this.timeout = setTimeout(() => {
                this.suggest(input);
            }, 500);
        }
    }


    onSelect(key){
        let selected = this.state.suggestions.find(s => s.id === key);
        if (!selected) return;
        this.setState({
            value: selected,
            input: selected.headwordIso
        })
    }


    submit(){
        let correction = {
            caseId: (this.props.stanzaId + "_" + this.props.tokenId),
            lemma: this.props.lemma,
            dictId: this.state.value.id,
            headwordIso: this.state.value.headwordIso,
            comment: this.state.comment
        };

        axios.post(process.env.PUBLIC_URL + "/api/corrections/save", correction)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    suggestions: [],
                    input: "",
                    value: null,
                    visible: false,
                    comment: ""
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    suggestions: [],
                    input: "",
                    value: null,
                    visible: false,
                    comment: ""
                });
                alert("Error saving correction :(");
            });
    }


    render() {

        const { isLoaded, suggestions, input, value, visible, comment, corrections } = this.state;
        
        return (
            <div style={{display:"inline-block"}}>
                <Button icon="api" onClick={() => this.setState({visible: true})}/>
                { visible &&
                    <Modal
                    title={<div>Correct dict. relation for: <strong className="text-font">{this.props.lemma}</strong></div>}
                    centered
                    destroyOnClose={true}
                    visible={visible}
                    onOk={this.submit}
                    onCancel={() => this.setState({visible: false})}
                    onClose={() => this.setState({visible: false})}
                    okText="Save Correction">

                            {/** PREVIOUS CORRECTIONS */}
                            { corrections && corrections.length > 0 &&
                                <div style={{marginBottom: "1rem"}}>
                                    <h3>Previous corrections</h3>
                                    {corrections.map((c, i) =>
                                        <Card
                                        size="small"
                                        title={c.lemma + " → " + c.dictId}
                                        className="main-font bottom-gap"
                                        style={{backgroundColor: "#f5f5f5"}}
                                        key={"corr_" + i}>
                                            <strong>lemma: </strong><span className="text-font">{c.lemma}</span><br/>
                                            <strong>headword: </strong><span className="text-font">{c.headwordIso}</span><br/>
                                            <strong>dict.id: </strong><span>{c.dictId}</span><br/>
                                            <strong>case location: </strong><span>{c.caseId}</span><br/>
                                            <strong>comment: </strong><span>{c.comment}</span>
                                        </Card>
                                    )}
                                </div>
                            }
                            

                            {/** DICT ENTRY SEARCH */}
                            <h3>Propose new correction</h3>
                            Search for dictionary lemma: 
                            <Select
                            placeholder="Search for dictionary lemma"
                            showSearch
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            className="text-font"
                            style={{width: "100%", marginBottom: "1rem"}}
                            filterOption={false}
                            notFoundContent={null}
                            value={input}
                            onSearch={this.onChange}
                            onSelect={this.onSelect}
                            loading={!isLoaded} >

                                { isLoaded && suggestions && suggestions.length > 0 &&
                                    suggestions.map(s => 
                                        <Option className="text-font" key={s.id}>{s.headwordIso + " (" + s.id + ")"}</Option>
                                    )
                                }

                            </Select>
                            
                            {/** SELECTED DICT ENTRY */}
                            { value &&
                                <div className="text-font">
                                    <strong>headword: </strong>{value.headwordIso}<br/>
                                    <strong>headword Deva: </strong>{value.headwordDeva}<br/>
                                    <strong>id: </strong>{value.id}<br/>
                                </div>
                            }

                            {/** COMMENT */}
                            <TextArea
                            placeholder="Comment (optional)"
                            value={comment}
                            onChange={e => this.setState({comment: e.target.value})}
                            rows={4}
                            style={{marginTop: "1rem"}} />

                    </Modal>
                }
            </div>
        );

    }
}

export default DictCorrection;