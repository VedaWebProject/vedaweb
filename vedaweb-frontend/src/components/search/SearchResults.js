import React, { Component } from "react";
import { Table, Button } from 'antd';

import { withRouter } from 'react-router-dom';

import ErrorMessage from "../errors/ErrorMessage";

import './SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import stateStore from "../../stateStore";

import fileDownload from "js-file-download";


const fieldDisplayMapping = {
    "form": "Stanza text",
    "form_raw": "Stanza text",
    "translation": "Translation"
}


class SearchResults extends Component {

    constructor(props) {
        super(props)
        this.state = { isLoaded: false, isExportLoaded: true }
        document.title = "VedaWeb | Search Results";
        this.loadData = this.loadData.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleNewQuery = this.handleNewQuery.bind(this);
        this.export = this.export.bind(this);
    }


    componentDidMount(){
        this.handleNewQuery(this.props.match.params.querydata);
    }


    componentDidUpdate(){
        if (stateStore.results.queryEncoded !== this.props.match.params.querydata)
            this.handleNewQuery(this.props.match.params.querydata);
    }


    handleTableChange(pagination) {
        stateStore.results.page = pagination.current;
        stateStore.results.size = pagination.pageSize;
        this.loadData(stateStore.results.queryJSON);
    }


    handleNewQuery(queryData) {
        //scroll to top
        window.scrollTo(0, 0);

        this.setState({ isLoaded: false });

        stateStore.results.queryEncoded = queryData;
        stateStore.results.page = 1;

        let queryJSON = {};

        try {
            queryJSON = JSON.parse(Base64.decode(queryData));
            //console.log(JSON.stringify(queryJSON)); //TEMP DEV
            queryJSON.from = 0;
            queryJSON.size = stateStore.results.size;
            stateStore.results.queryJSON = queryJSON;
        } catch (e) {
            this.setState({
                isLoaded: true,
                error: "Invalid search data."
            });
            return;
        }

        this.loadData(queryJSON);
    }


    loadData(queryJSON) {
        //construct "Search Results for ..." data
        let queryDisplay = {
            query: queryJSON.mode === "grammar"
                ? "[" + queryJSON.blocks.map(b =>
                    Object.keys(b).filter(k => k !== 'distance' && k !== 'lemma' && b[k] !== undefined && b[k] !== '')
                        .map(k => k + ': ' + b[k]).join(', ')).join('] & [') + "]"
                : queryJSON.input,
            field:  queryJSON.mode === "grammar"
                ? "grammar data"
                : stateStore.ui.layers.find(l => l.id === queryJSON.field).label
        };

        //enable view for searched field automatically
        if (queryJSON.mode === "quick")
            stateStore.ui.toggleLayer(queryJSON.field, true);
        else if (queryJSON.mode === "grammar")
            stateStore.ui.toggleLayer("glossing_", true);
            
        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryDisplay
        });

        //set page title
        document.title = "VedaWeb | Search Results for '" + queryDisplay.query + "'";

        //pagination and request size
        queryJSON.from = ((stateStore.results.page - 1) * stateStore.results.size);
        queryJSON.size = stateStore.results.size;

        //console.log(JSON.stringify(queryJSON));

        //request search api data
        axios.post(process.env.PUBLIC_URL + "/api/search", queryJSON)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                stateStore.results.resultsData = response.data;
                stateStore.results.total = response.data.total;
                
                this.setState({
                    isLoaded: true,
                    tableData: response.data.hits === undefined ? {} :
                        response.data.hits.map( (hit, i) => ({
                            key: 'result_' + i,
                            location: hit.docId,
                            text: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>,
                            addressee: hit.hymnAddressee,
                            group: hit.hymnGroup,
                            strata: hit.stanzaStrata
                        }))
                });

                stateStore.results.queryJSON = queryJSON;
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }


    createHighlightHTML(hit) {
        let html = "";

        if (hit.highlight !== undefined && Object.keys(hit.highlight).length > 0){
            Object.keys(hit.highlight).forEach(highlightField => {
                html +=
                    "<span class='red text-font bold'>" +
                    (fieldDisplayMapping[highlightField] !== undefined ? fieldDisplayMapping[highlightField] : highlightField) +
                    ":</span> " +
                    hit.highlight[highlightField]
                    + "<br/>";
            });
        } else {
            html += "<i>no preview available</i>";
        }

        return {__html: html};
    }


    onResultClick(location){
        this.props.history.push("/view/id/" + location);
    }


    export(){
        this.setState({ isExportLoaded: false });

        axios.post(process.env.PUBLIC_URL + "/api/export/search", stateStore.results.queryJSON)
            .then((response) => {
                this.setState({
                    isExportLoaded: true
                });
                fileDownload(response.data, "vedaweb-search-results.csv");
            })
            .catch((error) => {
                this.setState({
                    isExportLoaded: true
                });
                alert("There was an error generating the data.");
            });
    }


    render() {

        const { error, isLoaded } = this.state;
        const data = stateStore.results.resultsData;

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            className: 'loc-col',
            render: loc => <span className="primary-font bold red">{loc}</span>,
            //render: loc => <Link to={"/view/id/" + loc}>{loc}</Link>,
          }, {
            title: 'Search Hit Context',
            dataIndex: 'text',
            key: 'text',
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Addressee',
            dataIndex: 'addressee',
            key: 'addressee',
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Strata',
            dataIndex: 'strata',
            key: 'strata',
          }];
          
        return (

                <div className="page-content">

                    {/** ERROR **/}
                    { isLoaded && error !== undefined &&
                        <ErrorMessage/>
                    }

                    {/** SEARCH RESULT VIEW **/}
                    { error === undefined &&

                        <div id="search-results" className="card">

                            { this.state.queryDisplay !== undefined &&
                                <h1>
                                    Search Results for
                                    <span className="text-font grey"> "{this.state.queryDisplay.query}" </span>
                                    in<span className="text-font grey"> "{this.state.queryDisplay.field}"</span>
                                    <Button type="secondary" icon={this.state.isExportLoaded ? "export" : "loading"} onClick={this.export} title="Export CSV" style={{marginLeft:"1rem"}}/>
                                </h1>
                            }

                            {/** SEARCH STATS **/}
                            
                            <div className="search-stats secondary-font">
                                { isLoaded && data.hits !== undefined ?
                                    data.total > 0 ?
                                        <span>
                                            Found <span className="bold">{data.total}</span> matching stanzas in { data.took } ms
                                        </span> : ""
                                     : <span>Searching ...</span>
                                }
                            </div>
                            
                            {/** RESULTS **/}
                            <Table
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={!this.state.isLoaded}
                            locale={{emptyText: 'There are no results for this search.'}}
                            onRow={(record) => ({ onClick: () => { this.onResultClick(record.location) } })}
                            pagination={{
                                pageSize: stateStore.results.size,
                                current: stateStore.results.page,
                                total: stateStore.results.total,
                                position: 'both',
                                showSizeChanger: true,
                                pageSizeOptions: ['10','25','50','100']
                            }}
                            onChange={this.handleTableChange} />

                        </div>
                    }
                </div>

            // </Spin>
        );
    }

}

export default withRouter(view(SearchResults));