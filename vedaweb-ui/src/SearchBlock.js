import React, { Component } from "react";

import SearchField from "./SearchField";

import './SearchBlock.css'


class SearchBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchFields: [],
            blockData: []
        };

        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
        this.updateBlockData = this.updateBlockData.bind(this);
    }

    componentDidMount(){
        this.addField();
    }

    addField(){
        var fieldId = 'field_' + Date.now();
        this.setState({
            searchFields : this.state.searchFields.concat({'fieldId': fieldId})
        });
    }

    removeField(toRemove){
        var newBlockData = this.state.blockData.filter(field => toRemove.props.fieldId !== field.fieldId);

        this.setState({
            searchFields: this.state.searchFields.filter(field => toRemove.props.fieldId !== field.fieldId),
            blockData: newBlockData
        });

        this.props.onUpdateBlockData({blockId: this.props.blockId, blockData: newBlockData});
    }

    updateBlockData(updatedField){
        var newBlockData = this.state.blockData.filter(field => field.fieldId !== updatedField.fieldId);
        
        if (updatedField.fieldValue != null)
            newBlockData = newBlockData.concat(updatedField);

        this.setState({
            blockData: newBlockData
        });

        this.props.onUpdateBlockData({blockId: this.props.blockId, blockData: newBlockData});
    }


    render() {
        return (

                <div className="search-block">
                    
                    {this.state.searchFields.map((field, i) => (
                        <SearchField
                        key={field.fieldId}
                        fieldId={field.fieldId}
                        isFirstField={i === 0}
                        onClickRemove={this.removeField}
                        onClickAdd={this.addField}
                        onSetData={this.updateBlockData}
                        isRemovable={this.state.searchFields.length > 1}
                        isLastField={this.state.searchFields.length < 4 && this.state.searchFields.length === i + 1}
                        grammarData={this.props.grammarData} />
                    ))}

                </div>
            
        );
    }
}

export default SearchBlock;