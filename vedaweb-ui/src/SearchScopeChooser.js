import React, { Component } from "react";
import { Row, Col, Slider } from 'antd';

import './SearchScopeChooser.css'


class SearchScopeChooser extends Component {

    constructor(props){
        super(props);

        this.state = {
            fromBook: 0,
            toBook: this.props.bookRange
        };

        this.onChangeBookScope = this.onChangeBookScope.bind(this);
    }

    onChangeBookScope(value){
        this.setState({
            fromBook: value[0],
            toBook: value[1]
        });
    }


    render() {

        return (
            <div id="search-scope-chooser">
                <h3>Search Scope</h3>

                <Row type="flex" align="middle">
                    <Col span={2}>
                        Book:
                    </Col>
                    <Col span={18}>
                        <Slider
                        range
                        dots
                        min={0}
                        max={this.props.bookRange}
                        defaultValue={[0, this.props.bookRange]}
                        disabled={false}
                        onAfterChange={this.onChangeBookScope} />
                    </Col>
                    <Col span={4} className="content-center">
                        {this.state.fromBook + ' - ' + this.state.toBook}
                    </Col>
                </Row>

            </div>
        );

    }
}

export default SearchScopeChooser;