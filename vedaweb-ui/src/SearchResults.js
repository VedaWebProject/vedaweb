import React, { Component } from "react";
import { Table } from 'antd';
import Spinner from "./Spinner";

import { Link, withRouter } from 'react-router-dom';

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';


class SearchResults extends Component {


    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false
        }
    }

    componentDidMount(){
        let queryData = JSON.parse(Base64.decode(this.props.match.params.querydata));
        this.loadData(queryData);
    }

    componentWillReceiveProps(newProps){
        let queryData = JSON.parse(Base64.decode(newProps.match.params.querydata));
        this.loadData(queryData);
    }

    loadData(queryData){
        console.log("QUERY: " + JSON.stringify(queryData));
        this.setState({
            isLoaded: false,
            error: undefined
        });

        if (queryData.hasOwnProperty("smart")){
            this.loadSmartSearchData(queryData);
        } else {
            this.loadAdvancedSearchData(queryData);
        }
    }

    loadSmartSearchData(queryData){
        axios.get("/api/search/smart/" + queryData.smart)
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

    loadAdvancedSearchData(queryData){
        axios.get("/api/search/smart/blablabla")
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


    render() {

        const { error, isLoaded, data } = this.state;

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
                    (hit.sourceAsMap.book + "").padStart(2, "0") + "." +
                    (hit.sourceAsMap.hymn + "").padStart(3, "0") + "." +
                    (hit.sourceAsMap.verse + "").padStart(2, "0"),
                text: hit.sourceAsMap.form,
                relevance: hit.score
            }));

            

        return (

            <div className="page-content">
                <div id="search-results" className="content card">

                    <h4>Search Results</h4>

                    {/** LOADING SPINNER **/}
                    {!isLoaded &&
                        <Spinner/>
                    }

                    {/** ERROR **/}
                    {isLoaded && error !== undefined &&
                        <div className="card">
                            There was an error requesting this data.
                        </div>
                    }

                    {/** SEARCH STATS **/}
                    { isLoaded && data.hits.hits !== undefined &&
                        <div class="search-stats bottom-gap">
                            Hits: {data.hits.hits.length} &mdash; Took: {data.took.stringRep}
                        </div>
                    }

                    {/** RESULTS **/}
                    {isLoaded && error === undefined &&
                        //JSON.stringify(data) +
                        <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false} />
                    }

                </div>
            </div>
        );
    }

}

export default withRouter(view(SearchResults));