import React, { Component } from "react";
import { Row, Col, Select, Icon } from 'antd';

import './css/SearchTransliteration.css';

const Option = Select.Option;


class SearchTransliteration extends Component {

    constructor(props){
        super(props);
    }


    render() {

        return (

            <div className="search-settings-category bottom-gap">
                <div className="search-settings-category-title">Input Transliteration</div>
                <Select
                value={this.props.value}
                className="full-width"
                onSelect={this.props.onSelect}>
                    {this.props.options.map((option, i) => (
                        <Option
                        key={'trans_' + option.id}
                        value={option.id}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            </div>

        );

    }
}

export default SearchTransliteration;