import React, { Component } from "react";
import { Table, Pagination, Spin, Icon } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import ErrorMessage from "./ErrorMessage";

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';


class SearchResults extends Component {


    constructor(props) {
        super(props)
        this.state ={
            data: {},
            queryData: "",
            isLoaded: false
        }
    }

    componentDidMount(){
        this.loadData(this.props.match.params.querydata);
    }

    componentDidUpdate(){
        if (this.state.queryData !== this.props.match.params.querydata)
            this.loadData(this.props.match.params.querydata);
    }

    loadData(queryData){
        let queryJson = {};

        try {
            queryJson = JSON.parse(Base64.decode(queryData));
        } catch (e) {
            this.setState({
                isLoaded: true,
                error: "Invalid search data."
            });
            return;
        }

        //console.log("QUERY: " + JSON.stringify(queryJson));

        this.setState({
            isLoaded: false,
            error: undefined,
            queryData: queryData,
            queryDisplay: queryJson.mode === "grammar" ? "grammar search" : queryJson.input
        });

        //request search api data
        axios.post("/api/search", queryJson)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
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

        const { error, isLoaded, data } = this.state;

        //console.log(JSON.stringify(data));

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: loc => <Link to={"/view/id/" + loc}>{loc}</Link>,
          }, {
            title: 'Text',
            dataIndex: 'text',
            key: 'text'
          }, {
            title: 'Relevance',
            dataIndex: 'relevance',
            key: 'relevance'
          }];
          
        //map table data
        const tableData = data.hits === undefined ? {} :
            data.hits.hits.map( (hit, i) => ({
                key: 'result_' + i,
                location:   
                    (hit._source.book + "").padStart(2, "0") + "." +
                    (hit._source.hymn + "").padStart(3, "0") + "." +
                    (hit._source.verse + "").padStart(2, "0"),
                //text: hit._source.form,
                text: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>,  // <---- how to force react to render this???
                relevance: hit._score
            }));


        return (

            <Spin
            size="large"
            indicator={<Icon type="loading" spin style={{ fontSize: 38 }}/>}
            delay={200}
            spinning={!isLoaded}>

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
                            { isLoaded && data.hits.hits !== undefined &&
                                <div className="search-stats bottom-gap">
                                    Hits: {data.hits.total} &mdash; Took: {data.took} ms
                                </div>
                            }

                            {/** RESULTS **/}
                            { isLoaded && data.hits.hits !== undefined
                                && data.hits.hits.length > 0 &&
                                
                                <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={
                                    <Pagination
                                    defaultPageSize={10}
                                    pageSize={10}
                                    current={data.from}
                                    total={data.hits.total}
                                    onChange={this.onPageChange} />
                                } />

                                //+ JSON.stringify(data)
                            }

                            {/** NO RESULTS **/}
                            { isLoaded && data.hits.hits !== undefined
                                && data.hits.hits.length === 0 &&
                                "There are no results for this search."
                            }

                        </div>
                    }
                </div>

            </Spin>
        );
    }

}

export default withRouter(view(SearchResults));