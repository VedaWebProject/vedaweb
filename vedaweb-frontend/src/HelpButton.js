import React, { Component } from "react";
import { Icon, Modal } from 'antd';
import help from "./img/help.png";

const helpTexts = {
    transliteration: {
        title: "Input Transliteration",
        content:
            <div>
                <p>
                    You can select one of the available transliteration standards for your search inputs.
                    This setting also applies to the Quick Search in the page header and will be saved as long as you stay 
                    on this website.
                </p>
            </div>
    },
    grammarSearch : {
        title: "Grammar Search",
        content:
            <div>
                <p>
                    Using the grammar search, you can find verses containing terms with certain grammatical properties.
                </p>
                <p>
                    Define a search term (optional) and select an attribute (like case, number, person, etc.)
                     and the value you are looking for (this is also optional). You may add multiple properties 
                     for the term by clicking the plus-button to the right.
                </p>
                <p>
                    To add more than one term to find in a verse, click on the plus-button below. This will display 
                    another block which lets you define the additional term.
                </p>
            </div>
    },
    searchScope : {
        title: "Search Range",
        content:
            <div>
                <p>
                    The search range setting lets you specify ranges of books (and hymns) to limit the search to. 
                    You may add more ranges by clicking the plus-button to the right of each line.
                </p>
            </div>
    },
    searchMetaFilters : {
        title: "Meta Filters",
        content:
            <div>
                <p>
                    By setting up meta filters, you can limit your search to verses matching the specified meta properties.
                </p>
                <p>
                    It is possible to select multiple values per property. The results will only contain verses 
                    that match one of the selected values of each property specified!
                </p>
            </div>
    },
    zurichIso : {
        title: "Rigveda from Zürich",
        content:
            <div>
                <p>
                    This is the Rigveda text from Zürich.
                </p>
            </div>
    },
    zurichGlossing : {
        title: "Morphological glossings from Zürich",
        content:
            <div>
                <p>
                    These are morphological glossings from Zürich.
                </p>
            </div>
    },
};


class HelpButton extends Component {

    state = { visible: false }

    showModal = () => {
        if (helpTexts.hasOwnProperty(this.props.type)){
            this.setState({
                visible: true,
            });
        } else {
            console.log("Error: '" + this.props.type + "' is not a valid help text type, so i won't open the help view.")
        }
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        const modalHeader = !helpTexts.hasOwnProperty(this.props.type) ? "" :
            <div className="secondary-font red bold">
                <img
                src={help}
                alt=""
                style={{height:"32px", paddingRight:"1rem"}}/>
                <span style={{verticalAlign:"middle"}}>
                    {helpTexts[this.props.type].title}
                </span>
            </div>;

        const containerStyle = {
            textAlign: this.props.align === undefined ? "right" : this.props.align,
            float: this.props.float === undefined ? "none" : (this.props.align === undefined ? "right" : this.props.align)
        }

        return (
            
            <div style={containerStyle}>
                <Icon
                type="question-circle"
                theme="outlined"
                onClick={this.showModal}
                style={{cursor:"pointer", margin:"0"}}/>
                
                {this.state.visible &&
                    <Modal
                    title={modalHeader}
                    centered
                    footer={null}
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="OK">
                        {helpTexts[this.props.type].content}
                    </Modal>
                }
            </div>
        );

    }

}

export default HelpButton;