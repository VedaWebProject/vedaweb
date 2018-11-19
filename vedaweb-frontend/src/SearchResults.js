import React, { Component } from "react";
import { Table } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import ErrorMessage from "./ErrorMessage";

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import searchResultsStore from "./stores/searchResultsStore";

const fieldDisplayMapping = {
    "form": "Verse text",
    "form_raw": "Verse text",
    "translation": "Translation",
    "lemmata": "Lemmata",
    "lemmata_raw": "Lemmata"
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

    loadData = (queryJSON) => {
        let queryDisplay = queryJSON.mode === "grammar" ? "grammar search" : queryJSON.input;

        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryDisplay
        });

        document.title = "VedaWeb | Search Results for '" + queryDisplay + "'";

        queryJSON.from = ((searchResultsStore.page - 1) * searchResultsStore.size);
        queryJSON.size = searchResultsStore.size;

        //request search api data
        axios.post("/api/search", queryJSON)
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
            html += hit.source.form_raw.join(" / ");
        }

        // //normalize hits and inner_hits (incomplete I)
        // let hits = superHit.inner_hits === undefined
        //         ? [superHit]
        //
        //         : (innerFields = superHit.inner_hits) => {
        //             let innerHits = [];
        //             Object.keys(innerFields).forEach(key => {
        //                 let innerField = superHit.inner_hits[key];

        //             });
        //             return innerHits;
        //         }

        // // (incomplete II)
        //         // : Object.keys(superHit.inner_hits).map(innerName => {
        //         //     let innerHits = [];
        //         //     superHit.inner_hits[innerName].hits.hits
        //         //     return innerHits;
        //         // });

        //process hit(s)
            // if (hit.highlight !== undefined){
            //     Object.keys(hit.highlight).sort().forEach( i => {
            //         if (hit.highlight[i].length > 0){
            //             for (let high in hit.highlight[i]){
            //                 html += "<span class='red'>" + fieldDisplayMapping[i] + ":</span> ";
            //                 html += hit.highlight[i][high] + " ";
            //                 html += "<br/>"
            //             }
            //         }
            //     });
            // } else {
            //     for (let form in hit._source.form_raw){
            //         html += hit._source.form_raw[form]
            //             + (form < hit._source.form_raw.length - 1 ? " / " : "");
            //     }
            // }

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
            render: loc => <Link to={"/view/id/" + loc} className="bold" style={{fontSize: '18px'}}>{loc}</Link>,
          }, {
            title: 'Text',
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

                            <h4>
                                Search Results for <span className="text-font grey">"{this.state.queryDisplay}"</span>
                            </h4>

                            {/** SEARCH STATS **/}
                            
                            <div className="search-stats secondary-font">
                                { isLoaded && data.hits.hits !== undefined ?
                                    data.hits.total > 0 ?
                                        <span>Found { data.hits.total } matching verses in { data.took } ms</span>
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