import React, { Component } from "react";
import { Table } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import ErrorMessage from "./ErrorMessage";

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import searchResultsStore from "./stores/searchResultsStore";
import uiDataStore from "./stores/uiDataStore";

const fieldDisplayMapping = {
    "form": "Stanza text",
    "form_raw": "Stanza text",
    "translation": "Translation"
}


class SearchResults extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false
        }
        document.title = "VedaWeb | Search Results";
        this.loadData = this.loadData.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleNewQuery = this.handleNewQuery.bind(this);
    }

    componentDidMount(){
        this.handleNewQuery(this.props.match.params.querydata);
    }

    componentDidUpdate(){
        if (searchResultsStore.queryEncoded !== this.props.match.params.querydata)
            this.handleNewQuery(this.props.match.params.querydata);
    }

    handleTableChange(pagination) {
        searchResultsStore.page = pagination.current;
        searchResultsStore.size = pagination.pageSize;
        this.loadData(searchResultsStore.queryJSON);
    }

    handleNewQuery(queryData) {
        this.setState({
            isLoaded: false
        });

        searchResultsStore.queryEncoded = queryData;
        searchResultsStore.page = 1;

        let queryJSON = {};

        try {
            queryJSON = JSON.parse(Base64.decode(queryData));
            queryJSON.from = 0;
            queryJSON.size = searchResultsStore.size;
            searchResultsStore.queryJSON = queryJSON;
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
                ? queryJSON.blocks.map(b => Object.keys(b).filter(k => k !== 'distance' && k !== 'lemma')
                    .map(k => k + ': ' + b[k]).join(', ')).join('; ')
                : queryJSON.input,
            field:  queryJSON.mode === "grammar"
                ? "Grammar Data"
                : uiDataStore.layers.find(l => l.id === queryJSON.field).label
        };

        //enable view for searched field automatically
        if (queryJSON.mode === "smart")
            uiDataStore.toggleLayer(queryJSON.field, true);
        else if (queryJSON.mode === "grammar")
            uiDataStore.toggleLayer("glossing_", true);
            
        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryDisplay
        });

        //set page title
        document.title = "VedaWeb | Search Results for '" + queryDisplay.query + "'";

        //pagination and request size
        queryJSON.from = ((searchResultsStore.page - 1) * searchResultsStore.size);
        queryJSON.size = searchResultsStore.size;

        //console.log(JSON.stringify(queryJSON));

        //request search api data
        axios.post(process.env.PUBLIC_URL + "/api/search", queryJSON)
            .then((response) => {
                searchResultsStore.resultsData = response.data;
                searchResultsStore.total = response.data.total;
                
                this.setState({
                    isLoaded: true,
                    tableData: response.data.hits === undefined ? {} :
                        response.data.hits.map( (hit, i) => ({
                            key: 'result_' + i,
                            location: hit.docId,
                            text: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>,
                            addressee: hit.hymnAddressee,
                            group: hit.hymnGroup,
                            strata: hit.verseStrata
                        }))
                });
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
                    "<span class='red main-font'>" +
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


    render() {

        const { error, isLoaded } = this.state;
        const data = searchResultsStore.resultsData;

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            className: 'loc-col',
            render: loc => <Link to={"/view/id/" + loc}>{loc}</Link>,
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
                                <h4>
                                    Search Results for
                                    <span className="text-font grey"> "{this.state.queryDisplay.query}" </span>
                                    in<span className="text-font grey"> "{this.state.queryDisplay.field}"</span>
                                </h4>
                            }

                            {/** SEARCH STATS **/}
                            
                            <div className="search-stats secondary-font">
                                { isLoaded && data.hits !== undefined ?
                                    data.total > 0 ?
                                        <span>Found { data.total } matching stanzas in { data.took } ms</span>
                                        : ""
                                     : <span>Searching ...</span>
                                }
                            </div>
                            
                            {/** RESULTS **/}
                            <Table
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={!this.state.isLoaded}
                            locale={{emptyText: 'There are no results for this search.'}}
                            pagination={{
                                pageSize: searchResultsStore.size,
                                current: searchResultsStore.page,
                                total: searchResultsStore.total,
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