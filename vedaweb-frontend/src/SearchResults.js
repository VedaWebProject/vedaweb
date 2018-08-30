import React, { Component } from "react";
import { Table, Icon } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import ErrorMessage from "./ErrorMessage";

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import searchResultsStore from "./stores/searchResultsStore";


class SearchResults extends Component {


    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount(){
        this.handleNewQuery(this.props.match.params.querydata);
    }

    componentDidUpdate(){
        if (searchResultsStore.queryEncoded !== this.props.match.params.querydata)
            this.handleNewQuery(this.props.match.params.querydata);
    }

    handleTableChange = (pagination) => {
        searchResultsStore.page = pagination.current;
        searchResultsStore.size = pagination.pageSize;
        this.loadData(searchResultsStore.queryJSON);
    }

    handleNewQuery = (queryData) => {
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
        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryJSON.mode === "grammar" ? "grammar search" : queryJSON.input
        });

        queryJSON.from = ((searchResultsStore.page - 1) * searchResultsStore.size);
        queryJSON.size = searchResultsStore.size;

        //request search api data
        axios.post("/api/search", queryJSON)
            .then((response) => {
                searchResultsStore.resultsData = response.data;
                searchResultsStore.total = response.data.hits.total;
                this.setState({
                    isLoaded: true,
                    tableData: response.data.hits === undefined ? {} :
                        response.data.hits.hits.map( (hit, i) => ({
                            key: 'result_' + i,
                            location:   
                                (hit._source.book + "").padStart(2, "0") + "." +
                                (hit._source.hymn + "").padStart(3, "0") + "." +
                                (hit._source.verse + "").padStart(2, "0"),
                            text: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>
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

        if (hit.highlight !== undefined){
            Object.keys(hit.highlight).forEach(function (key) {
                if (hit.highlight[key].length > 0){
                    for (let high in hit.highlight[key])
                    html += (html.length > 0 ? " &mdash; " : "") + hit.highlight[key][high];
                }
            });
        } else {
            html = hit._source.form;
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
            render: loc => <Link to={"/view/id/" + loc}>{loc}</Link>,
          }, {
            title: 'Text',
            dataIndex: 'text',
            key: 'text',
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
                                Search Results for <span className="trans-font grey">{this.state.queryDisplay}</span>
                            </h4>


                            {/** SEARCH STATS **/}
                            
                            <div className="search-stats bottom-gap secondary-font">
                                { isLoaded && data.hits.hits !== undefined ?
                                    data.hits.total > 0 ?
                                        <span>
                                            Results: { data.hits.total } &mdash;
                                            Took: { data.took } ms
                                        </span>
                                        :
                                        <span>
                                            There are no results for this search. <Icon type="frown-o"/>
                                        </span>
                                     : <span>Searching ...</span>
                                }
                            </div>
                            
                            {/** RESULTS **/}
                            <Table
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={!this.state.isLoaded}
                            locale={{emptyText: 'No results'}}
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