import React, { Component } from "react";
import { Select, Modal, Button, Input } from 'antd';
import axios from 'axios';

const Option = Select.Option;
const { TextArea } = Input;

class DictCorrection extends Component {


    constructor(props){
        super(props);

        this.state = {
            isLoaded: true,
            error: null ,
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

        axios.post(process.env.PUBLIC_URL + "/api/corrections/lemma", { lemma: this.props.lemma } )
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    error: null,
                    corrections: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error,
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
                entries(dictId: "gra", queryType: "prefix", field: "headword_iso", query: "` + input + `") {
                    id
                    headwordDeva
                    headwordIso
                }
            }
        `;

        axios.post("https://api.c-salt.uni-koeln.de/dicts/sa/graphql", {query: query})
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    error: null,
                    suggestions: response.data.data.entries
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error,
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
            lemma: this.props.lemma,
            dictId: this.state.value.id,
            headwordIso: this.state.value.headwordIso,
            comment: this.state.comment
        };

        axios.post(process.env.PUBLIC_URL + "/api/corrections/save", correction)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    error: null ,
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
                    error: null ,
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
        
        return (
            <div style={{display:"inline-block"}}>
                <Button icon="api" onClick={() => this.setState({visible: true})}/>
                { this.state.visible &&
                    <Modal
                    title={<div>Correct dict. relation for: <strong className="text-font">{this.props.lemma}</strong></div>}
                    centered
                    destroyOnClose={true}
                    visible={this.state.visible}
                    onOk={this.submit}
                    onCancel={() => this.setState({visible: false})}
                    onClose={() => this.setState({visible: false})}
                    okText="Save Correction">

                            {/** PREVIOUS CORRECTIONS */}
                            { this.state.corrections && this.state.corrections.length > 0 &&
                                <div style={{marginBottom: "1rem"}}>
                                    <h3>Previous corrections</h3>
                                    {this.state.corrections.map((c, i) =>
                                        <div
                                        style={{marginBottom: "1rem"}}
                                        className="text-font"
                                        key={"corr_" + i}>
                                            <strong>headword: </strong>{c.headwordIso}<br/>
                                            <strong>dict.id: </strong>{c.dictId}<br/>
                                            <strong>comment: </strong>{c.comment}
                                        </div>
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
                            value={this.state.input}
                            onSearch={this.onChange}
                            onSelect={this.onSelect}
                            loading={!this.state.isLoaded} >

                                { this.state.isLoaded && this.state.suggestions && this.state.suggestions.length > 0 &&
                                    this.state.suggestions.map(s => 
                                        <Option className="text-font" key={s.id}>{s.headwordIso + " - " + s.headwordDeva}</Option>
                                    )
                                }

                            </Select>
                            
                            {/** SELECTED DICT ENTRY */}
                            { this.state.value &&
                                <div className="text-font">
                                    <strong>headword: </strong>{this.state.value.headwordIso}<br/>
                                    <strong>headword Deva: </strong>{this.state.value.headwordDeva}<br/>
                                    <strong>id: </strong>{this.state.value.id}<br/>
                                </div>
                            }

                            {/** COMMENT */}
                            <TextArea
                            placeholder="Comment (optional)"
                            value={this.state.comment}
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