import React, { Component } from "react";
import { Table, Button, Modal } from 'antd';

import { withRouter } from 'react-router-dom';

import ErrorMessage from "../errors/ErrorMessage";

import './SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import stateStore from "../../stateStore";

import ExportButton from "../widgets/ExportButton";
import RelevanceMeter from "./RelevanceMeter";

const fieldDisplayMapping = {
    "form": "Stanza text",
    "form_raw": "Stanza text",
    "translation": "Translation"
}


class SearchResults extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            isOccCountLoaded: true,
            occCount: null
        }
        document.title = "VedaWeb | Search Results";
        this.loadData = this.loadData.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleNewQuery = this.handleNewQuery.bind(this);
        this.occCount = this.occCount.bind(this);
    }


    componentDidMount(){
        this.handleNewQuery(this.props.match.params.querydata);
    }


    componentDidUpdate(){
        if (stateStore.results.queryEncoded !== this.props.match.params.querydata)
            this.handleNewQuery(this.props.match.params.querydata);
    }


    handleTableChange(pagination, filters, sorter) {
        this.setState({ isLoaded: false });
        //results window
        stateStore.results.query.from = ((pagination.current - 1) * pagination.pageSize);
        stateStore.results.query.page = pagination.current;
        stateStore.results.query.size = pagination.pageSize;
        //sorting
        stateStore.results.query.sortBy = sorter.field ? sorter.field : null;
        stateStore.results.query.sortOrder = sorter.order ? sorter.order : null;
        //run search
        this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(stateStore.results.query)));
    }


    handleNewQuery(queryData) {
        this.setState({ isLoaded: false });

        //store base64 encoded query
        stateStore.results.queryEncoded = queryData;

        //decode base64 encoded query
        try {
            stateStore.results.query = JSON.parse(Base64.decode(queryData));
        } catch (e) {
            this.setState({
                isLoaded: true,
                error: "Invalid search data."
            });
            return;
        }

        window.scrollTo(0, 0);
        this.loadData(stateStore.results.query);
    }


    loadData(queryJSON) {

        //construct "Search Results for ..." data
        let queryDisplay = {
            query: queryJSON.mode === "grammar"
                ? "[" + queryJSON.blocks.map(b =>
                    Object.keys(b).filter(k => k !== 'distance' && b[k] !== undefined && b[k] !== '')
                        .map(k => k + ': ' + b[k]).join(', ')).join('] & [') + "]"
                : queryJSON.input,
            field:  queryJSON.mode === "grammar" ? "grammar data"
                : stateStore.ui.layers.find(l => l.id === queryJSON.field).label
        };

        //enable view for searched field automatically
        if (queryJSON.mode === "grammar")
            stateStore.ui.toggleLayer("glossing_", true);
        else
            stateStore.ui.toggleLayer(queryJSON.field, true);
        
        //update component state for search process
        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryDisplay
        });

        //set page title
        document.title = "VedaWeb | Search Results for " + queryDisplay.query;

        //request search api data
        axios.post(process.env.PUBLIC_URL + "/api/search/" + queryJSON.mode, queryJSON)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                stateStore.results.resultsData = response.data;

                this.setState({
                    isLoaded: true,
                    tableData: response.data.hits === undefined ? {} :
                        response.data.hits.map( (hit, i) => ({
                            key: 'result_' + i,
                            _doc: hit.docId,
                            context: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>,
                            hymnAddressee: hit.hymnAddressee,
                            hymnGroup: hit.hymnGroup,
                            strata: hit.stanzaStrata,
                            _score: hit.score
                        }))
                });

                //stateStore.results.queryJSON = queryJSON;

                //scroll to top after loading new data
                window.scrollTo(0, 0);
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

        if (hit.highlight && Object.keys(hit.highlight).length > 0){
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


    occCount(){
        this.setState({ isOccCountLoaded: false });

        axios.post(process.env.PUBLIC_URL + "/api/search/occ", stateStore.results.query)
            .then((response) => {
                this.setState({
                    isOccCountLoaded: true,
                    occCount: response.data.count
                });
            })
            .catch((error) => {
                this.setState({
                    isOccCountLoaded: true,
                    occCount: "Error retrieving"
                });
                Modal.error({ title: "Error", content: 'There was an error retrieving the data', okText: 'OK' });
            });
    }


    occCountAvailable(){
        return stateStore.results.query.mode === "grammar"
            && stateStore.results.query.blocks.length === 1;
    }


    render() {

        const { error, isLoaded } = this.state;
        const data = stateStore.results.resultsData;

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: '_doc',
            key: '_doc',
            className: 'loc-col',
            sorter: true,
            sortOrder: stateStore.results.query.sortBy === "_doc" ? stateStore.results.query.sortOrder : false,
            render: loc => <span className="primary-font bold red">{loc}</span>,
          }, {
            title: 'Context',
            dataIndex: 'context',
            key: 'context',
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Addressee',
            dataIndex: 'hymnAddressee',
            key: 'hymnAddressee',
            sorter: true,
            sortOrder: stateStore.results.query.sortBy === "hymnAddressee" ? stateStore.results.query.sortOrder : false,
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Group',
            dataIndex: 'hymnGroup',
            key: 'hymnGroup',
            sorter: true,
            sortOrder: stateStore.results.query.sortBy === "hymnGroup" ? stateStore.results.query.sortOrder : false,
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Strata',
            dataIndex: 'strata',
            key: 'strata',
            sorter: true,
            sortOrder: stateStore.results.query.sortBy === "strata" ? stateStore.results.query.sortOrder : false,
            render: content => <div style={{textAlign:"center"}}>{content}</div>
          }, {
            title: 'Relevance',
            dataIndex: '_score',
            key: '_score',
            render: content => <div style={{textAlign:"center"}}><RelevanceMeter max={stateStore.results.resultsData.maxScore} value={content}/></div>
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

                            {/** SEARCH RESULTS HEADING **/}

                            { this.state.queryDisplay !== undefined &&
                                <h1>
                                    Search Results for
                                    <span className="text-font grey"> {this.state.queryDisplay.query} </span>
                                    in<span className="text-font grey"> {this.state.queryDisplay.field}</span>

                                    {/** EXPORT AND OCCURRENCES FUNCTIONS **/}

                                    <ExportButton
                                    buttonType="secondary"
                                    text="Export as CSV"
                                    title="Export results as CSV file"
                                    reqMethod="post"
                                    reqUrl={process.env.PUBLIC_URL + "/api/export/search/" + stateStore.results.query.mode}
                                    reqData={stateStore.results.query}
                                    fileName={"VedaWeb-search-results.csv"}
                                    style={{marginLeft:"1rem", float:"right"}} />

                                    {this.occCountAvailable() &&
                                        <Button
                                        type="secondary"
                                        icon={!this.state.isOccCountLoaded ? "loading" : !this.state.occCount ? "bar-chart" : null}
                                        children={this.state.occCount ? (this.state.occCount + " total occurrences") : "Total occurrences"}
                                        disabled={this.state.isOccCountLoaded && this.state.occCount}
                                        onClick={this.occCount}
                                        title="Request occurrences info for this search"
                                        style={{marginLeft:"1rem", float:"right"}}/>
                                    }
                                </h1>
                            }


                            {/** SEARCH META INFO **/}
                            
                            <div className="search-stats secondary-font bottom-gap top-gap">
                                { isLoaded && data.hits !== undefined ?
                                    data.total > 0 ?
                                        <span>
                                            Found <span className="bold">{data.total}</span> matching stanzas in { data.took } ms
                                        </span> : ""
                                     : <span>Searching ...</span>
                                }
                            </div>


                            {/** DISPLAY SEARCH RESULTS TABLE **/}

                            <Table
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={!this.state.isLoaded}
                            locale={{emptyText: 'There are no results for this search.'}}
                            onRow={(record) => ({ onClick: () => { this.onResultClick(record._doc) } })}
                            sortDirections={['ascend', 'descend']}
                            pagination={{
                                pageSize: stateStore.results.query.size,
                                current: stateStore.results.query.page,
                                total: stateStore.results.resultsData.total,
                                position: 'both',
                                showSizeChanger: true,
                                pageSizeOptions: ['10','25','50','100']
                            }}
                            onChange={this.handleTableChange} />

                        </div>
                    }
                </div>
        );
    }

}

export default withRouter(view(SearchResults));